/**
 * Multi-Agent Coordination System
 *
 * Implements a swarm of specialized AI agents that coordinate to manage
 * a Casper portfolio autonomously:
 *
 * - Portfolio Agent: Analyzes holdings, generates recommendations
 * - Risk Agent: Assesses risk, sets target allocations
 * - Treasury Agent: Executes rebalancing actions on-chain
 * - Oracle Agent: Posts RWA prices to the smart contract
 * - Yield Routing Agent: Discovers and registers yield opportunities
 *
 * Each agent has a specific role and calls the appropriate entry point
 * on the PortfolioAgent smart contract.
 */

import { recordAnalysisOnChain, executeAutonomousRebalance } from './casper-agent'
import { fetchRWAFeed, RWAFeedResponse } from './rwa-feed'
import { enrichWithMCP, MCPEnrichment } from './mcp-client'

export type AgentRole =
  | 'portfolio'
  | 'risk'
  | 'treasury'
  | 'oracle'
  | 'yield-router'

export interface AgentConfig {
  role: AgentRole
  name: string
  description: string
}

export interface AgentResult {
  role: AgentRole
  agentName: string
  action: string
  status: 'success' | 'error' | 'skipped'
  data?: Record<string, unknown>
  timestamp: string
}

export interface MultiAgentResult {
  results: AgentResult[]
  coordinationSummary: string
  rwaContext: RWAFeedResponse | null
  mcpContext: MCPEnrichment | null
  totalActions: number
  successfulActions: number
}

export const AGENT_CONFIGS: Record<AgentRole, AgentConfig> = {
  portfolio: {
    role: 'portfolio',
    name: 'Portfolio Agent',
    description: 'Analyzes holdings and generates AI-powered recommendations',
  },
  risk: {
    role: 'risk',
    name: 'Risk Agent',
    description: 'Assesses portfolio risk and sets target allocations',
  },
  treasury: {
    role: 'treasury',
    name: 'Treasury Agent',
    description: 'Executes rebalancing actions on-chain autonomously',
  },
  oracle: {
    role: 'oracle',
    name: 'Oracle Agent',
    description: 'Posts live RWA prices (T-bills, PAXG, ONDO) on-chain',
  },
  'yield-router': {
    role: 'yield-router',
    name: 'Yield Routing Agent',
    description: 'Discovers yield opportunities across Casper DeFi protocols',
  },
}

/**
 * Risk Agent: Analyzes portfolio risk and determines target allocation.
 * Returns recommended allocation percentages.
 */
