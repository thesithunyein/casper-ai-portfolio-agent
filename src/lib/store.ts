import { create } from 'zustand'
import { Portfolio, AIAnalysis } from './casper'

interface AppState {
  walletAddress: string | null
  portfolio: Portfolio | null
  analysis: AIAnalysis | null
  loading: boolean
  error: string | null
  x402PaymentStatus: 'idle' | 'pending' | 'success' | 'failed'
  setWalletAddress: (address: string | null) => void
  setPortfolio: (portfolio: Portfolio | null) => void
  setAnalysis: (analysis: AIAnalysis | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setX402PaymentStatus: (status: 'idle' | 'pending' | 'success' | 'failed') => void
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  walletAddress: null,
  portfolio: null,
  analysis: null,
  loading: false,
  error: null,
  x402PaymentStatus: 'idle',
  setWalletAddress: (address) => set({ walletAddress: address }),
  setPortfolio: (portfolio) => set({ portfolio }),
  setAnalysis: (analysis) => set({ analysis }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setX402PaymentStatus: (status) => set({ x402PaymentStatus: status }),
  reset: () =>
    set({
      walletAddress: null,
      portfolio: null,
      analysis: null,
      loading: false,
      error: null,
      x402PaymentStatus: 'idle',
    }),
}))
