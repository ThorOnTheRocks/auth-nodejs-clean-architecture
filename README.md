# Authentication REST API Service

A comprehensive authentication service built with Node.js, TypeScript, and Express that provides robust authentication, authorization, and security features for modern web applications.

## Features

- 🔐 **Authentication**
  - Email/password authentication
  - OAuth2 integration (Google, GitHub)
  - JWT-based access tokens with refresh token rotation
  - Multi-device session management
- 📧 **Account Management**
  - Email verification flow
  - Password reset functionality
  - Profile management
  - Account recovery options
- 🛡️ **Security**
  - Brute force protection
  - Device tracking and management
  - Security event logging
  - Account locking mechanisms
  - Suspicious activity detection
- 🔒 **Authorization**
  - Role-based access control
  - Permission management
  - Admin security controls
- 🗄️ **Database Support**
  - PostgreSQL (primary)
  - MongoDB (alternative)

## Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Databases**: PostgreSQL, MongoDB
- **ORM/ODM**: TypeORM, Mongoose
- **Authentication**: JWT, Passport.js
- **Email**: Resend
- **Docker**: Multi-container setup with docker-compose
- **Testing**: Vitest (recommended), Supertest

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ or MongoDB 6+
- Docker & Docker Compose (optional, for containerized setup)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/auth-nodejs.git
   cd auth-nodejs
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env.development` file:

   ```
   # See Environment Variables section below
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Using Docker

The project includes a Docker setup for easy deployment:

1. Make sure Docker and Docker Compose are installed
2. Create a `.env.development` file with your configuration
3. Run the containers:
   ```bash
   docker-compose up
   ```

This will start:

- The Node.js application
- PostgreSQL database
- MongoDB database
- PGAdmin (PostgreSQL management tool)
- Mongo Express (MongoDB management tool)

## Environment Variables

Create a `.env.development` file with the following variables:

```
# Server Configuration
PORT=8000
NODE_ENV=development

# PostgreSQL Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=auth_db
POSTGRES_LOCAL_PORT=5433
POSTGRES_HOST=postgres-db

# MongoDB Database
MONGO_DB_NAME_LOCAL=auth_db
MONGO_USER=mongo_user
MONGO_PASSWORD=mongo_password
MONGO_DB_URL_LOCAL=mongodb://mongo_user:mongo_password@mongo-db:27017/auth_db?authSource=admin

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key

# Database Type
DATABASE_TYPE=postgres  # or mongodb

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/oauth/google/callback

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:8000/api/oauth/github/callback

# Email Configuration
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=auth@yourdomain.com

# Admin Tools
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin
ME_USERNAME=admin
ME_PASSWORD=admin

# Application URLs
APP_URL=http://localhost:8000
FILE_STORAGE_URL=http://localhost:8000/uploads
```

## API Routes

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Log out (current device)
- `POST /api/auth/logout-all` - Log out from all devices
- `POST /api/auth/change-password` - Change password

### OAuth

- `GET /api/oauth/google` - Google OAuth login
- `GET /api/oauth/github` - GitHub OAuth login
- `GET /api/oauth/methods` - Get user's connected auth methods
- `POST /api/oauth/link` - Link OAuth provider to account
- `DELETE /api/oauth/unlink/:provider` - Unlink OAuth provider

### Email Verification

- `GET /api/verification/verify` - Verify email with token
- `POST /api/verification/resend` - Resend verification email

### Password Reset

- `POST /api/password-reset/request` - Request password reset
- `GET /api/password-reset/validate` - Validate reset token
- `POST /api/password-reset/reset` - Reset password with token

### Profile Management

- `GET /api/profile/me` - Get user profile
- `PUT /api/profile/me` - Update user profile
- `POST /api/profile/image` - Upload profile image
- `GET /api/profile/image` - Get user's profile image

### Security

- `GET /api/security/events/recent` - Get recent security events
- `GET /api/security/events/type/:type` - Get events by type
- `GET /api/security/events/user/:userId` - Get user's security events

### Device Management

- `GET /api/devices` - Get user's devices
- `POST /api/devices/:deviceId/trust` - Mark device as trusted
- `DELETE /api/devices/:deviceId` - Remove device

### Admin Security

- `POST /api/admin/security/users/:userId/lock` - Lock user account
- `POST /api/admin/security/users/:userId/unlock` - Unlock user account
- `GET /api/admin/security/users/:userId/events` - Get user's security events
- `GET /api/admin/security/events/failed-logins` - Get failed login attempts

## Project Structure

The project follows a clean architecture approach with domain-driven design principles:

```
src/
├── config/              # Configuration files
├── database/            # Database connection and models
├── domain/              # Domain entities and interfaces
├── features/            # Feature modules
│   ├── auth/            # Authentication functionality
│   ├── email/           # Email services
│   ├── oauth/           # OAuth integration
│   ├── password-reset/  # Password reset flow
│   ├── profile/         # User profile management
│   ├── security/        # Security features
│   ├── token/           # Token management
│   └── verification/    # Email verification
├── infrastructure/      # Infrastructure implementations
├── presentation/        # Express routes and server
├── types/               # TypeScript type definitions
└── validators/          # Input validation
```

## Testing

### Setting Up Tests

1. Install Vitest (recommended) or Jest:

   ```bash
   npm install --save-dev vitest supertest
   ```

2. Create a configuration file:

   ```bash
   # For Vitest
   touch vite.config.ts
   ```

3. Add test script to package.json:
   ```json
   {
     "scripts": {
       "test": "vitest run",
       "test:watch": "vitest"
     }
   }
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Structure

Organize tests by feature:

```
tests/
├── auth/
│   ├── registration.test.ts
│   ├── login.test.ts
│   └── refresh-token.test.ts
├── oauth/
│   └── oauth-flows.test.ts
└── setup.ts
```

## Security Features

This authentication service includes multiple layers of security:

1. **Brute Force Protection**:

   - Account lockout after multiple failed attempts
   - IP-based rate limiting
   - Exponential backoff

2. **Device Management**:

   - Device fingerprinting
   - New device notifications
   - Suspicious login detection

3. **Token Security**:

   - Short-lived access tokens (2 hours)
   - Refresh token rotation
   - Secure HTTP-only cookies

4. **Audit Logging**:
   - Security event tracking
   - Login attempt monitoring
   - Admin security controls

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
