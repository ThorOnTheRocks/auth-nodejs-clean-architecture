# Auth REST API - Clean Architecture

A robust REST API server built with Node.js/Express.js following Clean Architecture principles. This project implements a secure authentication system with JWT, using MongoDB as the database with Mongoose ODM.

## 🏗️ Architecture Overview

This application is structured following the Clean Architecture pattern, which separates the codebase into concentric layers with dependencies pointing inward. This design promotes:

- **Separation of concerns**: Each layer has a specific responsibility
- **Independence from frameworks**: Core business logic is isolated from external frameworks
- **Testability**: Components can be tested in isolation
- **Maintainability**: Changes in one layer have minimal impact on others

### 📦 Project Structure

```
src/
├── config/             # Environment and configuration settings
├── data/               # Database connection and models
├── domain/             # Business rules and entities
│   ├── datasources/    # Abstract interfaces for data access
│   ├── dtos/           # Data transfer objects
│   ├── entities/       # Enterprise business objects
│   ├── errors/         # Custom error handling
│   ├── repository/     # Abstract repository interfaces
│   └── use-cases/      # Application business rules
├── infrastructure/     # Implementation of interfaces defined in domain
│   ├── datasources/    # Concrete implementations of data sources
│   ├── mappers/        # Transform data between layers
│   └── repository/     # Concrete implementations of repositories
├── presentation/       # Controllers, routes, and middleware
│   ├── auth/           # Authentication controllers and routes
│   └── middlewares/    # Express middleware functions
└── validators/         # Input validation
```

## 🔄 Layer Breakdown

### 1. Domain Layer

The **domain layer** is the core of the application, containing business entities and use cases independent of any external factors.

- **Entities**: Core business objects (e.g., `UserEntity`)
- **Use Cases**: Application-specific business rules
- **DTOs (Data Transfer Objects)**: Structured objects for passing data between layers
- **Repository Interfaces**: Abstract definitions for data access
- **Data Source Interfaces**: Abstract sources for different types of data
- **Custom Errors**: Specialized error handling for the domain

This layer has no dependencies on external frameworks or databases and defines abstract interfaces that outer layers must implement.

### 2. Infrastructure Layer

The **infrastructure layer** contains concrete implementations of the interfaces defined in the domain layer.

- **Data Source Implementations**: Connect to external systems (MongoDB)
- **Repository Implementations**: Handle data persistence logic
- **Mappers**: Transform data between domain entities and database models

This layer adapts external resources to domain interfaces, making the system adaptable to different technologies.

### 3. Presentation Layer

The **presentation layer** handles HTTP requests, authentication, and the application's REST API endpoints.

- **Controllers**: Process incoming requests and return responses
- **Routes**: Define API endpoints and connect them to controllers
- **Middleware**: Handle cross-cutting concerns like authentication
- **Server**: Express.js server configuration

This layer depends on the domain layer but not directly on the infrastructure implementations.

### 4. Data Layer

The **data layer** manages database connections and defines database models.

- **Models**: Mongoose schemas for MongoDB
- **Database Connection**: Configuration for connecting to MongoDB

### 5. Config

The **config layer** manages environment variables and application configuration.

- **Environment Variables**: Centralized access to environment settings
- **Authorization**: JWT and bcrypt implementations

## 🔒 Authentication System

The application includes a complete authentication system with:

- User registration
- User login with email/password
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Docker & Docker Compose (optional)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=8000
MONGO_DB_URL_LOCAL=mongodb://localhost:27017
MONGO_DB_NAME_LOCAL=your_database_name
JWT_SECRET=your_jwt_secret_key
```

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start the server
npm start

# Start with Docker
docker-compose up -d
```

## 🛣️ API Routes

### Authentication

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login and get JWT token
- **GET /api/auth**: Get all users (requires authentication)

## 🛠️ Built With

- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication
- **bcrypt**: Password hashing
- **Docker**: Containerization

## 📝 Design Decisions

### Why Clean Architecture?

1. **Framework Independence**: The business logic isn't tied to Express.js or MongoDB, making it possible to change these technologies with minimal impact.

2. **Testability**: Each component can be tested in isolation, with proper mocking of dependencies.

3. **Maintainability**: Clearly defined boundaries between layers make the codebase easier to understand and maintain.

4. **Scalability**: New features can be added without affecting existing functionality.

### Authentication Flow

1. User registers or logs in through the presentation layer
2. Request is validated using DTOs in the domain layer
3. Use cases execute the business logic
4. Data is persisted via repositories
5. JWT token is generated and returned to the client
