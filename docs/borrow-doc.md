# HashStack DeFi - Borrow Feature Documentation

## Overview

The Borrow feature in HashStack DeFi allows users to borrow assets against their collateral. This documentation covers the architecture, components, and implementation details of the Borrow feature.

## Architecture

The Borrow feature follows a modular architecture with clear separation of concerns:

### Core Components

1. **Views**
   - `BorrowView`: Main view component for the Borrow feature
   - `MyDebtView`: Displays user's current loan positions

2. **Forms**
   - `BorrowForm`: For borrowing assets against collateral
   - `BorrowRepayForm`: For repaying borrowed assets
   - `BorrowAddCollateralForm`: For adding collateral to existing loans

3. **Tables**
   - `BorrowTable`: Displays available markets for borrowing
   - `MyDebtTable`: Shows user's current loan positions

4. **State Management**
   - Zustand stores with context-based pattern
   - Custom hooks for business logic

## State Management

### Store Implementation

The Borrow feature uses Zustand with React Context for state management, following the same pattern as the Earn feature:

```tsx
// Example of store creation pattern
const createBorrowFormStore = (initialBorrowMarket: MarketLoan) => {
  return create<BorrowFormState>((set) => ({
    // Initial state
    borrowMarket: initialBorrowMarket,
    collateralMarket: null,
    amount: '',
    borrowAmount: '',
    loading: false,
    
    // Actions
    setAmount: (amount) => set({ amount }),
    setBorrowAmount: (borrowAmount) => set({ borrowAmount }),
    setCollateralMarket: (collateralMarket) => set({ collateralMarket }),
    setLoading: (loading) => set({ loading }),
    resetStore: (newBorrowMarket) => set({ 
      ...initialState, 
      borrowMarket: newBorrowMarket !== undefined ? newBorrowMarket : initialBorrowMarket 
    }),
  }));
};
```

### Context Providers

Context providers are used to initialize stores and provide them to components:

```tsx
export const BorrowFormContextProvider: React.FC<BorrowFormContextProviderProps> = ({
  children,
  initialBorrowMarket,
}) => {
  const storeRef = useRef<StoreApi<BorrowFormState>>();
  
  if (!storeRef.current) {
    storeRef.current = createBorrowFormStore(initialBorrowMarket);
  }
  
  useEffect(() => {
    if (storeRef.current && initialBorrowMarket) {
      storeRef.current.getState().resetStore(initialBorrowMarket);
    }
  }, [initialBorrowMarket]);
  
  return (
    <BorrowFormContext.Provider value={storeRef.current}>
      {children}
    </BorrowFormContext.Provider>
  );
};
```

### Business Logic Hooks

Custom hooks encapsulate business logic and provide a clean API for components:

```tsx
export const useBorrowForm = () => {
  // Access store state using selectors
  const amount = useBorrowFormStore((state) => state.amount);
  const borrowAmount = useBorrowFormStore((state) => state.borrowAmount);
  const borrowMarket = useBorrowFormStore((state) => state.borrowMarket);
  const collateralMarket = useBorrowFormStore((state) => state.collateralMarket);
  
  // Drawer context for UI management
  const { closeDrawer } = useBorrowDrawerContext();
  
  // Business logic
  const handleBorrow = useCallback(() => {
    // Implementation
  }, [amount, borrowAmount, borrowMarket, collateralMarket]);
  
  const validateForm = useCallback(() => {
    // Validation logic
    return { 
      collateralValid: true, 
      borrowValid: true, 
      collateralError: '', 
      borrowError: '' 
    };
  }, [amount, borrowAmount, borrowMarket, collateralMarket]);
  
  return {
    amount,
    borrowAmount,
    borrowMarket,
    collateralMarket,
    handleBorrow,
    validateForm,
    closeDrawer,
  };
};
```

## Form Components

### Borrow Form

The Borrow Form allows users to borrow assets against collateral:

- **Inputs**: Collateral amount and borrow amount inputs with max buttons
- **Token Selection**: For selecting collateral and borrow assets
- **Price Breakdown**: Details of the borrow transaction including health factor

### Repay Form

The Repay Form allows users to repay borrowed assets:

- **Inputs**: Repay amount input with max button
- **Loan Details**: Displays loan information including health factor
- **Price Breakdown**: Details of the repay transaction

### Add Collateral Form

The Add Collateral Form allows users to add collateral to existing loans:

- **Inputs**: Collateral amount input with max button
- **Loan Details**: Displays loan information including health factor
- **Price Breakdown**: Details of the add collateral transaction

## Data Flow

1. User selects a market from the BorrowTable
2. BorrowForm is opened via the drawer context
3. User selects collateral asset and enters amounts
4. Form validates the inputs
5. User confirms the transaction
6. Transaction is processed
7. UI is updated with new loan position data

## LoanPosition Data Structure

The Borrow feature uses the LoanPosition data structure to represent user loans:

```tsx
interface LoanPosition {
  loanId: string;
  borrowedAsset: TokenData;
  collateralAsset: TokenData;
  borrowedAmount: BigNumber;
  collateralAmount: BigNumber;
  healthFactor: BigNumber;
  repayFee: BigNumber;
  // Additional properties
}
```

This structure replaced the previous MarketLoan structure and includes important metrics like health factor.

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

The Borrow feature implements comprehensive error handling:

- **Validation Errors**: Form validation with clear error messages using the ValidationError component
- **Transaction Errors**: Handling of failed transactions
- **Loading States**: Proper loading state management

## UI Components

The Borrow feature uses shared UI components:

- **ValidationError**: For displaying form validation errors
- **SideDrawer**: Responsive drawer for forms
- **Card**: For grouping related information
- **TokenSelector**: For selecting tokens
