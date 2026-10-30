import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App'

test('renders the application introduction in the main landmark', () => {
  render(<App />)

  const main = within(screen.getByRole('main'))

  expect(
    main.getByRole('heading', { level: 1, name: 'Document Extractor' }),
  ).toBeInTheDocument()
  expect(
    main.getByText('Extract and review parameter candidates with source evidence.'),
  ).toBeInTheDocument()
})
