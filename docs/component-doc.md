# HashStack DeFi - UI Components Documentation

## Overview

This document provides an overview of the shared UI components used throughout the HashStack DeFi application. These components are designed to be reusable, consistent, and follow best practices for React development.

## Component Library Structure

The component library is organized in the following directory structure:

```
/components
  /ui                 # Core UI components
    /button           # Button components
    /card             # Card components
    /typography       # Typography components
    /validation-error # Validation error component
    ...
  /drawer            # Drawer components
  /form              # Form components
  /layout            # Layout components
  ...
```

## Core UI Components

### Button Components

The application provides several button variants:

- `Btn.Primary`: Primary action button
- `Btn.Secondary`: Secondary action button
- `Btn.Outline`: Outlined button
- `ConnectedBtn.Primary`: Primary button with wallet connection handling

```tsx
<Btn.Primary onClick={handleClick}>Submit</Btn.Primary>
<ConnectedBtn.Primary onClick={handleSubmit} showConnectButton parentWidth>
  Connect Wallet
</ConnectedBtn.Primary>
```

### Typography Components

Consistent text styling is provided through typography components:

- `Text.Regular14`: Regular text
- `Text.Medium16`: Medium weight text
- `Text.Semibold20`: Semibold text
- And other variants

```tsx
<Text.Semibold20>Supply</Text.Semibold20>
<Text.Regular14>Available balance: 100 USDC</Text.Regular14>
```

### Card Components

Card components are used for grouping related information:

- `Card`: Basic card container
- `StatCard`: For displaying statistics

```tsx
<Card className="p-4 bg-card-bold">
  <StatCard
    title="Total Value Locked"
    value="$1,234,567"
    isLoading={loading}
  />
</Card>
```

### ValidationError Component

The `ValidationError` component is used for displaying form validation errors:

```tsx
<ValidationError
  error="Insufficient balance"
  availableText="Available"
  availableValue="100"
  availableSymbol="USDC"
/>
```

## Drawer Components

The application uses a responsive drawer system:

### SideDrawer

The `SideDrawer` component adapts based on screen size:

- Mobile: Bottom drawer that slides up
- Desktop: Side drawer that slides in from the right

```tsx
<SideDrawer>
  <SideDrawer.Header>
    <Text.Semibold20>Title</Text.Semibold20>
    <Btn.Outline onClick={closeDrawer}>✕</Btn.Outline>
  </SideDrawer.Header>
  <SideDrawer.Body>
    {/* Content */}
  </SideDrawer.Body>
  <SideDrawer.Footer>
    {/* Actions */}
  </SideDrawer.Footer>
</SideDrawer>
```

## Form Components

### Input Components

The application provides various input components:

- `Input`: Basic text input
- `AmountInput`: For entering token amounts
- `TokenSelector`: For selecting tokens

```tsx
<AmountInput
  value={amount}
  onChange={setAmount}
  onMax={handleMax}
  placeholder="0.00"
/>
```

## State Management Patterns

### Zustand Store with Context

The application uses Zustand with React Context for state management:

```tsx
// Store creation
const createStore = (initialState) => create<State>((set) => ({
  // State and actions
}));

// Context provider
const StoreProvider = ({ children, initialState }) => {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = createStore(initialState);
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

// Store hook with selector pattern
const useStore = (selector) => {
  const store = useContext(StoreContext);
  return useStore(store, selector);
};
```

## Best Practices

### Component Structure

Components are structured following these patterns:

1. **Container/Presentation Split**: Separating logic from presentation
2. **Compound Components**: Using dot notation for related components (e.g., `SideDrawer.Header`)
3. **Context Providers**: Wrapping components with context providers

### State Management

1. **Selector Pattern**: Using individual selectors for Zustand store state

```tsx
// Preferred pattern - use individual selectors
const setSupplyMarketDataQueryKey = useQueryKeyStore(
  (state) => state.setSupplyMarketDataQueryKey
);

// Avoid using destructuring pattern
// NOT preferred:
const {
  setSupplyMarketData,
  setSupplyMarketLoading
} = useTokenStore();
```

2. **Store Reset**: Implementing resetStore methods for clean state management

```tsx
resetStore: (newToken) => set({ 
  ...initialState, 
  token: newToken !== undefined ? newToken : initialToken 
})
```

### Responsive Design

Components are designed to be responsive using Tailwind's responsive classes:

```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Content */}
</div>
```

## Recently Added Components

### ValidationError Component

The `ValidationError` component was recently added to standardize error display across forms:

```tsx
// Before
<div className='mb-2 py-2 px-3 bg-badge-error border text-badge-error rounded-md'>
  <p className='text-sm'>
    {error}
    {error === 'Insufficient balance' && (
      <span className='block text-xs mt-1'>
        Available: {balance} {symbol}
      </span>
    )}
  </p>
</div>

// After
<ValidationError
  error={error}
  availableText={error === 'Insufficient balance' ? 'Available' : undefined}
  availableValue={error === 'Insufficient balance' ? balance : undefined}
  availableSymbol={error === 'Insufficient balance' ? symbol : undefined}
/>
```

This component is now used across all form components in the application, including:
- SupplyForm
- SupplyWithdrawForm
- BorrowForm
- BorrowRepayForm
- BorrowAddCollateralForm
