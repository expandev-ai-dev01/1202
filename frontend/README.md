# Safe Pazz - Secure Password Generator

A secure password generation and management system built with React, TypeScript, and TailwindCSS.

## Features

- 🔐 Secure random password generation
- 🎨 Customizable password parameters
- 💪 Password strength evaluation
- 💾 Secure encrypted storage
- 📱 Cross-device synchronization
- 📊 Password history tracking
- 💾 Secure password export
- 🧠 Memorable password generation

## Tech Stack

- **Framework**: React 18.3.1
- **Language**: TypeScript 5.6.3
- **Build Tool**: Vite 5.4.11
- **Styling**: TailwindCSS 3.4.14
- **Routing**: React Router DOM 6.26.2
- **State Management**: Zustand 5.0.1
- **Data Fetching**: TanStack Query 5.59.20
- **Forms**: React Hook Form 7.53.1 + Zod 3.23.8
- **HTTP Client**: Axios 1.7.7

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running on http://localhost:3000

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Start development server:

```bash
npm run dev
```

The application will be available at http://localhost:3001

## Project Structure

```
src/
├── app/                    # Application configuration
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   ├── providers.tsx      # Global providers
│   └── router.tsx         # Routing configuration
├── core/                   # Shared core functionality
│   ├── components/        # Generic UI components
│   ├── lib/              # Library configurations
│   ├── types/            # Global types
│   └── utils/            # Utility functions
├── domain/                # Business domains (to be added)
├── pages/                 # Page components
│   ├── layouts/          # Layout components
│   ├── Home/             # Home page
│   └── NotFound/         # 404 page
└── assets/               # Static assets
    └── styles/           # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Configuration

The application connects to the backend API with the following structure:

- **Public endpoints**: `/api/v1/external/*`
- **Authenticated endpoints**: `/api/v1/internal/*`

Configure the API URL in `.env`:

```
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```

## Contributing

This is the foundation structure. Features will be implemented in separate domain modules following the established architecture patterns.

## License

Private project - All rights reserved