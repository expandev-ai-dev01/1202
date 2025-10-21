# Safe Pazz - Backend API

Secure password generator system backend API.

## Features

- Random password generation with customizable parameters
- Password strength evaluation
- Secure encrypted storage
- Password export functionality
- Password history tracking
- Memorable password generation
- Multi-device synchronization

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Architecture**: REST API

## Project Structure

```
src/
├── api/              # API controllers
├── routes/           # Route definitions
├── middleware/       # Express middleware
├── services/         # Business logic
├── utils/            # Utility functions
├── constants/        # Application constants
├── config/           # Configuration
└── server.ts         # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

### Development

Run the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

### Production

Start production server:
```bash
npm start
```

## API Documentation

### Health Check

```
GET /health
```

Returns API health status.

### API Versioning

All endpoints are versioned:
- V1: `/api/v1/`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 3000 |
| API_VERSION | API version | v1 |
| CORS_ORIGINS | Allowed CORS origins | localhost |
| BCRYPT_ROUNDS | Password hashing rounds | 10 |
| CACHE_TTL | Cache time-to-live (seconds) | 3600 |

## Code Standards

- TypeScript strict mode enabled
- ESLint for code quality
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Maximum line length: 120 characters

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## License

ISC