# Development Guide

This document contains development setup, architecture details, and contributing guidelines for the Resend CLI.

## 🛠️ Setup (Development)

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Clone and Install
```bash
git clone <repository-url>
cd resend-cli
npm install
```

### Environment Setup
```bash
# Copy example environment file
cp .env.example .env

# Add your Resend API key for testing
echo "RESEND_API_KEY=re_your_test_key_here" >> .env
```

## 🚀 Development Commands

```bash
# Run with watch mode (auto-reload on changes)
npm run dev

# Run in dry-run mode with watch mode
npm run dev:dry

# Build TypeScript to JavaScript
npm run build

# Build with watch mode
npm run build:watch

# Run compiled version
npm start

# Clean build artifacts
npm run clean
```

## 🧪 Testing

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
npm run lint:fix
npm run format
```

## 📁 Project Structure

```
src/
├── cli.ts                 # CLI entry point
├── types/                 # TypeScript type definitions
│   └── index.ts
├── utils/                 # Shared utilities
│   ├── cli.ts            # CLI helper functions
│   ├── cli-help.ts       # Custom help formatting
│   ├── error-formatting.ts # Consistent error display
│   ├── output.ts         # Output formatting (text/JSON)
│   └── resendErrors.ts   # Resend API error handling
├── modules/               # Feature modules
│   └── emails/           # Email-related functionality
│       ├── cli.ts        # Email CLI commands
│       └── send/         # Send email feature
│           ├── fields.ts # Field definitions
│           ├── schema.ts # Validation schemas
│           └── action.ts # Send logic
└── contexts/             # React contexts (if using Ink)

dist/                     # Compiled output (generated)
scripts/                  # Development scripts
├── generate-docs.js      # Auto-generate documentation
tests/                    # Test files (co-located preferred)
```

## 🏗️ Architecture

### Module-Based Architecture
The CLI uses a modular architecture where each feature is contained in its own module:

- **Self-contained**: Each module has its own CLI commands, validation, and logic
- **Co-located tests**: Tests live next to the code they test
- **Shared utilities**: Common functionality in `/utils`
- **Type safety**: Strong TypeScript typing throughout

### CLI Framework
- **Commander.js**: Command-line argument parsing
- **Zod**: Runtime type validation and schema definitions
- **Chalk**: Terminal colors and formatting
- **Ink**: React-like components for complex UIs (optional)

### Error Handling
- **Consistent formatting**: All errors use the same visual style
- **Exit codes**: Proper exit codes for automation
- **JSON output**: Machine-readable error format for CI/CD
- **User-friendly**: Clear messages with actionable suggestions

### Output Formats
- **Text mode**: Human-readable with colors and formatting
- **JSON mode**: Machine-readable for automation (`--output json`)
- **Consistent structure**: Same data in both formats

## 🔧 Local Testing

### Link CLI Globally
```bash
# Link for global testing
npm link

# Use the linked CLI
resend-cli --help

# Test specific commands
resend-cli email send --help

# Unlink when done
npm unlink -g
```

### Test with Different Node Versions
```bash
# Using nvm
nvm use 18
npm test

nvm use 20  
npm test
```

### Integration Testing
```bash
# Test actual CLI execution
npm run build
node dist/src/cli.js --help

# Test with environment variables
RESEND_API_KEY="test_key" node dist/src/cli.js email send --help
```

## 📖 Documentation

### Auto-Generated Documentation

The README.md is completely generated from a template to ensure it always stays in sync with the actual CLI:

**Template-based System:**
- **Template**: `templates/README.template.md` - The markdown template with placeholders
- **Generator**: `scripts/generate-docs.js` - Extracts real CLI help and generates README
- **Output**: `README.md` - Complete documentation generated fresh each time

**Generate Documentation:**
```bash
# Generate fresh README from template + CLI help
npm run docs:generate

