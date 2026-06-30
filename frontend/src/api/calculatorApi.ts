import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface CalculationResponse {
  expression: string
  result?: number
  error?: string
  timestamp: string
}

export async function calculate(
  expression: string,
  angleMode: string,
): Promise<CalculationResponse> {
  const response = await apiClient.post<CalculationResponse>('/api/calculate', {
    expression,
    angleMode,
  })
  return response.data
}

export async function getHistory(): Promise<CalculationResponse[]> {
  const response = await apiClient.get<CalculationResponse[]>('/api/history')
  return response.data
}

export async function clearHistory(): Promise<void> {
  await apiClient.delete('/api/history')
}
