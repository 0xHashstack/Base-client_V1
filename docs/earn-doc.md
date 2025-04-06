# HashStack DeFi - Earn Feature Documentation

## Overview

The Earn feature in HashStack DeFi allows users to supply assets to the protocol and earn interest. This documentation covers the architecture, components, and implementation details of the Earn feature.

## Architecture

The Earn feature follows a modular architecture with clear separation of concerns:

### Core Components

1. **Views**
   - `EarnView`: Main view component for the Earn feature
   - `MyPositionsView`: Displays user's current supply positions
   - `ProtocolInsightsView`: Shows protocol statistics and charts

2. **Forms**
   - `SupplyForm`: For supplying assets to the protocol
   - `SupplyWithdrawForm`: For withdrawing supplied assets

3. **Tables**
   - `EarnTable`: Displays available markets for supplying
   - `MyPositionsTable`: Shows user's current supply positions

4. **State Management**
   - Zustand stores with context-based pattern
   - Custom hooks for business logic

## State Management

### Store Implementation

The Earn feature uses Zustand with React Context for state management, following the createContext pattern:

```tsx
// Example of store creation pattern
const createSupplyFormStore = (initialToken: SupplyMarketData) => {
  return create<SupplyFormState>((set) => ({
    // Initial state
    market: initialToken,
    amount: '',
    loading: false,
    
    // Actions
    setAmount: (amount) => set({ amount }),
    setMaxAmount: (amount) => set({ amount }),
    setLoading: (loading) => set({ loading }),
    resetStore: (newToken) => set({ 
      ...initialState, 
      market: newToken !== undefined ? newToken : initialToken 
    }),
  }));
};
```

### Context Providers

Context providers are used to initialize stores and provide them to components:

```tsx
export const SupplyFormContextProvider: React.FC<SupplyFormContextProviderProps> = ({
  children,
  market,
}) => {
  const storeRef = useRef<StoreApi<SupplyFormState>>();
  
  if (!storeRef.current) {
    storeRef.current = createSupplyFormStore(market);
  }
  
  useEffect(() => {
    if (storeRef.current && market) {
      storeRef.current.getState().resetStore(market);
    }
  }, [market]);
  
  return (
    <SupplyFormContext.Provider value={storeRef.current}>
      {children}
    </SupplyFormContext.Provider>
  );
};
```

### Business Logic Hooks

Custom hooks encapsulate business logic and provide a clean API for components:

```tsx
export const useSupplyForm = () => {
  // Access store state using selectors
  const amount = useSupplyFormStore((state) => state.amount);
  const market = useSupplyFormStore((state) => state.market);
  const setAmount = useSupplyFormStore((state) => state.setAmount);
  
  // Drawer context for UI management
  const { closeDrawer } = useEarnDrawerContext();
  
  // Business logic
  const handleSupply = useCallback(() => {
    // Implementation
  }, [amount, market]);
  
  const validateAmount = useCallback(() => {
    // Validation logic
    return { valid: true, error: '' };
  }, [amount, market]);
  
  return {
    amount,
    market,
    setAmount,
    handleSupply,
    validateAmount,
    closeDrawer,
  };
};
```

## Form Components

### Supply Form

The Supply Form allows users to supply assets to the protocol:

- **Inputs**: Amount input with max button
- **Token Info**: Displays token information and balance
- **APR**: Shows current supply APR
- **Price Breakdown**: Details of the supply transaction

### Withdraw Form

The Withdraw Form allows users to withdraw supplied assets:

- **Inputs**: Amount input with max button
- **Token Info**: Displays token information and balance
- **Price Breakdown**: Details of the withdrawal transaction

## Data Flow

1. User selects a market from the EarnTable
2. SupplyForm is opened via the drawer context
3. User enters an amount to supply
4. Form validates the input
5. User confirms the transaction
6. Transaction is processed
7. UI is updated with new position data

## Best Practices

1. **Selector Pattern**: Use individual selectors for accessing Zustand store state to prevent unnecessary re-renders
2. **Store Reset**: Implement a resetStore method for clean state management when switching tokens
3. **Context-Based Store**: Use the createContext pattern for isolated store instances
4. **Component Splitting**: Split components into container and presentation components

## Integration Points

- **Wallet Connection**: Integration with wallet providers
- **Contract Interaction**: Web3 service for interacting with smart contracts
- **Data Fetching**: Query management for fetching market data

## Error Handling

The Earn feature implements comprehensive error handling:

- **Validation Errors**: Form validation with clear error messages
- **Transaction Errors**: Handling of failed transactions
- **Loading States**: Proper loading state management

## UI Components

The Earn feature uses shared UI components:

- **ValidationError**: For displaying form validation errors
- **StatCard**: For displaying key metrics
- **SideDrawer**: Responsive drawer for forms
- **Card**: For grouping related information
