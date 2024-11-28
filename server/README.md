# TypeScript Stack Lab - Server

This is the server-side application for TypeScript Stack Lab, built with Express.js, Prisma, and TypeScript.

## Prerequisites

- Node.js (v18 or later)
- pnpm
- Docker and Docker Compose
- MySQL 8.0 (via Docker)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set up Environment Variables

Create a `.env` file in the server directory with the following content:

```env
DATABASE_URL="mysql://root:test@localhost:3306/app"
```

### 3. Start the Database

```bash
# From the root directory
docker-compose up -d
```

### 4. Database Setup

```bash
# Generate Prisma Client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev
```

### 5. Start the Development Server

```bash
pnpm dev
```

The server will start at http://localhost:3000.

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
  ```json
  {
    "email": "user@example.com",
    "name": "User Name",
    "password": "password123"
  }
  ```
- `PUT /api/users/:id` - Update a user
  ```json
  {
    "email": "updated@example.com",
    "name": "Updated Name"
  }
  ```
- `DELETE /api/users/:id` - Delete a user

## Development

### Database Migrations

When you make changes to the Prisma schema (`prisma/schema.prisma`), you need to create and apply migrations:

```bash
# Create and apply a new migration
pnpm prisma migrate dev --name <migration_name>

# Apply existing migrations (in production)
pnpm prisma migrate deploy
```

### Available Scripts

- `pnpm dev` - Start the development server with hot-reloading
- `pnpm build` - Build the TypeScript code
- `pnpm start` - Start the production server
- `pnpm prisma studio` - Open Prisma Studio to manage database data

## Project Structure

```
server/
├── prisma/
│   ├── migrations/    # Database migrations
│   └── schema.prisma  # Database schema
├── src/
│   ├── controllers/   # Request handlers
│   ├── routes/        # API routes
│   ├── app.ts         # Express application setup
│   └── server.ts      # Server entry point
├── .env               # Environment variables
└── package.json       # Project dependencies and scripts
```

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error
