# OTA Backend API

A production-ready Node.js backend API built with Express.js, Prisma ORM, and MySQL database for OTA (Over-The-Air) update management.

## 🚀 Features

- **Authentication & Authorization**: JWT-based admin authentication
- **Database Management**: Prisma ORM with MySQL
- **Security**: Helmet, CORS, rate limiting, input validation
- **Logging**: Structured logging with audit trails
- **Error Handling**: Comprehensive error handling and validation
- **Production Ready**: Environment validation, graceful shutdown, health checks

## 📋 Prerequisites

- Node.js >= 20.0.0
- MySQL >= 8.0
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ota-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/ota_database"
   JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
   JWT_EXPIRES_IN="24h"
   PORT=3000
   NODE_ENV="development"
   BCRYPT_ROUNDS=12
   ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed the database
   npm run db:seed
   ```

## 🚀 Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## 📚 API Endpoints

### Health Check
- `GET /api/v1/health` - Health check endpoint


## 🔧 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed the database
- `npm run db:refresh` - Reset and seed database
- `npm run db:studio` - Open Prisma Studio

## 🏗️ Project Structure

```
ota-backend/
├── config/
│   ├── database.js      # Database configuration
│   └── env.js          # Environment validation
├── controllers/
│   └── authController.js # Authentication controllers
├── middlewares/
│   ├── authMiddleware.js # JWT authentication middleware
│   ├── validation.js    # Base validation utilities
│   └── validation/      # Validation middleware by feature
│       ├── authValidation.js    # Authentication validations
│       ├── commonValidation.js  # Common validations
│       ├── otaValidation.js     # OTA update validations
│       ├── deviceValidation.js  # Device management validations
│       └── index.js            # Centralized validation exports
├── models/
│   └── Admin.js         # Admin model
├── prisma/
│   ├── migrations/      # Database migrations
│   ├── schema.prisma    # Database schema
│   └── seed.js         # Database seeding
├── routes/
│   └── index.js        # API routes
├── services/
│   └── authService.js  # Authentication service
├── utils/
│   ├── logger.js       # Logging utility
│   └── response.js     # Response utility
├── server.js           # Main server file
└── package.json
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Input Validation**: Comprehensive input sanitization and validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Environment Validation**: Required environment variables validation

## ✅ Validation System

The application uses a structured validation system organized by feature:

### Validation Structure
- **Base Validation** (`middlewares/validation/baseValidation.js`): Core validation utilities
- **Auth Validations** (`middlewares/validation/authValidation.js`): Authentication validations
- **Centralized Exports** (`middlewares/validation/index.js`): Single import point

### Validation Features
- **Input Sanitization**: Automatic XSS protection
- **Type Validation**: String, number, boolean, email validation
- **Length Validation**: Min/max length constraints
- **Enum Validation**: Allowed value validation
- **Custom Rules**: Pattern matching and custom validation
- **Standardized Errors**: Consistent error response format

## 📊 Logging

The application includes structured logging with different levels:
- **Info**: General information
- **Warn**: Warning messages
- **Error**: Error messages
- **Debug**: Debug information (development only)
- **Security**: Security-related events
- **Audit**: User actions and system events

## 🚨 Error Handling

- Comprehensive error handling middleware
- Structured error responses
- Proper HTTP status codes
- Security-conscious error messages

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | MySQL database connection string | - | ✅ |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | - | ✅ |
| `JWT_EXPIRES_IN` | JWT token expiration time | `24h` | ❌ |
| `PORT` | Server port | `3000` | ❌ |
| `NODE_ENV` | Environment (development/production) | - | ✅ |
| `BCRYPT_ROUNDS` | bcrypt hashing rounds | `12` | ❌ |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `*` | ❌ |

## 🚀 Production Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Configure production database
   - Set strong JWT secret
   - Configure CORS origins

2. **Database Migration**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. **Start Application**
   ```bash
   npm start
   ```


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository.
