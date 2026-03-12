# Contributing to Mermaid Render

Thank you for your interest in contributing to Mermaid Render! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js 20 or higher
- npm
- Git

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/mermaid-render.git
   cd mermaid-render
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

- `feature/your-feature-name` - for new features
- `fix/your-bug-fix` - for bug fixes
- `docs/your-docs-update` - for documentation updates

### Code Style

This project uses:

- **TypeScript** with 4-space indentation
- **ESLint** for code linting
- **Prettier** for code formatting

Before submitting a PR, ensure:

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Run type checking
npm run type-check

# Format code
npm run format
```

### Commit Messages

Follow conventional commit format:

- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `style: formatting changes`
- `refactor: code restructuring`
- `test: add tests`
- `chore: maintenance tasks`

### Pull Request Process

1. Create a feature branch from `master`
2. Make your changes
3. Ensure all checks pass:
   - `npm run lint`
   - `npm run type-check`
   - `npm run build`
4. Push to your fork
5. Open a Pull Request

### PR Requirements

- Clear description of changes
- Reference to any related issues
- All CI checks passing
- No decrease in code coverage

## Project Structure

```
mermaid-render/
├── src/
│   ├── components/     # UI components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── styles/         # CSS styles
│   └── App.tsx         # Main application
├── public/             # Static assets
└── .github/workflows/  # CI/CD configuration
```

## Adding New Features

### Components

1. Create a new directory in `src/components/`
2. Export component from `index.tsx`
3. Add styles in the same directory or in `src/styles/`

### Hooks

1. Create a new file in `src/hooks/`
2. Follow the naming convention `useFeatureName.ts`
3. Export from the file

## Testing

Currently, this project does not have automated tests. When adding tests:

1. Place test files next to the source files
2. Use `.test.ts` or `.spec.ts` extension

## Questions?

Feel free to open an issue for any questions or discussions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
