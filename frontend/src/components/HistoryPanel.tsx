import { useEffect, useRef } from 'react'
import { useCalculatorStore } from '../store/useCalculatorStore'
import type { CalculationResponse } from '../api/calculatorApi'

export function HistoryPanel() {
  const history = useCalculatorStore((s) => s.history)
  const clearHistory = useCalculatorStore((s) => s.clearHistory)
  const appendToExpression = useCalculatorStore((s) => s.appendToExpression)
  const clearExpression = useCalculatorStore((s) => s.clearExpression)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const restoreItem = (item: CalculationResponse) => {
    clearExpression()
    appendToExpression(item.expression)
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-700 shadow-xl flex flex-col h-full min-h-[400px] lg:min-h-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h2 className="text-gray-300 text-sm font-semibold uppercase tracking-wider">History</h2>
        <button
          onClick={() => void clearHistory()}
          className="text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {history.length === 0 ? (
          <p className="text-gray-600 text-sm text-center mt-8">No history yet</p>
        ) : (
          [...history].reverse().map((item, idx) => (
            <button
              key={idx}
              onClick={() => restoreItem(item)}
              className="w-full text-left rounded-xl px-3 py-2 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 transition-colors group"
            >
              <div className="text-gray-400 text-xs font-mono truncate group-hover:text-gray-300">
                {item.expression}
              </div>
              {item.error ? (
                <div className="text-red-400 text-xs mt-0.5 truncate">{item.error}</div>
              ) : (
                <div className="text-white text-sm font-mono mt-0.5 truncate">
                  = {item.result}
                </div>
              )}
              <div className="text-gray-600 text-xs mt-1">
                {new Date(item.timestamp).toLocaleTimeString()}
              </div>
            </button>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
