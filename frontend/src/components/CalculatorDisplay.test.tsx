import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CalculatorDisplay } from './CalculatorDisplay'
import { useCalculatorStore } from '../store/useCalculatorStore'

function resetStore() {
  useCalculatorStore.setState({
    expression: '',
    result: '',
    error: null,
    angleMode: 'DEGREES',
    memory: 0,
    isLoading: false,
    history: [],
  })
}

describe('CalculatorDisplay', () => {
  beforeEach(() => {
    resetStore()
  })

  it('renders the display container', () => {
    render(<CalculatorDisplay />)
    expect(screen.getByTestId('calculator-display')).toBeInTheDocument()
  })

  it('shows the angle mode indicator', () => {
    render(<CalculatorDisplay />)
    expect(screen.getByTestId('angle-mode-indicator')).toHaveTextContent('DEGREES')
  })

  it('renders the current expression', () => {
    useCalculatorStore.setState({ expression: '3+4' })
    render(<CalculatorDisplay />)
    expect(screen.getByTestId('expression-display')).toHaveTextContent('3+4')
  })

  it('renders the result when calculation succeeds', () => {
    useCalculatorStore.setState({ result: '7', error: null })
    render(<CalculatorDisplay />)
    expect(screen.getByTestId('result-display')).toHaveTextContent('7')
  })

  it('renders the error message when there is an error', () => {
    useCalculatorStore.setState({ error: 'Division by zero', result: '' })
    render(<CalculatorDisplay />)
    expect(screen.getByTestId('error-display')).toHaveTextContent('Division by zero')
  })

  it('does not show result display when there is an error', () => {
    useCalculatorStore.setState({ error: 'Invalid expression', result: '' })
    render(<CalculatorDisplay />)
    expect(screen.queryByTestId('result-display')).not.toBeInTheDocument()
  })

  it('does not show error display when result is present', () => {
    useCalculatorStore.setState({ result: '42', error: null })
    render(<CalculatorDisplay />)
    expect(screen.queryByTestId('error-display')).not.toBeInTheDocument()
  })

  it('shows RADIANS when angle mode is RADIANS', () => {
    useCalculatorStore.setState({ angleMode: 'RADIANS' })
    render(<CalculatorDisplay />)
    expect(screen.getByTestId('angle-mode-indicator')).toHaveTextContent('RADIANS')
  })
})
