# GiftSync Mobile App Implementation Plan

## Executive Summary

Build a React Native (Expo) mobile app with feature parity to the web app's core functionality. Use direct Supabase access for MVP speed. Target: 4 weeks to internal testing.

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Data Access | Direct Supabase | RLS already protects data, faster to build, no API route dependency |
| Navigation | Expo Router | File-based like Next.js, familiar patterns |
| Auth Storage | expo-secure-store | Secure token persistence on device |
| Shared Code | `packages/shared` | Types and constants only (not hooks) |
| Offline | Supabase built-in | Cache lists locally, sync when online |
| Builds | EAS Cloud | Required for iOS on Windows |

---

## MVP Feature Scope

### Must Have (v1.0)
- [ ] Authentication (login/signup)
- [ ] Dashboard (list of gift lists)
- [ ] List detail (items with prices, status)
- [ ] Mark items as purchased
- [ ] Add/edit lists
- [ ] Add/edit items with retailer links
- [ ] Accept collaboration invites (deep link)
- [ ] Share links (replaces bulk open tabs)
- [ ] Pull-to-refresh
- [ ] Dark theme (matching web)

### Deferred (v1.1+)
- [ ] AI Quick Add
- [ ] AI Budget Analysis
- [ ] Push notifications ("item purchased by collaborator")
- [ ] Offline-first with background sync
- [ ] Privacy blur toggle

---

## Screen Map

```
(auth)/
├── login.tsx          # Email/password login
└── signup.tsx         # Email/password signup

(tabs)/
├── _layout.tsx        # Tab bar (Dashboard, Settings)
├── index.tsx          # Dashboard - grid of list cards
├── list/[id].tsx      # List detail - items table
└── settings.tsx       # Account info, logout

modals/
├── create-list.tsx    # Create new list
├── edit-list.tsx      # Edit list name
├── create-item.tsx    # Add item with links
└── edit-item.tsx      # Edit item details

invite/
└── [token].tsx        # Deep link invite acceptance
```

---

## Shared Package (`packages/shared`)

