# Network-Simulator

A resilient transaction feed application that demonstrates handling unreliable network conditions with optimistic UI updates, rollback mechanisms, and retry functionality.

## Features

- **Optimistic UI**: Transactions appear immediately before API confirmation
- **Chaos Mode**: Toggle to simulate network issues:
  - Random latency (0-5 seconds)
  - 10% chance of 500 errors
- **Automatic Rollback**: Failed transactions are automatically reverted
- **Retry Mechanism**: Failed transactions can be retried with a single click
- **PWA Support**: Installable as a mobile app with offline capabilities

## Tech Stack

- React 18 + TypeScript
- TanStack Query (React Query) for data fetching and mutations
- MSW (Mock Service Worker) for API mocking
- Sonner for toast notifications
- Vite for build tooling
- PWA plugin for service worker and manifest

## Getting Started

### Installation

```bash
npm install
```

### Initialize MSW

```bash
npm run msw
```

This will create the necessary MSW service worker files in the `public` directory.

### Generate PWA Icons

For PWA functionality, you need to create two icon files:
- `public/icon-192.png` (192x192 pixels)
- `public/icon-512.png` (512x512 pixels)

You can:
1. Use the HTML generator: Open `scripts/generate-icons.html` in a browser and click the canvases to download
2. Use any online icon generator or design tool
3. Create simple icons with a "$" symbol on a purple gradient background (#6366f1 to #8b5cf6)

The icons are optional for development but required for PWA installation.

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Send Money**: Fill in the recipient name and amount, then click "Send Money"
   - The transaction will appear immediately (optimistic update)
   - If successful, it will be confirmed
   - If it fails, it will be rolled back and you can retry

2. **Chaos Mode**: Toggle the "Chaos Mode" switch to enable:
   - Random network latency (0-5 seconds)
   - 10% chance of server errors (500)
   - This helps test the resilience of the application

3. **Install as PWA**: 
   - On mobile: Use "Add to Home Screen" from your browser
   - On desktop: Look for the install prompt in your browser

## Project Structure

```
src/
  ├── api/           # API client functions
  ├── components/    # React components
  ├── hooks/         # Custom React hooks (React Query)
  ├── mocks/         # MSW handlers and setup
  ├── types.ts       # TypeScript type definitions
  ├── App.tsx        # Main app component
  └── main.tsx       # Entry point
```

## Key Implementation Details

### Optimistic Updates

The app uses React Query's `onMutate` to immediately add transactions to the UI before the API responds. If the request fails, the UI is rolled back to the previous state.

### Rollback Mechanism

When a mutation fails, React Query's `onError` callback:
1. Restores the previous transaction list
2. Shows an error toast with a retry button
3. Allows the user to retry the failed transaction

### Chaos Mode

Chaos mode is implemented in the MSW handlers, which:
- Add random delays (0-5s) to all requests
- Randomly return 500 errors (10% chance)
- Can be toggled on/off via the UI

## Browser Support

- Modern browsers with ES2020 support
- Mobile browsers (iOS Safari, Chrome Mobile)
- PWA support requires HTTPS (or localhost for development)

## License

MIT