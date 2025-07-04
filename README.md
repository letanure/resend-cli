# Resend CLI

A TypeScript CLI wrapper for the Resend API.

## Setup

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
