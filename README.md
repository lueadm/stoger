# Stoger - AI Story Generator

An AI-powered full-stack application for generating and collaboratively editing stories. Users can input a story summary, and the AI generates a complete story with title, chapters, and content. Stories can be reviewed, edited, and published for others to read.

## Features

- **AI Story Generation**: Input a summary and let AI generate title, chapters, and content
- **Collaborative Editing**: Review and manually edit each chapter
- **AI Regeneration**: Ask AI to update specific chapters based on feedback
- **Story Publishing**: Publish stories for other users to discover and read
- **User Authentication**: Secure user registration and login system
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Zustand** for state management
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose for data persistence
- **JWT** for authentication
- **AI Integration** (OpenAI/Anthropic) for story generation

## Project Structure

```
stoger/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── styles/         # CSS styles
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── backend/                 # Express backend API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── models/         # Database models
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Express middleware
│   │   └── services/       # External services
│   └── package.json
├── tasks.yml               # Project tasks for production readiness
└── .github/
    └── workflows/
        └── generate-issues.yml  # GitHub Action for issue generation

```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- AI API key (OpenAI or Anthropic)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lueadm/stoger.git
   cd stoger
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up backend environment**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

   Required environment variables:
   - `PORT`: Backend server port (default: 3001)
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `AI_API_KEY`: Your AI service API key
   - `AI_MODEL`: AI model to use (e.g., gpt-4)

4. **Set up frontend environment (optional)**
   ```bash
   cd frontend
   # Create .env if needed for custom API URL
   echo "VITE_API_URL=http://localhost:3001/api" > .env
   ```

### Development

Run both frontend and backend in development mode:

```bash
# From root directory
npm run dev
```

Or run them separately:

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3001`.

### Building for Production

```bash
# Build both frontend and backend
npm run build

# Build separately
npm run build:backend
npm run build:frontend
```

## Task Management

This project includes a comprehensive task list in `tasks.yml` that outlines all the work needed to build a production-ready application.

### Generating GitHub Issues from Tasks

You can automatically create GitHub issues from the tasks defined in `tasks.yml`:

1. Go to **Actions** tab in your GitHub repository
2. Select **Generate Issues from Tasks** workflow
3. Click **Run workflow**
4. Choose options:
   - **Dry run**: Set to `true` to preview issues without creating them
   - Set to `false` to actually create the issues

The workflow will:
- Parse `tasks.yml` and create an issue for each task
- Apply appropriate labels and priority
- Skip tasks that already have issues created
- Provide a summary of created/skipped issues

### Task Categories

The tasks are organized by:
- **Setup & Infrastructure**: Environment setup, database, deployment
- **Backend Development**: API endpoints, authentication, AI integration
- **Frontend Development**: UI components, pages, state management
- **Quality & Testing**: Testing, validation, error handling
- **DevOps**: CI/CD, monitoring, logging
- **Security**: Authentication, authorization, rate limiting
- **Documentation**: README, API docs, guides

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Stories
- `POST /api/stories/generate` - Generate story from summary
- `GET /api/stories` - Get all published stories
- `GET /api/stories/:id` - Get specific story
- `PUT /api/stories/:id/chapters/:chapterId` - Update chapter
- `POST /api/stories/:id/chapters/:chapterId/regenerate` - Regenerate chapter with AI
- `POST /api/stories/:id/publish` - Publish story

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Roadmap

See `tasks.yml` for the complete list of planned features and improvements. Key upcoming features include:

- [ ] Advanced AI story generation with style consistency
- [ ] User collaboration on stories
- [ ] Story version history
- [ ] Advanced search and filtering
- [ ] Admin dashboard
- [ ] Mobile app

## Support

For issues and questions, please open an issue in the GitHub repository.
