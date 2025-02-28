# Earn Feature Documentation

## Overview

The Earn feature allows users to supply tokens to the HashStack DeFi protocol
and earn interest. This document outlines the architecture and components of the
Earn feature.

## Architecture

The Earn feature is built using a modular architecture with the following key
components:

### State Management

- **Zustand Stores**: Local state management for components
    - `supply-form.store.ts`: Manages the supply form state

### Context Providers

- **EarnContext**: Provides token data and balances
- **EarnDrawerContext**: Manages drawer state and content
- **SupplyFormContext**: Provides supply form state and handlers

### Components

- **SideDrawer**: Reusable drawer component with Header and Body
- **SupplyForm**: Form for supplying tokens
- **EarnTable**: Table displaying available markets
- **EarnSupplyCard**: Card displaying token supply information
- **EarnWrapper**: Wrapper component providing context

### Hooks

- **useEarnTable**: Hook for earn table functionality
- **useSupplyForm**: Hook for supply form functionality
- **useEarnContext**: Hook for accessing earn context
- **useEarnDrawer**: Hook for accessing drawer context

## Flow

1. User clicks "Supply" on a token in the EarnTable or EarnSupplyCard
2. EarnDrawerContext opens the drawer with SupplyForm content
3. SupplyForm uses SupplyFormContext to manage form state
4. User enters amount and clicks "Supply"
5. useSupplyForm handles the supply transaction
6. Drawer closes after successful transaction

## Future Improvements

- Add more robust error handling
- Implement actual token balance calculations
- Create more comprehensive form validation
- Add more customization options for drawers
