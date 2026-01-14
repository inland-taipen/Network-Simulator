import { Transaction } from '../types'
import { getInitials, getAvatarColor } from '../utils/avatar'
import './TransactionList.css'

interface TransactionListProps {
  transactions: Transaction[]
  isLoading?: boolean
}

export function TransactionList({ transactions, isLoading }: TransactionListProps) {
  if (isLoading && transactions.length === 0) {
    return (
      <div className="transaction-list">
        {[1, 2, 3].map((i) => (
          <div key={i} className="transaction-skeleton">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-line-name"></div>
              <div className="skeleton-line skeleton-line-time"></div>
            </div>
            <div className="skeleton-amount"></div>
          </div>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="transaction-list-empty">
        <div className="empty-icon">💸</div>
        <p className="empty-title">No transactions yet</p>
        <p className="empty-subtitle">Send money to get started!</p>
      </div>
    )
  }

  return (
    <div className="transaction-list">
      {transactions.map((transaction, index) => (
        <div
          key={transaction.id}
          className={`transaction-item ${transaction.status}`}
          style={{
            animationDelay: `${index * 0.05}s`,
          }}
        >
          <div className="transaction-avatar" style={{ backgroundColor: getAvatarColor(transaction.recipient) }}>
            {getInitials(transaction.recipient)}
          </div>
          <div className="transaction-content">
            <div className="transaction-main">
              <div className="transaction-recipient">
                {transaction.recipient}
              </div>
              <div className="transaction-amount">
                ${transaction.amount.toFixed(2)}
              </div>
            </div>
            <div className="transaction-meta">
              <span className="transaction-time">
                {formatTimestamp(transaction.timestamp)}
              </span>
              {transaction.status === 'pending' && (
                <span className="transaction-status-badge">
                  <span className="status-dot"></span>
                  Pending...
                </span>
              )}
              {transaction.status === 'failed' && (
                <span className="transaction-status-badge failed">
                  <span className="status-dot failed"></span>
                  Failed
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function formatTimestamp(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return new Date(timestamp).toLocaleDateString()
}