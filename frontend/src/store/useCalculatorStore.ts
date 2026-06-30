import { create } from 'zustand'
import {
  calculate as apiCalculate,
  getHistory as apiGetHistory,
  clearHistory as apiClearHistory,
  type CalculationResponse,
} from '../api/calculatorApi'

interface CalculatorState {
  expression: string
  result: string
  history: CalculationResponse[]
  angleMode: 'DEGREES' | 'RADIANS'
  memory: number
  isLoading: boolean
  error: string | null

  appendToExpression: (value: string) => void
  clearExpression: () => void
  deleteLast: () => void
  calculate: () => Promise<void>
  toggleAngleMode: () => void
  memoryStore: () => void
  memoryRecall: () => void
  memoryAdd: () => void
  memoryClear: () => void
  loadHistory: () => Promise<void>
  clearHistory: () => Promise<void>
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  expression: '',
  result: '',
  history: [],
  angleMode: 'DEGREES',
  memory: 0,
  isLoading: false,
  error: null,

  appendToExpression: (value: string) => {
    set((state) => ({
      expression: state.expression + value,
      error: null,
    }))
  },

  clearExpression: () => {
    set({ expression: '', result: '', error: null })
  },

  deleteLast: () => {
    set((state) => ({
      expression: state.expression.slice(0, -1),
      error: null,
    }))
  },

  calculate: async () => {
    const { expression, angleMode } = get()
    if (!expression.trim()) return

    set({ isLoading: true, error: null })
    try {
      const response = await apiCalculate(expression, angleMode)
      if (response.error) {
        set({
          error: response.error,
          result: '',
          isLoading: false,
          history: [response, ...get().history],
        })
      } else {
        set({
          result: response.result !== undefined ? String(response.result) : '',
          error: null,
          isLoading: false,
          history: [response, ...get().history],
        })
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Calculation failed',
        isLoading: false,
      })
    }
  },

  toggleAngleMode: () => {
    set((state) => ({
      angleMode: state.angleMode === 'DEGREES' ? 'RADIANS' : 'DEGREES',
    }))
  },

  memoryStore: () => {
    const { result } = get()
    const num = parseFloat(result)
    if (!isNaN(num)) set({ memory: num })
  },

  memoryRecall: () => {
    const { memory } = get()
    set((state) => ({ expression: state.expression + String(memory) }))
  },

  memoryAdd: () => {
    const { result, memory } = get()
    const num = parseFloat(result)
    if (!isNaN(num)) set({ memory: memory + num })
  },

  memoryClear: () => {
    set({ memory: 0 })
  },

  loadHistory: async () => {
    try {
      const history = await apiGetHistory()
      set({ history })
    } catch {
      // silently ignore history load errors
    }
  },

  clearHistory: async () => {
    try {
      await apiClearHistory()
      set({ history: [] })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to clear history' })
    }
  },
}))
