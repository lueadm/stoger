# Contributing to Stoger

Thank you for your interest in contributing to Stoger! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and considerate in all interactions. We aim to foster an inclusive and welcoming community.

## How to Contribute

### Reporting Bugs

Before creating a bug report:
- Check existing issues to avoid duplicates
- Include detailed steps to reproduce the issue
- Provide your environment details (OS, Node version, etc.)

### Suggesting Features

We welcome feature suggestions! Please:
- Check if the feature has already been suggested
- Clearly describe the feature and its benefits
- Explain how it aligns with the project goals

### Pull Requests

1. **Fork the repository** and create a new branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards
   - Write clear, concise commit messages
   - Add tests for new features
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Submit a pull request**
   - Describe what changes you made and why
   - Reference any related issues
   - Ensure all CI checks pass

## Development Setup

See the README.md for detailed setup instructions.

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Enable strict mode
- Add type definitions for all functions

### Code Style
- Run ESLint before committing: `npm run lint`
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic

### Git Commits
- Use present tense ("Add feature" not "Added feature")
- Keep first line under 72 characters
- Reference issues and PRs when relevant

### Testing
- Write tests for new features
- Ensure existing tests pass
- Aim for good test coverage

## Project Structure

```
stoger/
├── frontend/        # React frontend
├── backend/         # Express backend
├── tasks.yml        # Project task definitions
└── .github/         # GitHub Actions workflows
```

## Questions?

Feel free to open an issue for any questions or clarifications needed.

Thank you for contributing to Stoger!
