import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { fetchTransactions, sendMoney } from '../api/transactions'
import { Transaction, SendMoneyRequest } from '../types'
import { toast } from 'sonner'

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  })
}

/**
 * Custom hook for sending money with network resilience features:
 * 
 * 1. OPTIMISTIC UPDATES: Updates UI immediately before API responds
 *    - Solves: Slow network latency (user sees instant feedback)
 *    - Shows transaction as "pending" while waiting
 * 
 * 2. AUTOMATIC ROLLBACK: Reverts UI if request fails
 *    - Solves: Network errors, server failures
 *    - Ensures UI state matches server state
 * 
 * 3. ONE-CLICK RETRY: Allows easy retry of failed requests
 *    - Solves: Temporary network issues
 *    - Preserves user input, no need to re-enter data
 * 
 * 4. STATE SNAPSHOTS: Saves exact state before changes
 *    - Solves: Race conditions, partial updates
 *    - Enables perfect rollback
 */
export function useSendMoney() {
  const queryClient = useQueryClient()
  const retryRef = useRef<(() => void) | null>(null)

  const mutation = useMutation({
    mutationFn: sendMoney,
    
    /**
     * STEP 1: OPTIMISTIC UPDATE (Runs BEFORE network request)
     * - Cancels conflicting queries to prevent race conditions
     * - Saves current state snapshot for potential rollback
     * - Immediately adds transaction to UI with "pending" status
     * - User sees instant feedback (0ms perceived latency)
     */
    onMutate: async (newTransaction: SendMoneyRequest) => {
      // Cancel outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ['transactions'] })

      // Snapshot previous value for rollback if needed
      const previousTransactions = queryClient.getQueryData<Transaction[]>(['transactions'])

      // Optimistically update UI immediately (before API responds)
      const optimisticTransaction: Transaction = {
        id: `temp-${Date.now()}`,
        amount: newTransaction.amount,
        recipient: newTransaction.recipient,
        timestamp: Date.now(),
        status: 'pending', // Shows as pending while waiting
      }

      queryClient.setQueryData<Transaction[]>(['transactions'], (old = []) => [
        optimisticTransaction,
        ...old,
      ])

      // Return context for error handling
      return { previousTransactions, newTransaction }
    },
    
    /**
     * STEP 2: ERROR HANDLING (Runs if network request fails)
     * - Automatically rolls back optimistic update
     * - Restores exact previous state
     * - Shows user-friendly error with retry button
     */
    onError: (err, _newTransaction, context) => {
      // ROLLBACK: Restore UI to state before optimistic update
      if (context?.previousTransactions) {
        queryClient.setQueryData(['transactions'], context.previousTransactions)
      }

      // Create retry function that preserves user input
      const retry = () => {
        if (context?.newTransaction) {
          mutation.mutate(context.newTransaction) // Retry with same data
        }
      }
      retryRef.current = retry

      // Show error toast with one-click retry option
      toast.error('Transaction Failed', {
        description: err.message || 'Failed to send money. Please try again.',
        action: {
          label: 'Retry',
          onClick: retry, // User can retry without re-entering data
        },
        duration: 5000,
      })
    },
    
    /**
     * STEP 3: SUCCESS HANDLING (Runs if network request succeeds)
     * - Replaces temporary optimistic transaction with real server response
     * - Updates status from "pending" to "completed"
     * - Shows success notification
     */
    onSuccess: (data, _variables, _context) => {
      // Replace optimistic transaction with real server response
      queryClient.setQueryData<Transaction[]>(['transactions'], (old = []) => {
        const filtered = old.filter((t) => !t.id.startsWith('temp-'))
        return [data, ...filtered] // Real transaction from server
      })

      toast.success('Money Sent!', {
        description: `$${data.amount.toFixed(2)} sent to ${data.recipient}`,
      })
    },
    
    /**
     * STEP 4: CLEANUP (Runs after success OR error)
     * - Invalidates queries to ensure data freshness
     * - Triggers background refetch if needed
     */
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  return mutation
}