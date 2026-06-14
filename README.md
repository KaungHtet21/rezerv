# Rezerv Staff App

React Native (Expo) mobile app for studio staff to manage class attendance and private booking notes.

This submission demonstrates mobile engineering approach: architecture, state management, API integration, offline handling, and staff-focused UX.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Setup](#setup)
- [Configuration](#configuration)
- [Demo credentials](#demo-credentials)
- [Architecture](#architecture)
- [State management](#state-management)
- [API integration & caching](#api-integration--caching)
- [Offline handling](#offline-handling)
- [Edge cases](#edge-cases)
- [Assumptions](#assumptions)
- [Tradeoffs](#tradeoffs)
- [Scaling to production](#scaling-to-production)
- [Building the app](#building-the-app)
- [What I would add next](#what-i-would-add-next)

---

## Features

| Requirement | Status | Notes |
|-------------|--------|-------|
| Login (email / password) | ✅ | JWT auth; session persisted across restarts |
| Today's classes list | ✅ | Loading, empty, error states; pull-to-refresh |
| Class date picker | ✅ | Calendar icon to view classes for other days |
| Attendance management | ✅ | Attended / No-show / Cancelled per booking |
| Optimistic status updates | ✅ | Instant UI; rolls back on hard failures |
| Private booking notes | ✅ | Create, edit, delete on dedicated screen |
| Undo note delete | ✅ | Soft delete + restore; undo banner |
| Offline attendance & notes | ✅ | Queue + optimistic cache |
| Auto sync when online | ✅ | Replays pending mutations on reconnect |
| Persistent local storage | ✅ | Auth session + offline queue (Redux Persist) |
| Unit tests | ⬜ | Not included (timeboxed scope) |

---

## Tech stack

- **React Native** (Expo 55, dev client)
- **TypeScript**
- **React Navigation** — auth stack, bottom tabs, classes stack
- **Redux Toolkit + Redux Persist** — session, theme, offline mutation queue
- **React Query v3** — server state, caching, refetch
- **Axios** — HTTP client with JWT interceptor
- **AsyncStorage** — persistence layer
- **NetInfo** — connectivity detection

---

## Project structure

Domain-driven hexagonal layout — each bounded context owns its domain, application, and presentation layers; shared cross-cutting concerns live in `shared/`.

```
src/
├── app/                          # Composition root
│   ├── navigation/               # Navigators & route types
│   └── providers/                # App-level providers (Redux, Query, theme)
├── config/                       # API paths, shared constants
├── domains/
│   ├── auth/
│   │   ├── domain/               # Entities, value objects (User, Gender, payloads)
│   │   ├── application/          # Use-case hooks (sign in, sign up, mappers)
│   │   └── presentation/         # Screens, auth sheets, components
│   ├── scheduling/
│   │   ├── domain/               # ClassSummary, Booking, BookingNote, BookingStatus
│   │   ├── application/          # Query/mutation hooks (classes, attendance, notes)
│   │   └── presentation/         # Screens, lists, entity rows, date picker
│   └── profile/
│       └── presentation/         # Profile screen
└── shared/
    ├── domain/                   # Cross-cutting domain helpers (API errors)
    ├── infrastructure/           # Adapters (HTTP, offline sync, Redux, storage)
    └── presentation/             # Design system, shared UI, layouts, hooks
```

### Hexagonal layers

| Layer | Role | Examples |
|-------|------|----------|
| **Domain** | Pure business types & rules, no framework deps | `BookingStatus`, `SafeUser`, `ClassSummary` |
| **Application** | Orchestrates use cases via ports/adapters | `useSignIn`, `useUpdateBookingStatus` |
| **Infrastructure** | External adapters (API, persistence, offline) | Axios client, Redux store, sync engine |
| **Presentation** | UI that calls application layer | Screens, lists, design-system primitives |

Dependency direction flows inward: presentation → application → domain. Infrastructure implements ports consumed by application hooks.

---

## Setup

### Prerequisites

- Node.js 20+
- yarn or npm
- Xcode (iOS) or Android Studio (Android)

### Install & run

```bash
yarn install
yarn ios       # iOS simulator
yarn android   # Android emulator
```

---

## Configuration

Set the API base URL in `src/config/api.ts`:

```ts
export const SERVER = {
  API_URL: 'https://your-api.example.com',
};
```

The app expects a REST API with JWT auth and endpoints for classes, bookings, attendance status, and booking notes.

---

## Demo credentials

| Field | Value |
|-------|-------|
| Email | `staff@rezerv.local` |
| Password | `password123` |

Registration and email verification screens are included; the demo account above is used for assessment login.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  Domain screens → lists → shared UI (design system)          │
└────────────────────────────┬─────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                   Application Layer                          │
│  Use-case hooks (React Query mutations/queries per domain) │
└────────────────────────────┬─────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                      Domain Layer                            │
│  Entities & value objects (auth, scheduling)                 │
└────────────────────────────┬─────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                  Infrastructure (Adapters)                     │
│  REST API · AsyncStorage · NetInfo · offline sync queue      │
└──────────────────────────────────────────────────────────────┘
```

### Navigation

- **Unauthenticated:** Login → Register → Verify email
- **Authenticated:** Bottom tabs — **Classes**, **Profile**
- **Classes stack:** Today's Classes → Class Detail → Booking Notes

### Staff workflow

1. Open app → see today's classes
2. Tap a class → mark attendance with one tap per status pill
3. Tap **See all notes** → add, edit, or delete notes on a dedicated screen

Attendance stays on the class detail screen; notes live on a separate screen to keep the booking list fast to scan.

---

## State management

### Redux (+ Redux Persist)

| Slice | Purpose |
|-------|---------|
| `user` | JWT token, profile — session survives app restart |
| `appstore` | Theme and accent preferences |
| `offline` | Pending mutation queue + connectivity flag |

Persisted to AsyncStorage: `user`, `appstore`, `offline`.

### React Query

| Query | Purpose |
|-------|---------|
| `classesByDate(date)` | Classes for a given day |
| `classBookings(classId)` | Bookings and notes for a class |

Mutations apply **optimistic updates** first. On success, queries are invalidated. When offline or on network error, changes are **queued in Redux** so the UI never blocks.

---

## API integration & caching

Shared hooks in `src/shared/infrastructure/api/api-fetch.ts`:

- `useApiQuery` — GET with cache keys
- `useApiCreate` / `useApiUpdate` / `useApiDelete` — mutations with invalidation

Domain hooks live under each bounded context — e.g. `src/domains/auth/application/` and `src/domains/scheduling/application/`.

**Caching**

- Classes: 30s stale time
- Bookings: invalidated after attendance or note mutations
- Query keys centralized in `queryKeys.ts`

Axios attaches the JWT from Redux on every request and logs out on 401.

---

## Offline handling

### Goals

- Attendance and notes work without a stable connection
- Pending changes sync automatically when connectivity returns

### Approach: optimistic UI + persistent mutation queue

```
User action
    │
    ▼
Optimistic update (React Query cache)  ──► UI updates immediately
    │
    ├── Online + API success ──► invalidate & refresh from server
    │
    └── Offline OR network error ──► enqueue mutation (Redux Persist)
                                          │
                              Network restored
                                          │
                                          ▼
                               syncEngine replays queue (FIFO)
                                          │
                                          ▼
                               API calls + cache invalidation
```

### Queued mutation types

| Type | Behavior |
|------|----------|
| `UPDATE_STATUS` | Coalesced per booking — latest status wins |
| `CREATE_NOTE` | Temp client IDs until the server returns a real ID |
| `UPDATE_NOTE` | Merged into a pending create when applicable |
| `DELETE_NOTE` | Drops a pending create if the note was never synced |
| `RESTORE_NOTE` | Cancels a pending delete (undo while offline) |

### Connectivity UX

- **NetInfo** drives a top banner — "No internet connection" / "Back online"
- **`OfflineSyncProvider`** runs the sync engine on reconnect
- After a fetch while offline, pending changes are **re-applied** to the React Query cache so pull-to-refresh does not wipe unsynced work

### Offline tradeoffs

| Choice | Benefit | Cost |
|--------|---------|------|
| Mutation queue vs local DB | Simple, fast to build | No rich offline reads beyond cached queries |
| Redux Persist for queue | Survives app kill | Queue must stay serializable |
| Optimistic cache vs SQLite | Fits React Query | Refetch can conflict with pending state; mitigated by reapply logic |
| Temp note IDs | Create works offline | ID remapping required during sync |
| No conflict resolution | Fine for single staff device | Multi-device edits could overwrite each other |

---

## Edge cases

| Scenario | Handling |
|----------|----------|
| Empty class list | Empty state + pull-to-refresh |
| Failed API request | Error message + Retry button |
| Unstable network | Queue mutations; connectivity banner |
| Duplicate status taps | No-op if unchanged; queue coalesces to latest |
| Accidental note delete | Undo banner → restore (or cancel pending delete offline) |
| App restart | JWT + offline queue restored from AsyncStorage |
| Fetch while offline | Last cached data shown; pending changes re-applied |

---

## Assumptions

1. **Single staff user per device** — no multi-user switching on one device.
2. **Staff-only app** — no customer-facing features.
3. **Attendance UI** shows Attended / No-show / Cancelled; API may also expose Scheduled for future bookings.
4. **Notes are private to staff** — soft delete with undo; no audit log UI.
5. **One studio, device locale** for time display.
6. **Date picker** — only dates with scheduled classes return data; others show an empty state.
7. **Registration flow** — included as scaffolding; demo uses the staff login above.

---

## Tradeoffs

| Area | Decision | Rationale |
|------|----------|-----------|
| React Query + Redux | Split server vs client state | Common RN pattern; each tool does one job well |
| FlatList per screen | Not one nested ScrollView | Better scroll performance on long booking lists |
| Notes on separate screen | Not inline on booking card | Faster attendance workflow; less scrolling |
| Expo dev client | Not Expo Go alone | Native modules (NetInfo, datetime picker, bottom sheet) |
| Simple offline queue | Not a full sync framework | Right-sized for assessment; single-writer use case |
| No unit tests | Timebox | Prioritized architecture and offline path |

---

## Scaling to production

1. **Offline** — SQLite or WatermelonDB; visible sync status and retry UI.
2. **Auth** — Refresh tokens, Keychain/Keystore, session expiry handling.
3. **Config** — Environment-based API URL per build flavor (dev/staging/prod).
4. **Observability** — Sentry, analytics, logging on sync failures.
5. **Testing** — Unit tests for queue coalescing and sync engine; Detox E2E for the attendance path.
6. **Performance** — FlashList for large lists; pagination for class history.
7. **Multi-staff** — Optimistic locking and conflict resolution UI.
8. **CI/CD** — EAS Build for signed APK/IPA releases.
9. **Accessibility** — Screen reader labels; larger tap targets for quick staff use.

---

## Building the app

### iOS

```bash
yarn ios
```

### Android

```bash
yarn android
```

### Release build (EAS)

This project uses **expo-dev-client** for native modules.

```bash
npx eas build --platform android
npx eas build --platform ios
```

EAS project configuration is not included in this repo.

---

## What I would add next

- Unit tests for `queueCoalesce`, `syncEngine`, and mutation hooks
- Sync status indicator (pending count / last synced)
- E2E test: login → mark attendance → add note offline → sync
- Environment files for API URL per build flavor
- Haptic feedback on attendance change

---

## License

Assessment submission.
