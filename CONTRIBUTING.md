# Contributing

Thanks for helping improve the Resend CLI! This project helps developers interact with the Resend email API through both command-line and interactive terminal interfaces.

## Getting Started

1. Fork the repo and clone it locally
2. Follow the complete setup instructions in [DEVELOPMENT.md](./DEVELOPMENT.md)

The development guide covers:
- Prerequisites and installation
- Environment setup with `.env` files  
- Development commands and scripts
- Testing strategies
- Project architecture
- Local testing and debugging

## Code Style & Guidelines

This project follows strict coding guidelines documented in [CLAUDE.md](./CLAUDE.md). Key points:

### Testing Strategy
- **Co-located tests**: Place test files next to the code they test
- **Naming convention**: `file.ts` → `file.test.ts`
- Always test new functionality with comprehensive coverage

### Code Standards
- **No emojis**: Keep all text clean and professional
- **No console logs in TUI**: Use Ink components for all TUI output
- **No duplicate validations**: Trust context providers for API keys and global state
- **Consistent spacing**: Use `marginBottom` only, never `marginTop` in content components

### Module Structure
When adding new functionality, follow the established patterns:

```
src/modules/feature/
├── action.ts          # API integration
├── action.test.ts     # Action tests
├── schema.ts          # Zod validation schemas
├── schema.test.ts     # Schema tests
├── fields.ts          # CLI and form field definitions
├── fields.test.ts     # Field configuration tests
├── cli.ts             # Commander.js CLI integration
├── Form.tsx           # React/Ink TUI component
└── index.ts           # Module exports
```

## Making Changes

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Follow the development cycle** (see [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed commands):
   - Make your changes following the established patterns
   - Run linting and formatting
   - Build and test your changes
   - Verify functionality with both CLI and TUI

3. **Test thoroughly**:
   - Add tests for new functionality
   - Test both CLI and TUI interfaces
   - Use `--dry-run` mode for testing without API calls
   - Verify error handling and edge cases

4. **Update documentation** if needed:
   - Update README.md for new features
   - Add examples to help text
   - Update this CONTRIBUTING.md if you change workflows

## Commit Style

This project uses [Conventional Commits](https://www.conventionalcommits.org/) with automatic enforcement. 

For detailed commit conventions, types, and examples, see the [DEVELOPMENT.md - Contributing section](./DEVELOPMENT.md#-contributing).

## Pull Request Process

1. **Ensure your PR**:
   - Has a clear title and description
   - Includes tests for new functionality
   - Passes all existing tests
   - Follows the established code patterns
   - Updates documentation as needed

2. **PR will be automatically checked for**:
   - TypeScript compilation
   - Test coverage
   - Code formatting (Biome)
   - Conventional commit format

3. **Review process**:
   - Maintainers will review for code quality
   - Functionality testing with actual Resend API
   - Documentation completeness
   - Adherence to project guidelines

## Development Tasks

For detailed development instructions including:
- Adding new API endpoints
- Project structure and patterns  
- Debugging techniques
- Testing strategies
- Local testing setup

See [DEVELOPMENT.md](./DEVELOPMENT.md)

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/letanure/resend-cli/issues)
- **Documentation**: Check the [README.md](./README.md) and [CLAUDE.md](./CLAUDE.md)
- **Code Examples**: Look at existing modules in `src/modules/` for patterns

## Resources

- [Resend API Documentation](https://resend.com/docs)
- [Commander.js Documentation](https://github.com/tj/commander.js)
- [Ink Documentation](https://github.com/vadimdemedes/ink)
- [Vitest Testing Framework](https://vitest.dev)
- [Zod Validation](https://zod.dev)
