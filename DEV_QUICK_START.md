# Development Environment - Quick Reference

## Prerequisites Installed ✅

- Node.js v20.19.6
- npm 10.8.2
- Docker 28.0.4
- MongoDB 7 (via Docker)

## Quick Start Commands

### First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Start MongoDB
docker compose up -d mongodb

# 3. Configure backend environment
cd backend
cp .env.example .env
# JWT_SECRET is already configured with a secure random string
# Update AI_API_KEY with your actual API key

# 4. Test database connection
npm run test:db

# 5. Start development servers
cd ..
npm run dev
```

### Daily Development

```bash
# Start MongoDB (if not running)
docker compose up -d mongodb

# Start dev servers (frontend + backend)
npm run dev

# Access the application:
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
# Health check: http://localhost:3001/health
```

### Useful Commands

```bash
# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Test database connection
npm run test:db --workspace=backend

# Build for production
npm run build

# Run linters
npm run lint

# Run tests
npm run test

# Stop MongoDB
docker compose down

# View MongoDB logs
docker compose logs -f mongodb

# Clean and reinstall
npm run clean
npm install
```

## Environment Configuration

### Backend (.env)
Located in `backend/.env`:
- ✅ PORT=3001
- ✅ MONGODB_URI with authentication
- ✅ JWT_SECRET (auto-generated secure key)
- ⚠️ AI_API_KEY (update with your key)

### Frontend (.env)
Located in `frontend/.env`:
- ✅ VITE_API_URL=/api

## Services Status

Check if services are running:

```bash
# Check MongoDB
docker compose ps

# Check backend health
curl http://localhost:3001/health

# Check frontend
curl -I http://localhost:5173
```

## Troubleshooting

### MongoDB not accessible
```bash
docker compose up -d mongodb
docker compose ps
```

### Port already in use
```bash
# Change port in backend/.env or kill the process
lsof -ti:3001 | xargs kill -9
```

### Dependencies out of sync
```bash
npm run clean
npm install
```

## Next Steps

See [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) for detailed setup instructions and troubleshooting.

See [tasks.yml](./tasks.yml) for upcoming development tasks.
