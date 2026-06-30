import { useEffect } from 'react'
import { CalculatorDisplay } from './components/CalculatorDisplay'
import { ButtonPad } from './components/ButtonPad'
import { HistoryPanel } from './components/HistoryPanel'
import { useCalculatorStore } from './store/useCalculatorStore'

function App() {
  const loadHistory = useCalculatorStore((s) => s.loadHistory)

  useEffect(() => {
    void loadHistory()
  }, [loadHistory])

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl">
        <div className="flex flex-col gap-4 flex-1">
          <CalculatorDisplay />
          <ButtonPad />
        </div>
        <div className="lg:w-72">
          <HistoryPanel />
        </div>
      </div>
    </div>
  )
}

export default App