### Extract from Web
```
packages/shared/
├── src/
│   ├── types/
│   │   ├── database.ts    # GiftList, GiftItem, RetailerLink
│   │   └── index.ts
│   ├── constants/
│   │   ├── colors.ts      # Dark theme colors
│   │   └── index.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

### Types to Share
```typescript
// From apps/web/types/database.ts
export interface GiftList {
  id: string
  user_id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface GiftItem {
  id: string
  list_id: string
  name: string
  description?: string
  status: 'required' | 'optional'
  min_price?: number
  max_price?: number
  is_completed: boolean
  sort_order: number
  created_at: string
}

export interface RetailerLink {
  id: string
  item_id: string
  retailer_name: string
  url: string
  price?: number
  is_best_price: boolean
  is_highend: boolean
  created_at: string
}
```

---

## Implementation Phases

### Phase 1: Foundation (Days 1-3)
- [ ] Initialize Expo app with tabs template
- [ ] Set up TypeScript configuration
- [ ] Create `packages/shared` with types
- [ ] Configure Supabase client with SecureStore
- [ ] Create AuthProvider with session management
- [ ] Build login screen
- [ ] Build signup screen
- [ ] Test auth flow end-to-end

### Phase 2: Dashboard (Days 4-6)
- [ ] Create dashboard layout
- [ ] Build GiftListCard component
- [ ] Fetch lists from Supabase
- [ ] Implement pull-to-refresh
- [ ] Add empty state (no lists yet)
- [ ] Create list modal
- [ ] Navigate to list detail

### Phase 3: List Detail (Days 7-10)
- [ ] Build list detail screen
- [ ] Create ItemRow component
- [ ] Implement selection (tap to toggle)
- [ ] Build bottom action bar (appears on selection)
- [ ] Mark items as purchased
- [ ] Share selected items' links
- [ ] Filter bar (All/Required/Optional)
- [ ] Running totals display

### Phase 4: CRUD Operations (Days 11-14)
- [ ] Edit list modal
- [ ] Delete list (with confirmation)
- [ ] Create item modal
- [ ] Edit item modal
- [ ] Add/edit retailer links
- [ ] Delete item

### Phase 5: Collaboration (Days 15-17)
- [ ] Configure deep linking in app.json
- [ ] Build invite acceptance screen
- [ ] Handle `giftsync://invite/[token]` links
- [ ] Show shared lists with collaborator indicator
- [ ] Test invite flow end-to-end

### Phase 6: Polish & Testing (Days 18-21)
- [ ] Loading states everywhere
- [ ] Error handling with user-friendly messages
- [ ] Haptic feedback on actions
- [ ] Keyboard avoiding views
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Fix platform-specific issues

### Phase 7: Build & Release (Days 22-25)
- [ ] Configure eas.json
- [ ] Development build (internal testing)
- [ ] Set up TestFlight (iOS)
- [ ] Set up Internal Testing track (Android)
- [ ] Beta testing with real users
- [ ] Bug fixes from testing

---

## Mobile-Specific UX Patterns

### Selection & Actions
```
Tap row → Toggle selection (blue highlight)
Long press → Context menu (Edit, Delete, Share)
Items selected → Bottom action bar slides up
  - [Share Links] [Mark Purchased] [Clear]
```

### Share Links (replaces Open Tabs)
```typescript
const shareLinks = async (items: GiftItemWithLinks[]) => {
  const links = items
    .flatMap(item => item.retailer_links)
    .map(link => `${link.retailer_name}: ${link.url}`)
    .join('\n')

  await Share.share({
    message: `Gift Links:\n\n${links}`,
    title: 'Gift Links from GiftSync'
  })
}
```

### Pull to Refresh
Every list screen has pull-to-refresh to sync latest data.

### Optimistic Updates
Mark as purchased updates UI immediately, syncs in background.

---

## Supabase Client Setup

```typescript
// apps/mobile/lib/supabase/client.ts
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import { Database } from '@giftsync/shared'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

const SecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

---

## Environment Variables

```env
# apps/mobile/.env
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## EAS Configuration

```json
// apps/mobile/eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

---

## Deep Linking Configuration

```json
// apps/mobile/app.json (partial)
{
  "expo": {
    "scheme": "giftsync",
    "ios": {
      "associatedDomains": ["applinks:trygiftsync.app"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            { "scheme": "giftsync" },
            { "scheme": "https", "host": "trygiftsync.app", "pathPrefix": "/invite" }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

---

## Component Checklist

### UI Components to Build
- [ ] Button (primary, secondary, danger variants)
- [ ] Input (text input with label)
- [ ] Card (list card, item card)
- [ ] Modal (bottom sheet style)
- [ ] Badge (Required/Optional status)
- [ ] Toast (success/error feedback)
- [ ] EmptyState (no items illustration)
- [ ] LoadingSpinner
- [ ] ActionBar (bottom action bar)
- [ ] PriceDisplay (with best price highlight)

### Screen Components
- [ ] AuthLayout (centered card)
- [ ] TabLayout (bottom tabs)
- [ ] ListHeader (title + actions)
- [ ] FilterBar (All/Required/Optional)
- [ ] TotalsDisplay (running cost totals)
- [ ] ItemRow (selectable item row)
- [ ] RetailerLinkRow (price + open link)

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| iOS builds slow (EAS cloud) | Start builds early, parallelize with Android dev |
| Deep links don't work | Test early on real devices, not just simulator |
| Supabase RLS issues | Test all queries with mobile client before building UI |
| SecureStore limits | Keep tokens small, use AsyncStorage for larger cache |
| Performance with large lists | Implement virtualized FlatList from start |

---

## Success Criteria

### MVP Launch Ready When:
- [ ] User can sign up and log in
- [ ] User can view all their gift lists
- [ ] User can view items in a list
- [ ] User can mark items as purchased
- [ ] User can add new lists and items
- [ ] User can accept invite links
- [ ] User can share retailer links
- [ ] App works on iOS and Android
- [ ] No critical bugs in 24hr testing period

---

## Post-MVP Roadmap

### v1.1 - Notifications
- Push notifications when collaborator marks item purchased
- Requires Supabase Edge Function + Expo Push

### v1.2 - AI Features
- AI Quick Add (camera + text parsing)
- AI Budget Analysis

### v1.3 - Offline First
- Full offline support with background sync
- Conflict resolution for simultaneous edits

### v1.4 - Premium Features
- Price alerts
- Purchase history
- Advanced analytics
