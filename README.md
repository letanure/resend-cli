# @letanure/resend-cli

A TypeScript CLI wrapper for the Resend API.

## Quick Start

```bash
# Run without installing
npx @letanure/resend-cli
```

## Installation

```bash
npm install -g @letanure/resend-cli
```

## Setup (Development)

```bash
npm install
```

## Development

```bash
# Run with watch mode (auto-reload on changes)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Build with watch mode
npm run build:watch

# Run compiled version
npm start
```

### Testing

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Type checking
npm run typecheck

# Linting and formatting
npm run lint
npm run format
```

## Project Structure

```
src/
├── cli.tsx        # CLI entry point
├── app.tsx        # Main Ink component
├── app.test.tsx   # Tests for app component
└── commands/      # Future CLI commands (with co-located tests)

dist/              # Compiled output (generated)
```

## Local Testing

```bash
# Link CLI globally for testing
npm link

# Use the CLI
resend-cli
```

## Publishing

Publishing is fully automated! When you push to the `main` branch, semantic-release will:

1. Analyze commit messages since last release
2. Determine version bump:
   - `fix:` commits = patch release (0.0.X)
   - `feat:` commits = minor release (0.X.0)
   - `BREAKING CHANGE:` = major release (X.0.0)
3. Update package.json version
4. Generate/update CHANGELOG.md
5. Create git tag and GitHub release
6. Publish to npm

**No manual steps required!** Just push your commits to main and the release happens automatically.

## Contributing

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint.

### Commit Format

```
type(scope?): subject
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`, `revert`

Examples:
```bash
git commit -m "feat: add email sending functionality"
git commit -m "fix(api): handle rate limit errors"
git commit -m "docs: update installation instructions"
```
