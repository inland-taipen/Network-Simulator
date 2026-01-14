import { http, HttpResponse, delay } from 'msw'

// Chaos mode state (shared across requests)
let chaosModeEnabled = false

export function setChaosMode(enabled: boolean) {
  chaosModeEnabled = enabled
}

export function getChaosMode() {
  return chaosModeEnabled
}

async function applyChaos(): Promise<{ shouldError: boolean }> {
  if (!chaosModeEnabled) return { shouldError: false }

  // Random latency (0-5s)
  const latency = Math.random() * 5000
  await delay(latency)

  // 10% chance of 500 error
  const shouldError = Math.random() < 0.1
  return { shouldError }
}

export const handlers = [
  // Get transactions
  http.get('/api/transactions', async () => {
    const chaos = await applyChaos()
    
    if (chaos.shouldError) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
    
    const transactions = [
      {
        id: '1',
        amount: 150.00,
        recipient: 'Alice Johnson',
        timestamp: Date.now() - 3600000,
        status: 'completed' as const,
      },
      {
        id: '2',
        amount: 75.50,
        recipient: 'Bob Smith',
        timestamp: Date.now() - 7200000,
        status: 'completed' as const,
      },
      {
        id: '3',
        amount: 200.00,
        recipient: 'Charlie Brown',
        timestamp: Date.now() - 10800000,
        status: 'completed' as const,
      },
    ]

    return HttpResponse.json(transactions)
  }),

  // Send money
  http.post('/api/transactions', async ({ request }) => {
    const chaos = await applyChaos()
    
    if (chaos.shouldError) {
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
    
    const body = await request.json() as { amount: number; recipient: string }
    
    const newTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      amount: body.amount,
      recipient: body.recipient,
      timestamp: Date.now(),
      status: 'completed' as const,
    }

    return HttpResponse.json(newTransaction, { status: 201 })
  }),
]