---
name: component
description: Create a new React component following DevBoard conventions
---

Create a new React component for DevBoard with the following structure:

## Instructions

Create the component at `src/components/$COMPONENT_NAME/index.tsx` with:

1. **TypeScript interface** for props named `$COMPONENT_NAMEProps`
2. **Named export** (not default export)
3. **data-testid** attribute on the root element: `data-testid="$COMPONENT_NAME_KEBAB_CASE"`
4. Use **shadcn/ui** components when applicable
5. Use **Tailwind CSS** for styling

## Template

```typescript
interface $COMPONENT_NAMEProps {
  // define props here
}

export function $COMPONENT_NAME({ }: $COMPONENT_NAMEProps) {
  return (
    <div data-testid="$COMPONENT_NAME_KEBAB_CASE">
      {/* component content */}
    </div>
  )
}
```

## Test

Also create `src/components/$COMPONENT_NAME/__tests__/$COMPONENT_NAME.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { $COMPONENT_NAME } from '../'

describe('$COMPONENT_NAME', () => {
  it('renders correctly', () => {
    render(<$COMPONENT_NAME />)
    expect(screen.getByTestId('$COMPONENT_NAME_KEBAB_CASE')).toBeInTheDocument()
  })
})
```

## Re-export

Add the export to `src/components/index.ts`:
```typescript
export { $COMPONENT_NAME } from './$COMPONENT_NAME'
```