# Or run the script directly
node scripts/generate-docs.js
```

**How it works:**
1. Builds the CLI to ensure it's up to date
2. Runs CLI commands to extract help output (`--help`, `email --help`, etc.)
3. Parses help to create complete CLI reference 
4. Reads the template file (`templates/README.template.md`)
5. Replaces placeholders like `{{CLI_HELP_MAIN}}` with real content
6. Writes the complete new README.md

**Available Placeholders:**
- `{{CLI_HELP_MAIN}}` - Main CLI help output
- `{{CLI_HELP_EMAIL}}` - Email module help
- `{{CLI_HELP_EMAIL_SEND}}` - Email send command help
- `{{CLI_EXAMPLES}}` - Usage examples
- `{{CLI_REFERENCE}}` - Complete CLI reference with all arguments
- `{{GENERATED_DATE}}` - Current date

### Git Hooks (Automatic Documentation)
Pre-commit hooks automatically regenerate documentation:

- **Pre-commit**: Runs `npm run docs:generate` before each commit
- **Auto-add**: Adds updated README.md to the commit
- **Always in sync**: Documentation can never get stale

**Setup is already done** - hooks are configured in `.husky/pre-commit`

## 🚀 Publishing

Publishing is fully automated using semantic-release! When you push to the `main` branch:

1. **Analyze commits**: Uses conventional commit messages since last release
2. **Determine version bump**:
   - `fix:` commits = patch release (0.0.X)
   - `feat:` commits = minor release (0.X.0)  
   - `BREAKING CHANGE:` = major release (X.0.0)
3. **Update package.json** version
4. **Generate/update CHANGELOG.md**
5. **Create git tag** and GitHub release
6. **Publish to npm**

**No manual steps required!** Just push your commits to main.

### Manual Publishing (Emergency)
```bash
# Build first
npm run build

# Check what would be published
npm publish --dry-run

# Publish (if you have npm permissions)
npm publish
```

## 🤝 Contributing

### Commit Convention
This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint.

#### Commit Format
```
type(scope?): subject
```

#### Types
- `feat`: New feature
- `fix`: Bug fix  
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `build`: Build system changes
- `ci`: CI/CD changes
- `revert`: Reverting changes

#### Examples
```bash
git commit -m "feat: add email sending functionality"
git commit -m "fix(api): handle rate limit errors" 
git commit -m "docs: update installation instructions"
git commit -m "test(email): add validation tests"
```

### Pull Request Process
1. **Fork** the repository
2. **Create** a feature branch from `main`
3. **Make** your changes with tests
4. **Update** documentation if needed
5. **Follow** commit conventions
6. **Submit** pull request

### Code Style
- **TypeScript**: Strong typing required
- **ESLint + Prettier**: Automated formatting
- **Co-located tests**: Tests next to source files  
- **Descriptive names**: Clear function and variable names
- **Comments**: Document complex logic
- **Error handling**: Comprehensive error cases

### Testing Guidelines
- **Unit tests**: Test individual functions
- **Integration tests**: Test CLI commands end-to-end
- **Co-location**: `file.ts` → `file.test.ts`
- **Coverage**: Aim for high test coverage
- **Mock external calls**: Don't hit real APIs in tests

## 🔍 Debugging

### Debug Mode
```bash
# Enable debug output
DEBUG=resend-cli* npm run dev

# Debug specific modules
DEBUG=resend-cli:email npm run dev
```

### VS Code Setup
Add to `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch", 
      "name": "Debug CLI",
      "program": "${workspaceFolder}/dist/src/cli.js",
      "args": ["email", "send", "--help"],
      "console": "integratedTerminal",
      "env": {
        "RESEND_API_KEY": "re_test_key_here"
      }
    }
  ]
}
```

### Common Issues

**Path alias not working:**
```bash
# Clean rebuild
rm -rf dist && npm run build
```

**TypeScript errors:**
```bash
# Check types without building
npm run typecheck
```

**Import issues:**
```bash
# Verify all imports after build
npm run build && node dist/src/cli.js --help
```

## 📚 Resources

- [Commander.js Documentation](https://github.com/tj/commander.js)
- [Zod Documentation](https://zod.dev/)
- [Chalk Documentation](https://github.com/chalk/chalk)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Release](https://semantic-release.gitbook.io/semantic-release/)
- [Resend API Documentation](https://resend.com/docs)

## 📞 Support

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Contributing**: See this development guide