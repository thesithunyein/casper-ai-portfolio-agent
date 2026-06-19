/**
 * Casper MCP (Model Context Protocol) Server Integration
 *
 * Connects to Casper MCP servers to provide the AI agent with direct blockchain
 * access for queries, trades, and portfolio management. This module acts as a
 * client that calls MCP server endpoints to enrich the agent's context with
 * on-chain data beyond what CSPR.cloud alone provides.
 *
 * Supported MCP servers:
 * - Casper MCP Server: blockchain queries (account info, contract state, blocks)
 * - CSPR.trade MCP: DEX data (swap prices, liquidity pools, trade history)
 *
 * Configure via env:
 * - CASPER_MCP_URL: Base URL of the Casper MCP server (e.g. http://localhost:3001)
 * - CSPR_TRADE_MCP_URL: Base URL of the CSPR.trade MCP server
 *
 * When MCP servers are not configured, the module gracefully degrades —
 * the agent continues to work with CSPR.cloud data only.
 */

export interface MCPAccountInfo {
  publicKey: string
  balance: string
  nonce: number
  activeBids: number
  inactiveBids: number
  lockedBalance: string
}

export interface MCPLiquidityPool {
  contractHash: string
  tokenA: string
  tokenB: string
  reserveA: string
  reserveB: string
  priceRatio: number
  liquidityUsd: number
}

export interface MCPContractState {
  contractHash: string
  entryPoints: string[]
  namedKeys: { name: string; key: string }[]
  balance: string
}

export interface MCPMarketData {
  tokenSymbol: string
  priceUsd: number
  change24h: number
  volume24h: number
  liquidityUsd: number
  source: string
}

export interface MCPEnrichment {
  accountInfo: MCPAccountInfo | null
  liquidityPools: MCPLiquidityPool[]
  marketData: MCPMarketData[]
  dexPrices: { token: string; price: number; source: string }[]
  mcpServersConnected: string[]
  fetchedAt: string
}

const MCP_TIMEOUT_MS = 5000

const fetchWithTimeout = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), MCP_TIMEOUT_MS)
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Query the Casper MCP server for on-chain account information.
 * Returns null if MCP is not configured or the query fails.
 */
