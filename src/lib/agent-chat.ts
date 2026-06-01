/**
 * Agent Chat Engine
 * Conversational AI portfolio manager that can query blockchain data via MCP
 * and execute actions via x402 payments
 */

import { Portfolio } from './casper'

export interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: Date
  actions?: AgentAction[]
}

export interface AgentAction {
  type: 'analyze' | 'rebalance' | 'pay' | 'explore'
  label: string
  payload?: any
}

/**
 * Generate agent response based on user message and portfolio context
 * Uses rule-based agent with Claude-enhanced responses
 */
export const generateAgentResponse = async (
  userMessage: string,
  portfolio: Portfolio | null,
  analysis: any | null
): Promise<{ message: string; actions: AgentAction[] }> => {
  const lowerMsg = userMessage.toLowerCase()
  
  // Rule-based intent detection with agentic actions
  if (lowerMsg.includes('analyze') || lowerMsg.includes('portfolio') || lowerMsg.includes('holdings')) {
    return {
      message: portfolio 
        ? `Your portfolio is valued at **$${portfolio.totalValue.toFixed(2)}** with ${portfolio.assets.length} assets. Your largest holding is ${portfolio.assets[0]?.symbol} at ${portfolio.assets[0]?.percentage.toFixed(1)}%. Would you like me to run a full AI analysis with risk assessment and rebalancing suggestions?`
        : `I don't see a connected portfolio yet. Please enter your Casper wallet address so I can analyze your holdings!`,
      actions: portfolio ? [
        { type: 'analyze', label: 'Run Full AI Analysis' },
        { type: 'explore', label: 'View Asset Breakdown' }
      ] : []
    }
  }
  
  if (lowerMsg.includes('risk') || lowerMsg.includes('safe') || lowerMsg.includes('dangerous')) {
    return {
      message: analysis?.riskAssessment
        ? `**Risk Assessment:** ${analysis.riskAssessment}\n\nBased on your current allocation, I can suggest adjustments to reduce risk while maintaining growth potential.`
        : `I need to analyze your portfolio first to assess risk. Shall I run the analysis?`,
      actions: [
        { type: 'analyze', label: 'Analyze Risk' }
      ]
    }
  }
  
  if (lowerMsg.includes('rebalance') || lowerMsg.includes('adjust') || lowerMsg.includes('allocation')) {
    return {
      message: analysis?.rebalancingSuggestion
        ? `**Rebalancing Suggestion:**\n${analysis.rebalancingSuggestion.action}\n\n${analysis.rebalancingSuggestion.reasoning}\n\nI can help you execute this rebalancing strategy step by step.`
        : `Let me analyze your portfolio first to generate optimal rebalancing targets. Ready?`,
      actions: [
        { type: 'rebalance', label: 'View Rebalancing Plan' },
        { type: 'analyze', label: 'Generate New Plan' }
      ]
    }
  }
  
  if (lowerMsg.includes('pay') || lowerMsg.includes('cost') || lowerMsg.includes('fee')) {
    return {
      message: `Each AI analysis costs **0.01 CSPR** via the x402 micropayment protocol. This ensures the agent can operate autonomously and sustainably on the Casper Network. The payment is processed on-chain with cryptographic proof.`,
      actions: [
        { type: 'pay', label: 'Pay for Analysis (0.01 CSPR)' }
      ]
    }
  }
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('help')) {
    return {
      message: `Hello! I'm your **Casper AI Portfolio Agent** 🐻✨\n\nI can help you:\n- Analyze your portfolio and assess risk\n- Suggest rebalancing strategies\n- Monitor your asset allocation\n- Execute analysis via x402 micropayments\n\nWhat would you like to do?`,
      actions: [
        { type: 'analyze', label: 'Analyze Portfolio' },
        { type: 'explore', label: 'Learn About x402' }
      ]
    }
  }
  
  // Default response with context awareness
  return {
    message: portfolio
      ? `I see you have a portfolio worth $${portfolio.totalValue.toFixed(2)}. I can analyze your risk, suggest rebalancing, or explain how x402 micropayments work. What would you like to explore?`
      : `I'm here to help manage your Casper portfolio! Connect your wallet and I can provide AI-powered analysis and rebalancing suggestions. What would you like to do?`,
    actions: portfolio ? [
      { type: 'analyze', label: 'Full Analysis' },
      { type: 'rebalance', label: 'Rebalance Suggestions' }
    ] : []
  }
}
