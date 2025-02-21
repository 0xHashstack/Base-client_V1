# HashStack Base Client

A modern, Web3-enabled Next.js application built with TypeScript and
TailwindCSS. This project serves as the base client for HashStack's
decentralized platform.

## 🏗 Architecture

### Tech Stack

- **Framework**: Next.js 15.1 with React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS with SASS support
- **Web3**: RainbowKit, wagmi, and viem for blockchain interactions
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: Radix UI primitives

### Project Structure

```
├── app/                  # Next.js 15 app directory (pages, layouts)
├── assets/              # Static assets (images, icons)
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── ...             # Feature-specific components
├── constant/           # Application constants and configurations
├── context/            # React context providers
├── features/           # Feature-specific modules
├── hooks/              # Custom React hooks
├── lib/                # Third-party library configurations
├── store/              # Zustand store definitions
├── styles/             # Global styles and Tailwind configurations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── web3/               # Web3-specific implementations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

```bash
# Install dependencies
yarn install

# Setup environment variables
cp .env.example .env.local

# Start development server
yarn dev
```

The application will be available at
[http://localhost:3000](http://localhost:3000).

### Development Features

- **TurboRepo Integration**: Faster development builds
- **TypeScript**: Strict type checking
- **ESLint & Prettier**: Code quality and formatting
- **Tailwind CSS**: Utility-first CSS framework with animations

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_WALLET_CONNECT_ID`: WalletConnect Project ID
- `NEXT_PUBLIC_ALCHEMY_ID`: Alchemy API Key
- Additional network-specific variables

### Web3 Configuration

Web3 providers and network configurations are managed in `web3/` directory. The
application supports multiple networks through RainbowKit and wagmi.

## 📦 Build & Deployment

```bash
# Production build
yarn build

# Start production server
yarn start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request to `development` branch

This project is proprietary software. All rights reserved.
