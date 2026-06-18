import { create } from 'zustand'
import { Portfolio, AIAnalysis, RWAPriceFeed } from './casper'
import { ActivityStep } from '@/components/AgentActivityLog'

export interface AgentStep {
  message: string
  status: 'pending' | 'success' | 'error' | 'rwa'
  timestamp: string
}

interface AppState {
  walletAddress: string | null
  portfolio: Portfolio | null
  analysis: AIAnalysis | null
  loading: boolean
  error: string | null
  x402PaymentStatus: 'idle' | 'pending' | 'success' | 'failed'
  activityLog: ActivityStep[]
  rwaPrices: RWAPriceFeed | null
  /** Real-time terminal-style steps shown during analysis */
  agentSteps: AgentStep[]
  setWalletAddress: (address: string | null) => void
  setPortfolio: (portfolio: Portfolio | null) => void
  setAnalysis: (analysis: AIAnalysis | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setX402PaymentStatus: (status: 'idle' | 'pending' | 'success' | 'failed') => void
  setActivityLog: (log: ActivityStep[]) => void
  appendActivityStep: (step: ActivityStep) => void
  updateActivityStep: (id: string, updates: Partial<ActivityStep>) => void
  setRwaPrices: (prices: RWAPriceFeed | null) => void
  addAgentStep: (step: AgentStep) => void
  clearAgentSteps: () => void
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  walletAddress: null,
  portfolio: null,
  analysis: null,
  loading: false,
  error: null,
  x402PaymentStatus: 'idle',
  activityLog: [],
  rwaPrices: null,
  agentSteps: [],
  setWalletAddress: (address) => set({ walletAddress: address }),
  setPortfolio: (portfolio) => set({ portfolio }),
  setAnalysis: (analysis) => set({ analysis }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setX402PaymentStatus: (status) => set({ x402PaymentStatus: status }),
  setActivityLog: (log) => set({ activityLog: log }),
  appendActivityStep: (step) =>
    set((state) => ({ activityLog: [...state.activityLog, step] })),
  updateActivityStep: (id, updates) =>
    set((state) => ({
      activityLog: state.activityLog.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),
  setRwaPrices: (prices) => set({ rwaPrices: prices }),
  addAgentStep: (step) =>
    set((state) => ({ agentSteps: [...state.agentSteps, step] })),
  clearAgentSteps: () => set({ agentSteps: [] }),
  reset: () =>
    set({
      walletAddress: null,
      portfolio: null,
      analysis: null,
      loading: false,
      error: null,
      x402PaymentStatus: 'idle',
      activityLog: [],
      rwaPrices: null,
      agentSteps: [],
    }),
}))
