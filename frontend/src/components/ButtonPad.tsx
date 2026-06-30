import { useCalculatorStore } from '../store/useCalculatorStore'

type ButtonVariant = 'number' | 'operator' | 'function' | 'clear' | 'equals' | 'memory' | 'toggle'

interface CalcButton {
  label: string
  variant: ButtonVariant
  action: () => void
  wide?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  number: 'bg-gray-700 hover:bg-gray-600 text-white',
  operator: 'bg-blue-700 hover:bg-blue-600 text-white',
  function: 'bg-indigo-800 hover:bg-indigo-700 text-indigo-100',
  clear: 'bg-red-700 hover:bg-red-600 text-white',
  equals: 'bg-green-600 hover:bg-green-500 text-white font-bold',
  memory: 'bg-gray-600 hover:bg-gray-500 text-yellow-200',
  toggle: 'bg-purple-800 hover:bg-purple-700 text-purple-100',
}

export function ButtonPad() {
  const store = useCalculatorStore()

  const append = (v: string) => () => store.appendToExpression(v)

  const rows: CalcButton[][] = [
    [
      { label: store.angleMode === 'DEGREES' ? 'DEG' : 'RAD', variant: 'toggle', action: store.toggleAngleMode },
      { label: 'MC', variant: 'memory', action: store.memoryClear },
      { label: 'MR', variant: 'memory', action: store.memoryRecall },
      { label: 'MS', variant: 'memory', action: store.memoryStore },
      { label: 'M+', variant: 'memory', action: store.memoryAdd },
      { label: 'M-', variant: 'memory', action: () => {
        const result = store.result
        const num = parseFloat(result)
        if (!isNaN(num)) useCalculatorStore.setState((s) => ({ memory: s.memory - num }))
      }},
    ],
    [
      { label: 'sin', variant: 'function', action: append('sin(') },
      { label: 'cos', variant: 'function', action: append('cos(') },
      { label: 'tan', variant: 'function', action: append('tan(') },
      { label: '(', variant: 'function', action: append('(') },
      { label: ')', variant: 'function', action: append(')') },
      { label: 'C', variant: 'clear', action: store.clearExpression },
    ],
    [
      { label: 'asin', variant: 'function', action: append('asin(') },
      { label: 'acos', variant: 'function', action: append('acos(') },
      { label: 'atan', variant: 'function', action: append('atan(') },
      { label: 'x²', variant: 'function', action: append('^2') },
      { label: 'x³', variant: 'function', action: append('^3') },
      { label: 'xʸ', variant: 'function', action: append('^') },
    ],
    [
      { label: 'log', variant: 'function', action: append('log(') },
      { label: 'ln', variant: 'function', action: append('ln(') },
      { label: 'eˣ', variant: 'function', action: append('exp(') },
      { label: '√', variant: 'function', action: append('sqrt(') },
      { label: 'π', variant: 'function', action: append('pi') },
      { label: 'e', variant: 'function', action: append('e') },
    ],
    [
      { label: '7', variant: 'number', action: append('7') },
      { label: '8', variant: 'number', action: append('8') },
      { label: '9', variant: 'number', action: append('9') },
      { label: '/', variant: 'operator', action: append('/') },
      { label: 'n!', variant: 'function', action: append('!') },
      { label: '%', variant: 'operator', action: append('%') },
    ],
    [
      { label: '4', variant: 'number', action: append('4') },
      { label: '5', variant: 'number', action: append('5') },
      { label: '6', variant: 'number', action: append('6') },
      { label: '*', variant: 'operator', action: append('*') },
      { label: '⌫', variant: 'clear', action: store.deleteLast },
      { label: 'ANS', variant: 'function', action: () => {
        const result = store.result
        if (result) store.appendToExpression(result)
      }},
    ],
    [
      { label: '1', variant: 'number', action: append('1') },
      { label: '2', variant: 'number', action: append('2') },
      { label: '3', variant: 'number', action: append('3') },
      { label: '-', variant: 'operator', action: append('-') },
      { label: '(', variant: 'function', action: append('(') },
      { label: ')', variant: 'function', action: append(')') },
    ],
    [
      { label: '0', variant: 'number', action: append('0') },
      { label: '.', variant: 'number', action: append('.') },
      { label: '+/-', variant: 'number', action: () => {
        const expr = store.expression
        if (expr.startsWith('-')) {
          useCalculatorStore.setState({ expression: expr.slice(1) })
        } else {
          useCalculatorStore.setState({ expression: '-' + expr })
        }
      }},
      { label: '+', variant: 'operator', action: append('+') },
      { label: '=', variant: 'equals', action: () => void store.calculate(), wide: true },
    ],
  ]

  return (
    <div className="bg-gray-900 rounded-2xl p-3 border border-gray-700 shadow-xl">
      <div className="flex flex-col gap-2">
        {rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-6 gap-2">
            {row.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                className={[
                  'rounded-xl py-3 text-sm font-medium transition-colors duration-100 active:scale-95',
                  variantClasses[btn.variant],
                  btn.wide ? 'col-span-2' : '',
                ].join(' ')}
              >
                {btn.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