const queryAccountInfo = async (
  walletAddress: string
): Promise<MCPAccountInfo | null> => {
  const mcpUrl = process.env.CASPER_MCP_URL?.replace(/\/$/, '')
  if (!mcpUrl) return null

  try {
    const res = await fetchWithTimeout(
      `${mcpUrl}/query/account/${walletAddress}`,
      { headers: { 'Content-Type': 'application/json' } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return {
      publicKey: data.publicKey || walletAddress,
      balance: data.balance || '0',
      nonce: data.nonce || 0,
      activeBids: data.activeBids || 0,
      inactiveBids: data.inactiveBids || 0,
      lockedBalance: data.lockedBalance || '0',
    }
  } catch {
    return null
  }
}

/**
 * Query the CSPR.trade MCP server for DEX liquidity pool data.
 * Returns available pools and price ratios for DeFi context.
 */
const queryLiquidityPools = async (): Promise<MCPLiquidityPool[]> => {
  const tradeMcpUrl = process.env.CSPR_TRADE_MCP_URL?.replace(/\/$/, '')
  if (!tradeMcpUrl) return []

  try {
    const res = await fetchWithTimeout(`${tradeMcpUrl}/pools`, {
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return []
    const data = await res.json()
    const pools = Array.isArray(data?.pools) ? data.pools : []
    return pools.slice(0, 10).map((p: Record<string, unknown>) => ({
      contractHash: String(p.contractHash || ''),
      tokenA: String(p.tokenA || ''),
      tokenB: String(p.tokenB || ''),
      reserveA: String(p.reserveA || '0'),
      reserveB: String(p.reserveB || '0'),
      priceRatio: Number(p.priceRatio || 0),
      liquidityUsd: Number(p.liquidityUsd || 0),
    }))
  } catch {
    return []
  }
}

/**
 * Query CSPR.trade MCP for current DEX swap prices.
 */
const queryDexPrices = async (
  tokens: string[]
): Promise<{ token: string; price: number; source: string }[]> => {
  const tradeMcpUrl = process.env.CSPR_TRADE_MCP_URL?.replace(/\/$/, '')
  if (!tradeMcpUrl) return []

  try {
    const res = await fetchWithTimeout(
      `${tradeMcpUrl}/prices?tokens=${tokens.join(',')}`,
      { headers: { 'Content-Type': 'application/json' } }
    )
    if (!res.ok) return []
    const data = await res.json()
    const prices = Array.isArray(data?.prices) ? data.prices : []
    return prices.map((p: Record<string, unknown>) => ({
      token: String(p.token || ''),
      price: Number(p.price || 0),
      source: 'cspr.trade-mcp',
    }))
  } catch {
    return []
  }
}

/**
 * Query Casper MCP server for contract state information.
 * Useful for inspecting the PortfolioAgent contract or any on-chain contract.
 */
export const queryContractState = async (
  contractHash: string
): Promise<MCPContractState | null> => {
  const mcpUrl = process.env.CASPER_MCP_URL?.replace(/\/$/, '')
  if (!mcpUrl) return null

  try {
    const res = await fetchWithTimeout(
      `${mcpUrl}/query/contract/${contractHash}`,
      { headers: { 'Content-Type': 'application/json' } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return {
      contractHash,
      entryPoints: Array.isArray(data.entryPoints) ? data.entryPoints : [],
      namedKeys: Array.isArray(data.namedKeys) ? data.namedKeys : [],
      balance: String(data.balance || '0'),
    }
  } catch {
    return null
  }
}

/**
 * Main enrichment function: queries all configured MCP servers in parallel
 * and returns a unified context object for the AI agent.
 *
 * This data supplements (not replaces) the CSPR.cloud portfolio data,
 * giving the AI agent a richer on-chain view for better analysis.
 */
export const enrichWithMCP = async (
  walletAddress: string,
  portfolioTokens: string[]
): Promise<MCPEnrichment> => {
  const connectedServers: string[] = []

  const [accountInfo, liquidityPools, dexPrices] = await Promise.all([
    queryAccountInfo(walletAddress),
    queryLiquidityPools(),
    queryDexPrices(portfolioTokens),
  ])

  if (process.env.CASPER_MCP_URL) connectedServers.push('casper-mcp')
  if (process.env.CSPR_TRADE_MCP_URL) connectedServers.push('cspr.trade-mcp')

  const marketData: MCPMarketData[] = dexPrices.map((dp) => ({
    tokenSymbol: dp.token,
    priceUsd: dp.price,
    change24h: 0,
    volume24h: 0,
    liquidityUsd: 0,
    source: dp.source,
  }))

  return {
    accountInfo,
    liquidityPools,
    marketData,
    dexPrices,
    mcpServersConnected: connectedServers,
    fetchedAt: new Date().toISOString(),
  }
}

/** True when at least one MCP server is configured. */
export const isMCPConfigured = (): boolean =>
  Boolean(process.env.CASPER_MCP_URL || process.env.CSPR_TRADE_MCP_URL)

/**
 * Build an MCP context string for injection into the AI system prompt.
 * Returns empty string when no MCP data is available.
 */
export const buildMCPContextString = (enrichment: MCPEnrichment): string => {
  if (enrichment.mcpServersConnected.length === 0) return ''

  const parts: string[] = []

  if (enrichment.mcpServersConnected.length > 0) {
    parts.push(
      `\nMCP Servers Connected: ${enrichment.mcpServersConnected.join(', ')}`
    )
  }

  if (enrichment.accountInfo) {
    parts.push(
      `On-Chain Account (via MCP): balance=${enrichment.accountInfo.balance} CSPR, nonce=${enrichment.accountInfo.nonce}, locked=${enrichment.accountInfo.lockedBalance}`
    )
  }

  if (enrichment.liquidityPools.length > 0) {
    const poolText = enrichment.liquidityPools
      .map(
        (p) =>
          `${p.tokenA}/${p.tokenB}: ratio=${p.priceRatio}, liquidity=$${p.liquidityUsd}`
      )
      .join('; ')
    parts.push(`DEX Liquidity Pools (via CSPR.trade MCP): ${poolText}`)
  }

  if (enrichment.dexPrices.length > 0) {
    const priceText = enrichment.dexPrices
      .map((p) => `${p.token}=$${p.price}`)
      .join(', ')
    parts.push(`DEX Prices (via CSPR.trade MCP): ${priceText}`)
  }

  return parts.length > 0
    ? `\n\n--- MCP Server Context ---\n${parts.join('\n')}\n--- End MCP Context ---\n`
    : ''
}

/**
 * Get MCP configuration status for diagnostics.
 */
export const getMCPDiagnostics = () => ({
  casperMcpUrl: process.env.CASPER_MCP_URL
    ? `${process.env.CASPER_MCP_URL.replace(/\/$/, '')} (configured)`
    : 'not configured',
  csprTradeMcpUrl: process.env.CSPR_TRADE_MCP_URL
    ? `${process.env.CSPR_TRADE_MCP_URL.replace(/\/$/, '')} (configured)`
    : 'not configured',
  isMCPConfigured: isMCPConfigured(),
})
