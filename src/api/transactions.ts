import { Transaction, SendMoneyRequest } from '../types'

export async function fetchTransactions(): Promise<Transaction[]> {
  const response = await fetch('/api/transactions')
  if (!response.ok) {
    throw new Error('Failed to fetch transactions')
  }
  return response.json()
}

export async function sendMoney(data: SendMoneyRequest): Promise<Transaction> {
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || 'Failed to send money')
  }

  return response.json()
}