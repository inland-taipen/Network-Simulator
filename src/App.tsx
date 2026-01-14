import { useTransactions } from './hooks/useTransactions'
import { ChaosModeToggle } from './components/ChaosModeToggle'
import { SendMoneyForm } from './components/SendMoneyForm'
import { TransactionList } from './components/TransactionList'
import './App.css'

function App() {
  const { data: transactions = [], isLoading } = useTransactions()

  return (
    <div className="app">
      <header className="app-header">
        <h1>Transaction Feed</h1>
        <p className="app-subtitle">Resilient network simulator</p>
      </header>

      <main className="app-main">
        <ChaosModeToggle />
        <SendMoneyForm />
        
        <div className="transactions-section">
          <h2 className="section-title">
            <span>💳</span>
            Recent Transactions
          </h2>
          <TransactionList transactions={transactions} isLoading={isLoading} />
        </div>
      </main>
    </div>
  )
}

export default App