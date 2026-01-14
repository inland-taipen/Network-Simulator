export interface Transaction {
  id: string
  amount: number
  recipient: string
  timestamp: number
  status: 'pending' | 'completed' | 'failed'
}

export interface SendMoneyRequest {
  amount: number
  recipient: string
}