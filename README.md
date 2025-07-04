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

## Project Structure

```
src/
├── cli.tsx    # CLI entry point
└── app.tsx    # Main Ink component

dist/          # Compiled output (generated)
```

## Local Testing

```bash
# Link CLI globally for testing
npm link

# Use the CLI
resend-cli
```

## Publishing

To publish a new release:

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Commit changes: `git commit -m "chore: release v0.x.x"`
4. Create tag: `git tag -a v0.x.x -m "Release version 0.x.x"`
5. Push with tag: `git push origin main --tags`

The GitHub Action will automatically:
- Create a GitHub release
- Publish to npm (requires NPM_TOKEN secret)

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