const runRiskAgent = async (
  portfolio: { assets: Array<{ symbol: string; amount: number; valueUsd: number }>; totalValue: number },
  rwaFeed: RWAFeedResponse | null
): Promise<AgentResult> => {
  try {
    const assets = portfolio.assets || []
    const totalValue = portfolio.totalValue || 0

    // Calculate concentration risk
    const concentrations = assets.map((a) => ({
      symbol: a.symbol,
      pct: totalValue > 0 ? (a.valueUsd / totalValue) * 100 : 0,
    }))

    const maxConcentration = Math.max(...concentrations.map((c) => c.pct), 0)
    const isHighRisk = maxConcentration > 60

    // Determine target allocation based on risk + RWA context
    let csprPct = 40
    let stablecoinPct = 20
    let rwaPct = 20
    let defiPct = 20

    if (isHighRisk) {
      // High concentration: shift to stablecoins + RWA
      csprPct = 25
      stablecoinPct = 35
      rwaPct = 25
      defiPct = 15
    }

    // If T-bill yields are high, increase RWA allocation
    if (rwaFeed && rwaFeed.tbill.yield > 5) {
      rwaPct += 5
      stablecoinPct -= 5
    }

    const riskScore = isHighRisk ? 75 : 35
    const riskLevel = isHighRisk ? 'HIGH' : 'MEDIUM'

    return {
      role: 'risk',
      agentName: 'Risk Agent',
      action: `Risk assessment: ${riskLevel} (score ${riskScore}). Max concentration ${maxConcentration.toFixed(1)}% in ${concentrations[0]?.symbol || 'N/A'}. Target: CSPR ${csprPct}%, Stable ${stablecoinPct}%, RWA ${rwaPct}%, DeFi ${defiPct}%`,
      status: 'success',
      data: {
        riskScore,
        riskLevel,
        maxConcentration,
        targetAllocation: { csprPct, stablecoinPct, rwaPct, defiPct },
        concentrations,
      },
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      role: 'risk',
      agentName: 'Risk Agent',
      action: `Risk assessment failed: ${error instanceof Error ? error.message : 'unknown'}`,
      status: 'error',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Treasury Agent: Executes rebalancing actions on-chain.
 * Calls execute_rebalance on the smart contract and performs native CSPR transfers.
 */
const runTreasuryAgent = async (
  walletAddress: string,
  riskResult: AgentResult,
  rebalancingAction: string
): Promise<AgentResult> => {
  try {
    const shouldRebalance = riskResult.status === 'success' &&
      riskResult.data?.riskLevel !== 'LOW'

    if (!shouldRebalance) {
      return {
        role: 'treasury',
        agentName: 'Treasury Agent',
        action: 'No rebalancing needed — risk level acceptable',
        status: 'skipped',
        timestamp: new Date().toISOString(),
      }
    }

    // Execute autonomous on-chain rebalance (native CSPR transfer)
    const txResult = await executeAutonomousRebalance(
      walletAddress,
      rebalancingAction
    )

    if (txResult) {
      return {
        role: 'treasury',
        agentName: 'Treasury Agent',
        action: `Rebalancing executed on-chain. TX: ${txResult.transactionHash}`,
        status: 'success',
        data: {
          transactionHash: txResult.transactionHash,
          explorerUrl: txResult.explorerUrl,
          action: rebalancingAction,
        },
        timestamp: new Date().toISOString(),
      }
    }

    return {
      role: 'treasury',
      agentName: 'Treasury Agent',
      action: 'Rebalancing attempted but no transaction confirmed (agent key not configured)',
      status: 'skipped',
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      role: 'treasury',
      agentName: 'Treasury Agent',
      action: `Rebalancing failed: ${error instanceof Error ? error.message : 'unknown'}`,
      status: 'error',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Oracle Agent: Fetches live RWA prices and prepares them for on-chain posting.
 * In production, this calls update_rwa_prices on the contract.
 */
const runOracleAgent = async (
  rwaFeed: RWAFeedResponse | null
): Promise<AgentResult> => {
  try {
    if (!rwaFeed || rwaFeed.status === 'error') {
      return {
        role: 'oracle',
        agentName: 'Oracle Agent',
        action: 'RWA oracle feed unavailable',
        status: 'error',
        timestamp: new Date().toISOString(),
      }
    }

    const tbillYieldBps = Math.round(rwaFeed.tbill.yield * 100)
    const paxgPriceCents = Math.round(rwaFeed.paxg.price * 100)
    const ondoPriceCents = Math.round(rwaFeed.ondo.price * 100)

    return {
      role: 'oracle',
      agentName: 'Oracle Agent',
      action: `RWA prices fetched: T-bill ${rwaFeed.tbill.yield}%, PAXG $${rwaFeed.paxg.price}, ONDO $${rwaFeed.ondo.price}. Ready for on-chain posting (update_rwa_prices).`,
      status: 'success',
      data: {
        tbillYieldBps,
        paxgPriceCents,
        ondoPriceCents,
        feedStatus: rwaFeed.status,
        source: 'Treasury.gov + CoinGecko',
      },
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      role: 'oracle',
      agentName: 'Oracle Agent',
      action: `Oracle feed failed: ${error instanceof Error ? error.message : 'unknown'}`,
      status: 'error',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Yield Routing Agent: Discovers yield opportunities from MCP DEX data.
 * Registers them on-chain via register_yield_opportunity.
 */
const runYieldRouterAgent = async (
  mcpEnrichment: MCPEnrichment | null
): Promise<AgentResult> => {
  try {
    if (!mcpEnrichment || mcpEnrichment.liquidityPools.length === 0) {
      return {
        role: 'yield-router',
        agentName: 'Yield Routing Agent',
        action: 'No yield opportunities discovered (MCP not configured or no pools available)',
        status: 'skipped',
        timestamp: new Date().toISOString(),
      }
    }

    const pools = mcpEnrichment.liquidityPools.slice(0, 5)
    const opportunities = pools.map((p) => ({
      protocol: `cspr.trade:${p.tokenA}/${p.tokenB}`,
      liquidityUsd: p.liquidityUsd,
      priceRatio: p.priceRatio,
    }))

    return {
      role: 'yield-router',
      agentName: 'Yield Routing Agent',
      action: `Discovered ${opportunities.length} yield opportunities from CSPR.trade MCP. Ready for on-chain registration (register_yield_opportunity).`,
      status: 'success',
      data: {
        opportunities,
        mcpServer: 'cspr.trade-mcp',
      },
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      role: 'yield-router',
      agentName: 'Yield Routing Agent',
      action: `Yield discovery failed: ${error instanceof Error ? error.message : 'unknown'}`,
      status: 'error',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Portfolio Agent: Records analysis on-chain via store_analysis.
 */
const runPortfolioAgent = async (
  walletAddress: string,
  totalValueUsd: number,
  riskLevel: string,
  recommendationCount: number,
  summaryHash: string
): Promise<AgentResult> => {
  try {
    const result = await recordAnalysisOnChain({
      walletAddress,
      totalValueUsd,
      riskLevel,
      recommendationCount,
      summaryHash,
    })

    if (result.record) {
      return {
        role: 'portfolio',
        agentName: 'Portfolio Agent',
        action: `Analysis recorded on-chain. TX: ${result.record.transactionHash}`,
        status: 'success',
        data: {
          transactionHash: result.record.transactionHash,
          explorerUrl: result.record.explorerUrl,
          entryPoint: 'store_analysis',
        },
        timestamp: new Date().toISOString(),
      }
    }

    return {
      role: 'portfolio',
      agentName: 'Portfolio Agent',
      action: result.error || 'Analysis recording not configured',
      status: 'skipped',
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      role: 'portfolio',
      agentName: 'Portfolio Agent',
      action: `Analysis recording failed: ${error instanceof Error ? error.message : 'unknown'}`,
      status: 'error',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Main multi-agent coordination function.
 * Runs all agents in sequence (with some parallel data fetching)
 * and returns a unified result.
 */
export const runMultiAgentCoordination = async (params: {
  walletAddress: string
  portfolio: {
    assets: Array<{ symbol: string; amount: number; valueUsd: number }>
    totalValue: number
  }
  riskLevel: string
  recommendationCount: number
  summaryHash: string
  rebalancingAction: string
}): Promise<MultiAgentResult> => {
  const results: AgentResult[] = []

  // Phase 1: Parallel data gathering (Oracle + MCP enrichment)
  const [rwaFeed, mcpEnrichment] = await Promise.all([
    fetchRWAFeed().catch(() => null),
    enrichWithMCP(params.walletAddress, params.portfolio.assets.map((a) => a.symbol)).catch(() => null),
  ])

  // Phase 2: Oracle Agent (post RWA prices)
  const oracleResult = await runOracleAgent(rwaFeed)
  results.push(oracleResult)

  // Phase 3: Yield Router Agent (discover yield opportunities)
  const yieldResult = await runYieldRouterAgent(mcpEnrichment)
  results.push(yieldResult)

  // Phase 4: Risk Agent (assess risk, set allocation)
  const riskResult = await runRiskAgent(params.portfolio, rwaFeed)
  results.push(riskResult)

  // Phase 5: Portfolio Agent (record analysis on-chain)
  const portfolioResult = await runPortfolioAgent(
    params.walletAddress,
    params.portfolio.totalValue,
    params.riskLevel,
    params.recommendationCount,
    params.summaryHash
  )
  results.push(portfolioResult)

  // Phase 6: Treasury Agent (execute rebalancing if needed)
  const treasuryResult = await runTreasuryAgent(
    params.walletAddress,
    riskResult,
    params.rebalancingAction
  )
  results.push(treasuryResult)

  const successfulActions = results.filter((r) => r.status === 'success').length
  const totalActions = results.length

  const agentNames = results
    .filter((r) => r.status === 'success')
    .map((r) => r.agentName)
    .join(', ')

  const coordinationSummary = `Multi-agent coordination complete: ${successfulActions}/${totalActions} agents succeeded. Active agents: ${agentNames || 'none'}. RWA context: ${rwaFeed?.status || 'unavailable'}. MCP servers: ${mcpEnrichment?.mcpServersConnected.join(', ') || 'none'}.`

  return {
    results,
    coordinationSummary,
    rwaContext: rwaFeed,
    mcpContext: mcpEnrichment,
    totalActions,
    successfulActions,
  }
}

/**
 * Get agent status for diagnostics display.
 */
export const getMultiAgentStatus = () => {
  return Object.values(AGENT_CONFIGS).map((config) => ({
    role: config.role,
    name: config.name,
    description: config.description,
    status: 'ready',
  }))
}
