# GiftWise Coding Standards

## Introduction

Consistency in code style and patterns is essential for maintainability, readability, and team productivity. When every file follows the same structure and conventions, developers and AI agents can:

- Navigate unfamiliar code quickly
- Reduce cognitive load when reviewing PRs
- Avoid debates about style in code reviews
- Onboard new team members faster
- Trust that patterns work because they are proven

This document defines the canonical patterns extracted from the best-implemented code in our codebase. **All new code MUST follow these standards.**

---

## Table of Contents

1. [Perfect Examples Reference](#perfect-examples-reference)
2. [General Principles](#general-principles)
3. [File Organization](#file-organization)
4. [TypeScript Standards](#typescript-standards)
5. [UI Components](#ui-components)
6. [React Hooks](#react-hooks)
7. [Server Actions](#server-actions)
8. [Utility Functions](#utility-functions)
9. [Testing Standards](#testing-standards)
10. [Security Best Practices](#security-best-practices)
11. [Anti-Patterns](#anti-patterns)
12. [Code Review Checklist](#code-review-checklist)

---

## Perfect Examples Reference

These files represent the **gold standard** for each category. When implementing new code, refer to these examples:

| Category | Example File | Why It's Perfect |
|----------|-------------|------------------|
| **UI Component** | `components/ui/toast.tsx` | Clean type exports, proper accessibility, single responsibility, conditional styling with `cn()`, auto-dismiss functionality |
| **Server Action** | `lib/actions/mark-complete.ts` | Comprehensive validation, authentication, ownership verification, detailed error handling, security-first |
| **React Hook** | `hooks/use-toast.ts` | Memoized callbacks, clear API, convenience methods, reusable across app |
| **Utility Function** | `lib/utils/url-validator.ts` | Security-focused, defensive programming, progressive complexity, pure functions |
| **Helper Library** | `lib/server-action-helpers.ts` | Generic types, composable helpers, consistent error format |
| **Component Test** | `components/ui/button.test.tsx` | Grouped tests, accessibility testing, user event simulation |

---

## General Principles

### Keep It Simple
- Prefer simple solutions over clever ones
- Do not over-engineer for hypothetical future requirements
- Build for the current use case; refactor when needed

### Single Responsibility
- Each file should do ONE thing well
- Components render UI; hooks manage state; utils transform data
- If a function needs multiple JSDoc sections, split it

### Explicit Over Implicit
- Export types explicitly, even if inferred
- Name things descriptively, even if verbose
- Add comments explaining WHY, not WHAT

### Security First
- Validate all user inputs
- Sanitize URLs before use
- Verify ownership before mutations
- Never expose internal errors to users

---

## File Organization

### Import Order

Always organize imports in this order, with blank lines between groups:

```typescript
// 1. Directives (if needed)
'use client' // or 'use server'

// 2. Framework/React imports
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// 3. External library imports
import { clsx } from 'clsx'

// 4. Internal absolute imports - types first
import type { GiftItem } from '@/types/database'
import type { FilterType } from '@/types/dashboard'

// 5. Internal absolute imports - components/utils
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// 6. Relative imports (sibling components)
import { StatusBadge } from './status-badge'
```

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Components** | kebab-case | `gift-item-row.tsx` |
| **Hooks** | kebab-case with `use-` prefix | `use-selection.ts` |
| **Utils** | kebab-case | `url-validator.ts` |
| **Server Actions** | kebab-case | `mark-complete.ts` |
| **Types** | kebab-case | `database.ts` |
| **Tests** | Same name + `.test` suffix | `button.test.tsx` |

### Directory Structure

```
feature/
├── components/
│   ├── feature-main.tsx      # Main orchestrating component
│   ├── feature-item.tsx      # Child components
│   └── index.ts              # Re-exports (optional)
├── hooks/
│   └── use-feature.ts
├── actions/
│   └── feature-action.ts
└── types.ts                  # Feature-specific types
```

---

## TypeScript Standards

### Type vs Interface

```typescript
// ✓ Use 'interface' for component props (can be extended)
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

// ✓ Use 'type' for unions and utilities
export type FilterType = 'all' | 'required' | 'optional' | 'high-value'

export type ActionResponse<T> = ActionSuccess<T> | ActionError

// ✓ Use 'type' for object shapes that won't be extended
export type SelectionState = Map<string, Set<string>>
```

### Type Export Pattern

```typescript
// Types at the TOP of the file, after imports
export interface ComponentProps {
  /** Description of what this prop does */
  prop1: string
  prop2?: number
}

export type ComponentVariant = 'primary' | 'secondary'

// Component implementation
export function Component({ prop1, prop2 }: ComponentProps) {
  // ...
}
```

### Avoid `any`

```typescript
// ✗ BAD
const data: any = await fetchData()

// ✓ GOOD: Use unknown and narrow
const data: unknown = await fetchData()
if (isValidData(data)) {
  // data is now typed
}

// ✓ ACCEPTABLE: When working with external APIs with poor types
// Add comment explaining WHY
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase types incomplete for nested relations
(item: any) => item.gift_lists.user_id === user.id
```

### Type Assertions vs Type Suppression

```typescript
// ✗ BAD: Suppresses ALL errors on this line
// @ts-expect-error - Supabase types issue
.insert({ user_id: user.id, name: trimmedName })

// ✓ GOOD: Type assertion with explanation
.insert({
  user_id: user.id,
  name: trimmedName,
} as GiftListInsert)

// ✓ BETTER: Create type helper
type InsertSafe<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>
.insert({
  user_id: user.id,
  name: trimmedName,
} as InsertSafe<GiftList>)
```

### Null vs Undefined

**Standardize**:
- **Database fields**: Use `null` (matches SQL NULL)
- **React state**: Use `null` for "intentionally empty"
- **Function parameters**: Use `undefined` for optional
- **Return values**: Match database convention

```typescript
// ✓ GOOD: Consistent null usage
const [editingItem, setEditingItem] = useState<GiftItem | null>(null)

// ✓ GOOD: Optional parameters use undefined
function updateItem(id: string, name?: string) { ... }

// ✓ GOOD: Nullish coalescing
const count = selections.get(list.id)?.size ?? 0
```

---

## UI Components

### Component Structure Template

```typescript
'use client' // Only if component uses hooks/interactivity

import * as React from 'react'
import { cn } from '@/lib/utils'

// 1. Export interface BEFORE component
export interface ComponentProps {
  /** Description of what this prop does */
  requiredProp: string
  /** Optional prop with default */
  optionalProp?: number
  /** Standard className for style overrides */
  className?: string
  /** Children if applicable */
  children?: React.ReactNode
}

/**
 * Brief description of the component's purpose
 * Additional context about when to use it
 */
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ requiredProp, optionalProp = 10, className, children }, ref) => {
    // Define variant styles as objects (for reuse)
    const variantStyles = {
      primary: 'bg-[#6366f1] text-white hover:bg-[#5558e3]',
      secondary: 'bg-[#2d2d2d] text-[#e4e4e7] hover:bg-[#3d3d3d]',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-md', // base styles
          variantStyles[variant],
          className // allow overrides last
        )}
        role="region"
        aria-label={requiredProp}
      >
        {children}
      </div>
    )
  }
)

// Display name for React DevTools
Component.displayName = 'Component'

// Named export (not default)
export { Component }
```

### When to Use forwardRef

```typescript
// ✓ UI Primitives MUST use forwardRef
// components/ui/button.tsx, input.tsx, modal.tsx, etc.
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <button ref={ref} {...props} />
})

// ✓ Feature components DON'T need forwardRef
// components/dashboard/gift-item-row.tsx
export function GiftItemRow({ item, onClick }: GiftItemRowProps) {
  return <tr onClick={onClick}>...</tr>
}
```

### Styling with Tailwind

```typescript
// ✓ GOOD: Use cn() for conditional classes
className={cn(
  'base-styles',
  variant === 'primary' && 'primary-styles',
  isActive && 'active-styles',
  className // allow overrides last
)}

// ✓ GOOD: Style objects for multiple variants
const variantStyles = {
  primary: 'bg-[#6366f1] text-white hover:bg-[#5558e3]',
  secondary: 'bg-[#2d2d2d] text-[#e4e4e7] hover:bg-[#3d3d3d]',
  danger: 'bg-[#dc2626] text-white hover:bg-[#b91c1c]',
}

className={cn(baseStyles, variantStyles[variant], className)}

// ✗ BAD: String concatenation
className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}

// ✗ BAD: Inline styles (unless dynamic values needed)
style={{ backgroundColor: '#6366f1' }}
```

### Accessibility Requirements

All UI components MUST have appropriate ARIA attributes:

```typescript
// Interactive elements
<button
  role="button"
  aria-label="Description" // for icon-only buttons
>

// Dialogs
<div
  role="dialog"
  aria-labelledby="dialog-title"
  aria-modal="true"
>

// Form inputs
<input
  aria-invalid={error ? 'true' : 'false'}
  aria-describedby={error ? `${id}-error` : undefined}
/>

// Loading states
<div
  aria-busy="true"
  aria-live="polite"
>

// Alerts
<div role="alert">
```

### Dark Theme Colors

**Use these exact values for consistency:**

```typescript
const COLORS = {
  background: '#0f0f0f',      // Page background
  card: '#141414',            // Card/surface background
  cardHover: '#1a1a1a',       // Card hover state
  border: '#2d2d2d',          // Borders
  borderHover: '#3d3d3d',     // Border hover state
  text: '#e4e4e7',            // Primary text
  textMuted: '#a1a1aa',       // Secondary text
  textDim: '#71717a',         // Tertiary/disabled text
  accent: '#6366f1',          // Primary action (indigo)
  accentHover: '#5558e3',     // Accent hover
  danger: '#dc2626',          // Error/delete (red)
  dangerHover: '#b91c1c',     // Danger hover
  success: '#10b981',         // Success states (emerald-500)
} as const
```

---

## React Hooks

### Hook Structure Template

```typescript
'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { SomeType } from '@/types/somewhere'

/**
 * Brief description of what this hook does
 * @param initialData - Description of parameter
 * @returns Object containing state and actions
 */
export function useHookName(initialData: SomeType[]) {
  // 1. State declarations at the top
  const [data, setData] = useState<SomeType[]>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 2. Refs for values that shouldn't trigger re-renders
  const dataRef = useRef<SomeType[]>(data)

  // 3. Effects in the middle
  useEffect(() => {
    dataRef.current = data
  }, [data])

  useEffect(() => {
    // Setup side effect
    const handler = () => { /* ... */ }
    window.addEventListener('event', handler)

    // Cleanup
    return () => window.removeEventListener('event', handler)
  }, [dependency])

  // 4. Memoized callbacks at the bottom
  const doAction = useCallback((id: string) => {
    // Action logic using dataRef.current to avoid stale closures
    const item = dataRef.current.find(d => d.id === id)
  }, [])

  // 5. Return object with consistent structure
  return {
    data,
    isLoading,
    error,
    doAction,
  }
}
```

### Hook Best Practices

```typescript
// ✓ ALWAYS memoize callbacks
const handleClick = useCallback(() => {
  // ...
}, [dependency1, dependency2])

// ✓ Use refs to avoid stale closures
const itemsRef = useRef<Item[]>(items)
useEffect(() => {
  itemsRef.current = items
}, [items])

// ✓ Return consistent object shapes
return { data, isLoading, error, refetch }

// ✗ BAD: Conditional returns
if (isLoading) return { isLoading: true }
return { data }

// ✓ ALWAYS clean up useEffect
useEffect(() => {
  const timer = setTimeout(() => { ... }, 1000)
  return () => clearTimeout(timer) // MUST cleanup
}, [])
```

---

## Server Actions

### Server Action Template

Reference: `lib/actions/mark-complete.ts`

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import type { GiftItem } from '@/types/database'

// 1. Export response type
export interface ActionNameResponse {
  success: boolean
  data?: GiftItem
  error?: string
  code?: string
}

/**
 * Brief description of what this action does
 * @param input - Description of the input parameter
 * @returns Response with success status and data or error
 */
export async function actionName(
  input: ActionInput
): Promise<ActionNameResponse> {
  try {
    const supabase = await createClient()

    // STEP 1: Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
        code: 'AUTH_REQUIRED'
      }
    }

    // STEP 2: Validate input
    const trimmedName = input.name.trim()
    if (!trimmedName) {
      return {
        success: false,
        error: 'Name is required',
        code: 'VALIDATION_ERROR'
      }
    }

    if (trimmedName.length > 100) {
      return {
        success: false,
        error: 'Name must be less than 100 characters',
        code: 'VALIDATION_ERROR'
      }
    }

    // STEP 3: Verify ownership/authorization
    const { data: item, error: fetchError } = await supabase
      .from('gift_items')
      .select('id, gift_lists!inner(user_id)')
      .eq('id', input.itemId)
      .single()

    if (fetchError || !item) {
      console.error('Failed to fetch item for ownership check:', fetchError)
      return {
        success: false,
        error: 'Item not found',
        code: 'NOT_FOUND'
      }
    }

    // Verify user owns this item
    if ((item as any).gift_lists.user_id !== user.id) {
      return {
        success: false,
        error: 'Unauthorized',
        code: 'FORBIDDEN'
      }
    }

    // STEP 4: Perform the database operation
    const { data, error } = await supabase
      .from('gift_items')
      .update({ name: trimmedName })
      .eq('id', input.itemId)
      .select()
      .single()

    if (error || !data) {
      console.error('Failed to update item:', error)
      return {
        success: false,
        error: 'Failed to update item',
        code: 'UPDATE_FAILED'
      }
    }

    // STEP 5: Return success
    return { success: true, data: data as GiftItem }

  } catch (error) {
    // STEP 6: Catch unexpected errors
    console.error('Unexpected error in actionName:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR'
    }
  }
}
```

### Server Action Rules

**MANDATORY STEPS (in order):**

1. ✓ Authenticate user first
2. ✓ Validate all inputs
3. ✓ Check authorization (verify ownership)
4. ✓ Perform database operation
5. ✓ Return structured response
6. ✓ Wrap in try-catch
7. ✓ Log errors with context

**Response Format:**
```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: string, code: string }
```

**Error Codes:**
- `AUTH_REQUIRED` - User not authenticated
- `VALIDATION_ERROR` - Input validation failed
- `NOT_FOUND` - Resource doesn't exist
- `FORBIDDEN` - User doesn't own resource
- `UPDATE_FAILED` / `CREATE_FAILED` / `DELETE_FAILED` - DB operation failed
- `INTERNAL_ERROR` - Unexpected error

---

## Utility Functions

### Utility File Template

Reference: `lib/utils/url-validator.ts`

```typescript
/**
 * Module description explaining the purpose of this utility file
 * Example: URL Validation Utilities - Prevents XSS attacks via malicious URLs
 */

/**
 * Brief description of what this function does
 * @param input - Description of input parameter
 * @param options - Optional configuration
 * @returns Description of return value
 */
export function utilityFunction(
  input: string,
  options?: { fallback?: string }
): string {
  // Defensive programming: validate inputs
  if (!input || typeof input !== 'string') {
    return options?.fallback ?? ''
  }

  // Core logic
  const processed = input.trim()

  return processed
}
```

### Utility Function Rules

1. **Pure functions only** - No side effects, no external state
2. **Defensive input validation** - Check types and nullability first
3. **Single responsibility** - One function, one job
4. **Composable** - Build complex logic from simple functions
5. **Well-documented** - JSDoc for all exported functions
6. **Type-safe** - No `any`, proper return types

```typescript
// ✓ GOOD: Defensive, pure, single responsibility
export function sanitizeUrl(url: string, fallback: string = '#'): string {
  if (!url || typeof url !== 'string') {
    return fallback
  }

  return isValidHttpUrl(url) ? url : fallback
}

// ✗ BAD: No validation, side effects
export function processUrl(url: string): string {
  localStorage.setItem('lastUrl', url) // Side effect!
  return url.trim()
}
```

---

## Testing Standards

### Test File Structure

Reference: `components/ui/button.test.tsx`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentToTest } from './component'

describe('ComponentToTest', () => {
  // Setup/teardown
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  // Group related tests
  describe('rendering', () => {
    it('should render with default props', () => {
      render(<ComponentToTest>Content</ComponentToTest>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should apply variant styles', () => {
      render(<ComponentToTest variant="danger">Danger</ComponentToTest>)
      const button = screen.getByRole('button')
      expect(button.className).toContain('red')
    })
  })

  describe('interactions', () => {
    it('should handle click events', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<ComponentToTest onClick={handleClick}>Click</ComponentToTest>)

      await user.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    it('should handle empty input', () => {
      // ...
    })

    it('should handle null values', () => {
      // ...
    })
  })
})
```

### Testing Best Practices

```typescript
// ✓ GOOD: Query by role (accessibility-first)
screen.getByRole('button')
screen.getByRole('textbox', { name: /email/i })

// ✗ BAD: Query by test ID (implementation detail)
screen.getByTestId('submit-button')

// ✓ GOOD: Use userEvent (simulates real user)
const user = userEvent.setup()
await user.click(button)
await user.type(input, 'text')

// ✗ BAD: Use fireEvent (low-level)
fireEvent.click(button)

// ✓ GOOD: Test behavior, not implementation
expect(screen.getByRole('button')).toBeDisabled()

// ✗ BAD: Test implementation details
expect(component.state.isDisabled).toBe(true)

// ✓ GOOD: Group related tests
describe('form validation', () => {
  it('should show error for empty email', () => { ... })
  it('should show error for invalid email', () => { ... })
})
```

### Test Naming

```typescript
// ✓ GOOD: Descriptive test names
it('should disable button when loading', () => { ... })
it('should not trigger click when disabled', () => { ... })
it('should show error message for invalid input', () => { ... })

// ✗ BAD: Vague test names
it('works correctly', () => { ... })
it('handles edge case', () => { ... })
it('test button', () => { ... })
```

---

## Security Best Practices

### URL Validation (CRITICAL)

**Always sanitize user-provided URLs:**

```typescript
// ✓ GOOD: Validate and sanitize
import { sanitizeUrl } from '@/lib/utils/url-validator'

const safeUrl = sanitizeUrl(userInput, '#')
window.open(safeUrl, '_blank', 'noopener,noreferrer')

// ✗ BAD: Direct use of user input
window.open(userInput, '_blank') // XSS via javascript: URLs!
```

### Input Validation

```typescript
// ✓ GOOD: Trim and validate all inputs
const trimmedName = data.name.trim()
if (!trimmedName || trimmedName.length > 100) {
  return { success: false, error: 'Invalid input' }
}

// ✓ GOOD: Check for whitespace-only strings
if (trimmedName === '') {
  return { success: false, error: 'Name cannot be empty' }
}

// ✗ BAD: Trust user input directly
await supabase.insert({ name: userInput })
```

### Authorization Checks

```typescript
// ✓ GOOD: Always verify ownership before mutations
const { data: item } = await supabase
  .from('gift_items')
  .select('*, gift_lists!inner(user_id)')
  .eq('id', itemId)
  .single()

if (item.gift_lists.user_id !== user.id) {
  return { success: false, error: 'Unauthorized' }
}

// Now safe to update
await supabase.from('gift_items').update(...).eq('id', itemId)

// ✗ BAD: Assume authenticated = authorized
await supabase.from('gift_items').update(...).eq('id', itemId)
// Any authenticated user can modify any item!
```

### Error Message Safety

```typescript
// ✓ GOOD: User-friendly message, log details
if (error) {
  console.error('Database error details:', error)
  return { success: false, error: 'Failed to save changes' }
}

// ✗ BAD: Expose internal error messages
return { success: false, error: error.message }
// Could leak: "duplicate key value violates unique constraint..."
```

---

## Anti-Patterns

### DO NOT Do These Things

```typescript
// ✗ BAD: Default exports
export default function Component() {}
// ✓ GOOD: Named exports
export function Component() {}

// ✗ BAD: Inline styles (except for dynamic values)
<div style={{ color: 'red' }}>
// ✓ GOOD: Tailwind classes
<div className="text-[#dc2626]">

// ✗ BAD: Magic numbers/strings
if (status === 'req') {}
setTimeout(() => {}, 300)
// ✓ GOOD: Named constants
if (status === 'required') {}
setTimeout(() => {}, TAB_OPEN_DELAY_MS)

// ✗ BAD: Deep prop drilling
<GrandChild user={user} theme={theme} settings={settings} />
// ✓ GOOD: Context or composition

// ✗ BAD: Giant components (>300 lines)
// ✓ GOOD: Extract sub-components

// ✗ BAD: Side effects in render
function Component() {
  localStorage.setItem('key', 'value') // NO!
  return <div />
}
// ✓ GOOD: Use useEffect
function Component() {
  useEffect(() => {
    localStorage.setItem('key', 'value')
  }, [])
  return <div />
}

// ✗ BAD: Silent error catching
try { } catch (e) { }
// ✓ GOOD: Log and handle
try { } catch (e) {
  console.error('Context:', e)
  return fallback
}

// ✗ BAD: Index as key for dynamic lists
items.map((item, index) => <Item key={index} />)
// ✓ GOOD: Use stable unique identifier
items.map((item) => <Item key={item.id} />)

// ✗ BAD: Type suppression without explanation
// @ts-expect-error
.insert({ ... })
// ✓ GOOD: Type assertion with comment
.insert({ ... } as GiftListInsert) // Supabase omits generated fields

// ✗ BAD: console.log in production code
console.log('User data:', user)
// ✓ GOOD: Remove debug logs or use proper logger
// (acceptable in error handlers: console.error)
```

---

## Code Review Checklist

Before approving any PR, verify ALL of these:

### TypeScript ✓
- [ ] No `any` types (unless documented exception with comment)
- [ ] Exported interfaces for all component props
- [ ] Types match established patterns (type vs interface)
- [ ] No `@ts-expect-error` without explanation comment

### Components ✓
- [ ] Uses `forwardRef` for UI primitives in `components/ui/`
- [ ] Has `displayName` set (for forwardRef components)
- [ ] Named export, not default export
- [ ] Accessibility attributes present (role, aria-*)
- [ ] Uses `cn()` for className merging
- [ ] Dark theme colors match palette

### Hooks ✓
- [ ] Callbacks are memoized with `useCallback`
- [ ] Dependencies are correct in useCallback/useEffect
- [ ] Returns consistent object shape
- [ ] Has `'use client'` directive
- [ ] Uses refs to avoid stale closures where needed

### Server Actions ✓
- [ ] Has `'use server'` directive
- [ ] Input validation at the start
- [ ] Authentication check
- [ ] Authorization/ownership verification
- [ ] Structured error response with error codes
- [ ] Errors logged with context
- [ ] Try-catch wrapper
- [ ] JSDoc comment with @param and @returns

### File Organization ✓
- [ ] File named in kebab-case
- [ ] Imports ordered correctly (React → External → Internal)
- [ ] Types exported at top of file
- [ ] No commented-out code

### General Code Quality ✓
- [ ] JSDoc comments for exported functions
- [ ] No console.log (console.error OK in error handlers)
- [ ] Tests added for new functionality
- [ ] No magic numbers (extract to constants)
- [ ] Security: URLs validated, inputs sanitized

### Tests ✓
- [ ] Tests grouped with describe blocks
- [ ] Descriptive test names
- [ ] Uses semantic queries (getByRole)
- [ ] Uses userEvent for interactions
- [ ] Tests edge cases (null, empty, error states)

---

## Variable Naming Conventions

### General Rules

```typescript
// ✓ GOOD: Descriptive names
const selectedItemIds = new Set<string>()
const isMarkingPurchased = false
const handleCreateList = () => { ... }

// ✗ BAD: Abbreviations
const selIds = new Set<string>()
const isMPurch = false
const handleCL = () => { ... }
```

### Booleans

```typescript
// ✓ GOOD: Boolean prefixes (is, has, can, should)
const isLoading = true
const hasError = false
const canEdit = user.role === 'admin'
const shouldShowBanner = items.length > 0

// ✗ BAD: Non-boolean names
const loading = true  // Unclear if boolean
const error = false   // Could be Error object
```

### Event Handlers

```typescript
// ✓ GOOD: handle prefix for local functions
const handleClick = () => { ... }
const handleSubmit = async () => { ... }

// ✓ GOOD: on prefix for props
interface Props {
  onClick: () => void
  onItemSelect: (id: string) => void
}
```

### Constants

```typescript
// ✓ GOOD: SCREAMING_SNAKE_CASE for true constants
const MAX_ITEMS_PER_LIST = 100
const DEFAULT_COLOR = '#6366f1'
const TAB_OPEN_DELAY_MS = 300

// ✓ GOOD: camelCase for configuration objects
const validationLimits = {
  listNameMax: 100,
  itemNameMax: 200,
} as const
```

### Types and Interfaces

```typescript
// ✓ GOOD: PascalCase
type FilterType = 'all' | 'required'
interface GiftItemProps { ... }
```

---

## Comment Guidelines

### When to Comment

```typescript
// ✓ GOOD: Complex business logic
// Verify ownership by joining through gift_lists
// This prevents users from modifying items they don't own
const { data } = await supabase
  .from('gift_items')
  .select('*, gift_lists!inner(user_id)')

// ✓ GOOD: Non-obvious behavior
// Stagger tab opening to avoid popup blocker
linksToOpen.forEach((link, index) => {
  setTimeout(() => {
    window.open(link.url, '_blank')
  }, index * TAB_OPEN_DELAY_MS)
})

// ✓ GOOD: JSDoc for public APIs
/**
 * Mark gift items as completed or uncompleted
 * @param itemIds - Array of gift item IDs to update
 * @param completed - Whether to mark as completed
 * @returns Response with success status
 */
export async function markItemsComplete(
  itemIds: string[],
  completed: boolean
): Promise<MarkItemsCompleteResponse>

// ✗ BAD: Obvious comments
// Set loading to true
setIsLoading(true)

// ✗ BAD: Commented-out code (use git history)
// const oldFunction = () => { ... }
```

### Comment Style

- **File headers**: JSDoc block for utility files
- **Function docs**: JSDoc for exported functions
- **Inline comments**: Single line `//` for complex logic only
- **Type suppressions**: ALWAYS include reason
- **TODOs**: Include context and owner

```typescript
// ✓ GOOD: Explanatory TODO
// TODO(kevin): Add rate limiting after MVP launch

// ✗ BAD: Vague TODO
// TODO: Fix this
```

---

## Quick Reference

### Project Color Palette

```typescript
// BACKGROUND COLORS
'#0f0f0f'  // Page background
'#141414'  // Card background
'#1a1a1a'  // Card hover

// BORDERS
'#2d2d2d'  // Default border
'#3d3d3d'  // Border hover

// TEXT
'#e4e4e7'  // Primary text (zinc-200)
'#a1a1aa'  // Secondary text (zinc-400)
'#71717a'  // Tertiary text (zinc-500)

// ACCENT COLORS
'#6366f1'  // Primary (indigo-500)
'#5558e3'  // Primary hover
'#dc2626'  // Danger (red-600)
'#b91c1c'  // Danger hover
'#10b981'  // Success (emerald-500)
```

### Common Patterns Quick Reference

```typescript
// Component with forwardRef
const Component = React.forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('base', className)} {...props} />
  )
)
Component.displayName = 'Component'
export { Component }

// Custom hook
export function useCustom() {
  const [state, setState] = useState()
  const callback = useCallback(() => {}, [])
  return { state, callback }
}

// Server action
export async function action(input: Input): Promise<ActionResponse<Data>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }
    // ... validation, authorization, operation
    return { success: true, data }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: 'Unexpected error' }
  }
}

// Utility function
export function utility(input: string, fallback = ''): string {
  if (!input || typeof input !== 'string') return fallback
  return input.trim()
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-06 | Initial standards from architect + code-reviewer analysis |

---

## Enforcement

These standards are **MANDATORY** for:
- All new code written by humans
- All code generated by AI agents
- All code reviews and PR approvals

**Exceptions** must be documented with comments explaining why the standard doesn't apply.

When in doubt, refer to the [Perfect Examples Reference](#perfect-examples-reference) at the top of this document.
