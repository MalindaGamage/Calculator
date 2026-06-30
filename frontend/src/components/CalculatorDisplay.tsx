import { useCalculatorStore } from '../store/useCalculatorStore'

export function CalculatorDisplay() {
  const expression = useCalculatorStore((s) => s.expression)
  const result = useCalculatorStore((s) => s.result)
  const error = useCalculatorStore((s) => s.error)
  const angleMode = useCalculatorStore((s) => s.angleMode)
  const isLoading = useCalculatorStore((s) => s.isLoading)
  const memory = useCalculatorStore((s) => s.memory)

  return (
    <div
      data-testid="calculator-display"
      className="bg-gray-900 rounded-2xl p-4 border border-gray-700 shadow-xl"
    >
      <div className="flex justify-between items-center mb-2">
        <span
          data-testid="angle-mode-indicator"
          className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-700 text-indigo-100"
        >
          {angleMode}
        </span>
        {memory !== 0 && (
          <span className="text-xs text-yellow-400 font-mono">M: {memory}</span>
        )}
      </div>

      <div
        data-testid="expression-display"
        className="text-right text-gray-400 text-lg font-mono min-h-[1.75rem] truncate"
      >
        {expression || ' '}
      </div>

      <div className="mt-1 text-right min-h-[3rem] flex items-end justify-end">
        {isLoading ? (
          <span className="text-gray-500 text-2xl animate-pulse">…</span>
        ) : error ? (
          <span
            data-testid="error-display"
            className="text-red-400 text-base font-mono break-all text-right"
          >
            {error}
          </span>
        ) : (
          <span
            data-testid="result-display"
            className="text-white text-3xl font-mono font-light truncate"
          >
            {result || ' '}
          </span>
        )}
      </div>
    </div>
  )
}
