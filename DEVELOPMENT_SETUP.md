# Development Environment Setup Guide

This guide provides step-by-step instructions for setting up the Stoger development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** (Recommended: Node.js 20.x)
- **npm** (comes with Node.js)
- **Docker** and **Docker Compose** (for MongoDB)
- **Git**

### Verify Prerequisites

```bash
node --version   # Should show v18.x or higher
npm --version    # Should show v9.x or higher
docker --version # Should show Docker version
git --version    # Should show Git version
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/lueadm/stoger.git
cd stoger
```

### 2. Install Dependencies

Install all dependencies for the root project, frontend, and backend:

```bash
npm install
```

This command will install:
- Root dependencies (concurrently for running multiple processes)
- Backend dependencies (Express, MongoDB, TypeScript, etc.)
- Frontend dependencies (React, Vite, TypeScript, etc.)

### 3. Set Up MongoDB

#### Option A: Using Docker (Recommended)

Start MongoDB using Docker Compose:

```bash
docker compose up -d mongodb
```

This will:
- Pull the MongoDB 7 image
- Create a MongoDB container named `stoger-mongodb`
- Expose MongoDB on port 27017
- Create a persistent volume for data
- Set up admin credentials (username: admin, password: password)

Verify MongoDB is running:

```bash
docker compose ps
```

#### Option B: Using Local MongoDB Installation

If you prefer to use a local MongoDB installation:

1. Install MongoDB following the [official guide](https://www.mongodb.com/docs/manual/installation/)
2. Start MongoDB service
3. Update the `MONGODB_URI` in `backend/.env` to use `mongodb://localhost:27017/stoger`

### 4. Configure Backend Environment

Create the backend environment file:

```bash
cd backend
cp .env.example .env
```

The `.env` file has been configured with:
- **PORT**: 3001 (backend server port)
- **NODE_ENV**: development
- **MONGODB_URI**: mongodb://admin:password@localhost:27017/stoger?authSource=admin
- **JWT_SECRET**: Auto-generated secure random string
- **JWT_EXPIRES_IN**: 7d
- **AI_API_KEY**: your-ai-api-key (update with your actual key)
- **AI_MODEL**: gpt-4
- **CORS_ORIGIN**: http://localhost:5173

**Important**: Update the `AI_API_KEY` with your actual OpenAI or Anthropic API key for story generation features.

### 5. Configure Frontend Environment

Create the frontend environment file:

```bash
cd ../frontend
cp .env.example .env
```

The default configuration uses `/api` which proxies to the backend during development.

### 6. Test Database Connection

Verify the database connection is working:

```bash
cd backend
npm run test:db
```

You should see output confirming:
- ✅ MongoDB connected successfully
- ✅ Write operation successful
- ✅ Read operation successful
- ✅ Delete operation successful
- Connection details (host, database name)

### 7. Start the Development Servers

#### Option A: Run Both Frontend and Backend Together

From the root directory:

```bash
npm run dev
```

This will start:
- Backend API server on http://localhost:3001
- Frontend development server on http://localhost:5173

#### Option B: Run Frontend and Backend Separately

In separate terminal windows:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

### 8. Verify Everything is Working

1. **Backend Health Check**:
   ```bash
   curl http://localhost:3001/health
   ```
   Expected output: `{"status":"ok","timestamp":"..."}`

2. **Frontend**: Open http://localhost:5173 in your browser

3. **Database**: Verify MongoDB is accessible:
   ```bash
   docker exec -it stoger-mongodb mongosh -u admin -p password --authenticationDatabase admin
   ```

## Common Tasks

### Stopping Services

```bash
# Stop development servers: Ctrl+C in the terminal

# Stop MongoDB container:
docker compose down

# Stop MongoDB and remove volumes (⚠️ deletes all data):
docker compose down -v
```

### Rebuilding

```bash
# Clean all dependencies and builds:
npm run clean

# Reinstall everything:
npm install

# Build for production:
npm run build
```

### Running Tests

```bash
# Run all tests:
npm test

# Run backend tests only:
npm run test --workspace=backend

# Run frontend tests only:
npm run test --workspace=frontend
```

### Linting

```bash
# Lint all code:
npm run lint

# Lint backend only:
npm run lint --workspace=backend

# Lint frontend only:
npm run lint --workspace=frontend
```

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| PORT | Backend server port | 3001 | No |
| NODE_ENV | Environment mode | development | No |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/stoger | Yes |
| JWT_SECRET | Secret key for JWT tokens | (generated) | Yes |
| JWT_EXPIRES_IN | JWT token expiration | 7d | No |
| AI_API_KEY | OpenAI/Anthropic API key | - | Yes* |
| AI_MODEL | AI model to use | gpt-4 | No |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 | No |

*Required for AI story generation features

### Frontend (.env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| VITE_API_URL | Backend API URL | /api | No |

## Troubleshooting

### MongoDB Connection Issues

**Problem**: `MongoServerError: Command requires authentication`

**Solution**: Ensure your `MONGODB_URI` includes credentials:
```
MONGODB_URI=mongodb://admin:password@localhost:27017/stoger?authSource=admin
```

**Problem**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**: Verify MongoDB is running:
```bash
docker compose ps
# If not running:
docker compose up -d mongodb
```

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3001`

**Solution**: Stop any process using the port or change the port in `.env`:
```bash
# Find and kill the process:
lsof -ti:3001 | xargs kill -9

# Or change the port:
echo "PORT=3002" >> backend/.env
```

### AI API Key Issues

**Problem**: Story generation fails

**Solution**: 
1. Verify your API key is correct in `backend/.env`
2. Check API key has sufficient credits/quota
3. Verify the AI model name is correct

### Frontend Can't Connect to Backend

**Problem**: Network errors in browser console

**Solution**:
1. Ensure backend is running on port 3001
2. Check CORS settings in `backend/src/index.ts`
3. Verify `VITE_API_URL` in `frontend/.env`

## Next Steps

Now that your development environment is set up:

1. Review the [README.md](../README.md) for project overview
2. Check [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines
3. See [tasks.yml](../tasks.yml) for planned features and tasks
4. Start developing! The main tasks are:
   - Implement user authentication (Task #2)
   - Set up database models (Task #3)
   - Create AI story generation service (Task #4)
   - Build frontend components (Tasks #7-10)

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

## Support

If you encounter issues:
1. Check this troubleshooting section
2. Review existing GitHub issues
3. Create a new issue with:
   - Your OS and Node.js version
   - Complete error message
   - Steps to reproduce

---

**Last Updated**: 2026-01-02
**Environment Tested**: Node.js v20.19.6, npm 10.8.2, Docker 28.0.4
