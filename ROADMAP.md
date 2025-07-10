# Roadmap

This roadmap outlines the planned features and improvements for the Resend CLI. Items are organized by development phases and may change based on community feedback and project priorities.

> **Note**: This is an unofficial CLI tool built on top of the Resend Node.js SDK and is not affiliated with Resend.

## ✅ Completed Features

### Core Email Operations

- [x] Email sending functionality
- [x] Email retrieval functionality
- [x] Email cancellation (cancel scheduled emails)
- [x] Email updates (modify scheduled emails)
- [x] Dry-run mode for all operations
- [x] JSON and text output formats
- [x] Interactive TUI interface
- [x] Comprehensive error handling
- [x] Environment variable configuration

### Domain Management

- [x] Domain creation and setup
- [x] Domain listing and status
- [x] Domain retrieval with DNS records
- [x] Domain verification ✨ _Recently added_

### API Key Management

- [x] API key creation and listing
- [x] API key deletion
- [x] Dry-run support for all operations

### Contact & Audience Management

- [x] Contact creation and management
- [x] Contact retrieval and deletion
- [x] Contact listing with audience filtering
- [x] Audience creation and management
- [x] Audience listing and deletion
- [x] Audience retrieval

## 🚧 Next Phase - UX Improvements (High Priority)

### Navigation & User Experience

- [ ] **Show only relevant navigation tips in footer** (context-aware help)
- [ ] **Fix back navigation from lists** (currently stuck in loading state)
- [ ] Enhanced TUI with better state management

### Component Enhancements

- [ ] **File selector component** (for attachments and imports)
- [ ] **Domain ID selector component** (based on user's domain list)
- [ ] **API key name validation** (show warnings for repeated names)

## 📋 Planned Features

### Batch Operations

- [ ] **Batch email sending based on JSON input** (send multiple emails at once)
- [ ] Contact import/export (CSV, JSON)
- [ ] Bulk contact operations

### List Enhancements

- [ ] **Add actions to all lists** (delete/update directly from list views)
- [ ] Search and filtering capabilities
- [ ] Pagination for large datasets

## 🔮 Future Features

### Advanced Email Features

- [ ] Email templates and reusable content
- [ ] Email scheduling with cron-like syntax
- [ ] Webhook management and testing
- [ ] Analytics and reporting
- [ ] Email status tracking and events

### Developer Experience

- [ ] Shell completion (bash, zsh, fish)
- [ ] Configuration file support (.resendrc)
- [ ] Better error messages and suggestions
- [ ] Plugin system for extensions
- [ ] CI/CD integration examples

### Technical Improvements

- [ ] Performance optimizations for large datasets
- [ ] Multi-account support
- [ ] DKIM configuration management

## Ideas Under Consideration

These features are being considered but not yet committed to the roadmap:

- [ ] email send tag
- [ ] email send header
- [ ] component select date
- [x] component select audience ID
- [ ] component select domain ID
- [x] component select broadcast ID
- [ ] lists with actions
- [ ] file selector for react component, validated
- [ ] validate html field
- [ ] email batch loading json, validated
- [ ] Email html view in browser
- [ ] refactor tests, focus e2e ?
- [ ] lint dead code
- [ ] upgrade zod 4

## Community Requests

Have an idea or feature request? Please:

1. Check existing [GitHub Issues](https://github.com/anthropics/claude-code/issues)
2. Create a new issue with the `enhancement` label
3. Join discussions in existing feature requests

## Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

---

**Legend:**

- ✅ Completed
- 🚧 In Progress
- 📋 Planned
- 💡 Under Consideration
