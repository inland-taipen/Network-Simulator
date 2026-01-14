import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import App from './App'
import './index.css'

// Initialize MSW in development
async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return
  }

  const { worker } = await import('./mocks/browser')
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}

/**
 * React Query Configuration
 * 
 * Note: retry: false is intentional here because:
 * - We handle retries manually via the retry button in error toasts
 * - This gives users control over when to retry
 * - Prevents automatic retries that might confuse users
 * 
 * For production, you might want:
 * - retry: 1-2 for queries (automatic retry on transient failures)
 * - retry: false for mutations (manual retry via UI)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Manual retry via UI for better UX
      refetchOnWindowFocus: false, // Don't refetch when user switches tabs
    },
    mutations: {
      retry: false, // We handle retry manually with the retry button
    },
  },
})

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-center" richColors />
      </QueryClientProvider>
    </React.StrictMode>,
  )
})