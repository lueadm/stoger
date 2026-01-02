# Quick Start Guide

This guide will help you get Stoger up and running quickly.

## Option 1: Docker (Recommended for Production)

The easiest way to run Stoger is using Docker Compose:

```bash
# 1. Clone the repository
git clone https://github.com/lueadm/stoger.git
cd stoger

# 2. Set your AI API key (required for story generation)
export AI_API_KEY=your-api-key-here

# 3. Deploy with Docker
./deploy.sh docker
```

The application will be available at `http://localhost:3001`

## Option 2: Local Development

For development or if you prefer not to use Docker:

### Prerequisites

- Node.js 20+
- MongoDB (running locally or MongoDB Atlas)
- AI API key (OpenAI or Anthropic)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/lueadm/stoger.git
cd stoger

# 2. Install dependencies
npm install

# 3. Configure backend environment
cd backend
cp .env.example .env
# Edit .env with your settings:
#   - MONGODB_URI (your MongoDB connection string)
#   - JWT_SECRET (random secure string)
#   - AI_API_KEY (your AI service API key)

# 4. Start MongoDB (if running locally)
# mongod

# 5. Start the application
cd ..
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## Next Steps

### Create Your First Story

1. Open `http://localhost:5173` in your browser
2. Click "Start Creating"
3. Enter a story summary (e.g., "A young wizard discovers a magical book")
4. Click "Generate Story"
5. Review and edit the generated chapters
6. Publish your story!

### Configure AI Service

Stoger supports multiple AI providers:

#### OpenAI
```env
AI_API_KEY=sk-...
AI_MODEL=gpt-4
```

#### Anthropic
```env
AI_API_KEY=sk-ant-...
AI_MODEL=claude-3-sonnet-20240229
```

### Production Deployment

For production deployment, see:
- [Vercel Deployment Guide](docs/deploy-vercel.md) (coming soon)
- [AWS Deployment Guide](docs/deploy-aws.md) (coming soon)
- [Railway Deployment Guide](docs/deploy-railway.md) (coming soon)

## Troubleshooting

### MongoDB Connection Issues

If you get MongoDB connection errors:
- Ensure MongoDB is running: `mongod`
- Check your connection string in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Frontend Can't Connect to Backend

If the frontend can't reach the API:
- Check that the backend is running on port 3001
- Verify CORS settings in `backend/src/index.ts`
- Check proxy settings in `frontend/vite.config.ts`

### AI Generation Fails

If story generation doesn't work:
- Verify your AI API key is correct
- Check API rate limits
- Review backend logs for detailed error messages

## Getting Help

- [Full Documentation](README.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Open an Issue](https://github.com/lueadm/stoger/issues)

## Task Management

To automatically create GitHub issues from the task list:

1. Go to the **Actions** tab in GitHub
2. Select "Generate Issues from Tasks"
3. Click "Run workflow"
4. Choose dry run mode to preview (optional)
5. Run to create all project tasks as issues

This will create 25 organized issues covering all aspects of building a production-ready application.
