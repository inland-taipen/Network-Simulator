import { useState, useEffect } from 'react'
import { useSendMoney } from '../hooks/useTransactions'
import './SendMoneyForm.css'

export function SendMoneyForm() {
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [errors, setErrors] = useState<{ amount?: string; recipient?: string }>({})
  const sendMoney = useSendMoney()

  useEffect(() => {
    // Clear errors when values change
    if (amount && errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }))
    }
    if (recipient && errors.recipient) {
      setErrors((prev) => ({ ...prev, recipient: undefined }))
    }
  }, [amount, recipient, errors])

  const validateForm = (): boolean => {
    const newErrors: { amount?: string; recipient?: string } = {}
    
    if (!recipient.trim()) {
      newErrors.recipient = 'Recipient name is required'
    } else if (recipient.trim().length < 2) {
      newErrors.recipient = 'Recipient name must be at least 2 characters'
    }

    const numAmount = parseFloat(amount)
    if (!amount) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    } else if (numAmount > 10000) {
      newErrors.amount = 'Amount cannot exceed $10,000'
    } else if (numAmount < 0.01) {
      newErrors.amount = 'Amount must be at least $0.01'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const numAmount = parseFloat(amount)
    sendMoney.mutate(
      {
        amount: numAmount,
        recipient: recipient.trim(),
      },
      {
        onSuccess: () => {
          setAmount('')
          setRecipient('')
          setErrors({})
        },
      }
    )
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const isDisabled = sendMoney.isPending || !amount || !recipient || Object.keys(errors).length > 0

  return (
    <form onSubmit={handleSubmit} className="send-money-form">
      <div className="form-header">
        <h2>Send Money</h2>
        <p className="form-subtitle">Quick and secure transfers</p>
      </div>
      
      <div className="form-group">
        <label htmlFor="recipient">Recipient</label>
        <input
          id="recipient"
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter recipient name"
          disabled={sendMoney.isPending}
          className={`form-input ${errors.recipient ? 'error' : ''}`}
          maxLength={50}
        />
        {errors.recipient && (
          <span className="form-error">{errors.recipient}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <div className="amount-input-wrapper">
          <span className="amount-prefix">$</span>
          <input
            id="amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            disabled={sendMoney.isPending}
            className={`form-input amount-input ${errors.amount ? 'error' : ''}`}
            maxLength={10}
          />
        </div>
        {errors.amount && (
          <span className="form-error">{errors.amount}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isDisabled}
        className={`send-button ${isDisabled ? 'disabled' : ''} ${sendMoney.isPending ? 'loading' : ''}`}
      >
        {sendMoney.isPending ? (
          <>
            <span className="button-spinner"></span>
            Sending...
          </>
        ) : (
          'Send Money'
        )}
      </button>
    </form>
  )
}