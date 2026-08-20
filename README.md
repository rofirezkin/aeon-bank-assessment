# AEON Bank — Transactions

A React Native (Expo) mobile app that lets a banking customer review their latest
transactions and open any of them to see the full transfer details, with the
option to share those details to any app on their device.

Built for the AEON Bank Mobile Engineer take-home assessment.

|                       | |
| --------------------- | -------------------------------------------------------------- |
| **Transaction list**  | Grouped by day, newest first, with money in / money out totals  |
| **Transfer details**  | Reference id, date, counterparty and transfer amount            |
| **Share**             | Native share sheet — send the receipt anywhere                  |

---

## Requirements coverage

| Requirement from the brief | Where it lives |
| --- | --- |
| List of latest transactions (incoming + outgoing) | [`src/app/index.tsx`](src/app/index.tsx) |
| Each row shows the transfer detail, date and amount | [`src/components/transaction-item/transaction-item.tsx`](src/components/transaction-item/transaction-item.tsx) |
| Tapping a row navigates to a details screen | `expo-router` push to `/transaction-detail?refId=…` |
| Details show referenceId, date, recipient name, transfer amount | [`src/app/transaction-detail.tsx`](src/app/transaction-detail.tsx) |
| Share the transfer details externally | [`src/hooks/use-share-transaction.ts`](src/hooks/use-share-transaction.ts) |
| React Native | Expo SDK 57 / React Native 0.86 |
| TypeScript | Strict mode, no `any` |
| Zustand | [`src/store`](src/store) |

### Beyond the brief

- Debounced search across recipient, transfer detail and reference id
- Money in / money out filter chips, with the selection kept in Zustand so it
  survives navigating into a transaction and back
- Hide-amounts toggle on the summary card
- The counterparty label follows the direction — the brief ships a single
  `recipientName` field, so incoming transfers read "Sender name" rather than
  claiming the other party received the money
- Pull to refresh, skeleton loading, empty state and an error state with retry
- Light and dark themes driven by the system setting
- Haptic feedback on row press, accessibility labels/roles throughout
- Deep link per transaction (`aeonassessmentapp://transaction-detail?refId=123ABC`)

---

## Getting started

### Prerequisites

- **Node.js 20+** and npm
- **Expo Go** on your phone, or an **iOS Simulator** (Xcode) / **Android Emulator** (Android Studio)

### 1. Install dependencies

```bash
npm install
```

### 2. Start the dev server

```bash
npx expo start
```

Then pick a target:

- **Physical device** — scan the QR code with the Expo Go app
- **iOS Simulator** — press `i` in the terminal, or `npm run ios`
- **Android Emulator** — press `a` in the terminal, or `npm run android`

> The app runs fully in Expo Go — no native build or custom dev client required.

### Other scripts

| Command | What it does |
| --- | --- |
| `npm run ios` | Start and open the iOS Simulator |
| `npm run android` | Start and open the Android Emulator |
| `npm run lint` | Run ESLint (`eslint-config-expo`) |
| `npx tsc --noEmit` | Type-check the project |

---

## Project structure

```text
src/
├── app/                              # expo-router file-based routes
│   ├── _layout.tsx                   # Stack navigator + providers
│   ├── index.tsx                     # Transaction list screen
│   └── transaction-detail.tsx        # Transfer details screen
├── components/                       # Presentational, screen-agnostic UI
│   ├── back-button/
│   ├── detail-row/
│   ├── filter-bar/
│   ├── list-states/                  # Skeleton, empty and error states
│   ├── transaction-item/
│   ├── transaction-summary/
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── constants/theme.ts                # Colours, spacing, radii, fonts
├── context/client-provider.tsx       # React Query client
├── hooks/
│   ├── use-color-scheme.ts
│   ├── use-debounce.ts               # Keeps typing snappy while the list filters
│   ├── use-share-transaction.ts      # Share sheet + receipt formatting
│   └── use-theme.ts
├── services/
│   ├── base-api.ts                   # Transport, response envelope, ApiError
│   ├── mock/transactions.mock.ts     # Mock BE payload
│   ├── api/                          # One module per endpoint
│   │   ├── get.transactions.ts
│   │   └── get.transaction-by-id.ts
│   └── query/                        # React Query hooks per endpoint
│       ├── use-get-transactions.ts
│       └── use-get-transaction-by-id.ts
├── store/                            # Zustand stores
│   ├── use-preference-store.ts
│   └── use-transaction-filter-store.ts
├── types/transaction.ts              # Domain model, owned by no layer
└── utils/                            # Pure, testable helpers
    ├── format-currency.ts
    ├── format-date.ts
    ├── transaction-direction.ts
    └── transaction-list.ts
```

---

## Architecture notes

**Layering.** Screens never talk to the transport directly. The flow is
`screen → services/query (React Query hook) → services/api (endpoint) → services/base-api (transport)`.
Each layer only knows about the one below it, so any of them can be swapped in
isolation. The domain model in `src/types` is owned by no layer — everything
points inward at it, which keeps the dependency graph acyclic. Modules under
`services/api` hold transport concerns only; anything that derives meaning from
a transaction (its direction, its ordering) lives in `src/utils` as a pure
function.

---

## Tech stack

| | |
| --- | --- |
| Framework | Expo SDK 57, React Native 0.86, React 19 |
| Language | TypeScript (strict) |
| Navigation | expo-router (file-based, typed routes) |
| Server state | @tanstack/react-query |
| Client state | Zustand |
| Icons | @expo/vector-icons |
| Feedback | expo-haptics |
| Linting | ESLint + eslint-config-expo |
