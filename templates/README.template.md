# Resend CLI

A command-line interface for the [Resend](https://resend.com) email API. Send emails, manage domains, and more via CLI commands or an interactive TUI.

> **Disclaimer**: This is an **unofficial** CLI tool built on top of the [Resend Node.js SDK](https://github.com/resendlabs/resend-node). It is not affiliated with or endorsed by Resend.

> **Warning**: Currently in active development. Some features may be incomplete or subject to change.

## TLDR

Get your API key at [resend.com/api-keys](https://resend.com/api-keys), export it, and run:

**CLI Mode:**
```bash
export RESEND_API_KEY="re_your_api_key_here"
npx @letanure/resend-cli email send \
  --from="Acme <onboarding@resend.dev>" \
  --to="delivered@resend.dev" \
  --subject="Hello from CLI" \
  --text="This email was sent from the command line!"
```

**TUI Mode:**
```bash
npx @letanure/resend-cli
```

## Requirements

Node.js 18+ and a Resend API key

## Get Your API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to [API Keys](https://resend.com/api-keys) 
3. Create a new API key
4. Copy the key (starts with `re_`)


## Table of Contents

- [Requirements](#requirements)
- [Get Your API Key](#get-your-api-key)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Commands](#commands)
- [TUI Mode](#tui-mode)
- [Output Formats](#output-formats)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [License](#license)
- [Contributing](#contributing)

## Installation

**Recommended:** Use with npx (no installation required)
```bash
npx @letanure/resend-cli --help
```

**For frequent use:** Install globally
```bash
npm install -g @letanure/resend-cli
resend-cli --help
```

**In projects:** Install locally
```bash
npm install @letanure/resend-cli
npx resend-cli --help
```

## Configuration

### Environment Variables

The CLI requires your Resend API key to be available as an environment variable.

#### Setup Methods

**Temporary (current session only):**
```bash
export RESEND_API_KEY="re_xxxxxxxxxxxx"
```

**Permanent (recommended):**
```bash
# Add to your shell profile
echo 'export RESEND_API_KEY="re_xxxxxxxxxxxx"' >> ~/.bashrc
source ~/.bashrc

# Or for zsh users
echo 'export RESEND_API_KEY="re_xxxxxxxxxxxx"' >> ~/.zshrc
source ~/.zshrc
```

**One-time usage:**
```bash
RESEND_API_KEY="re_xxxxxxxxxxxx" resend-cli email send --from="..." --to="..."
```

#### Getting Your API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to [API Keys](https://resend.com/api-keys)
3. Create a new API key
4. Copy the key (starts with `re_`)

## Usage

{{CLI_HELP_MAIN}}

## Commands

{{CLI_COMMANDS}}

## TUI Mode

Launch the interactive interface for a guided experience:

```bash
$ resend-cli
```

**Features:**
- Interactive navigation with arrow keys and Enter
- Form-based input with validation
- Module organization by functionality
- Rich display with colors and layout

**Available Modules:**
- Email Operations - Send, retrieve, update, cancel emails
- Domain Management - List and manage domains
- Audience Management - Create, list, retrieve, delete audiences
- API Key Management - Create, list, delete API keys
- Contact Management - Create, list, update, delete contacts
- Broadcast Operations - List and manage broadcasts

**Navigation:**
- Arrow Keys / Enter: Navigate and select options
- Escape: Go back | Ctrl+C: Exit

**Dry-Run Mode:**
Both CLI and TUI modes support dry-run validation without sending:
- CLI: Add `--dry-run` flag to any command
- TUI: Start with `npx @letanure/resend-cli --dry-run`
- Warning banner appears when dry-run mode is active

## Output Formats

The CLI supports both human-readable and machine-readable output:

**Default (Human-readable):**
Rich formatted output with colors and layout

**JSON Output (for automation):**
Add `--output json` flag to any command for structured data:
```bash
$ resend-cli email send --output json --from="..." --to="..." --subject="..." --text="..."
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "to": "delivered@resend.dev",
    "from": "Acme <onboarding@resend.dev>",
    "subject": "Hello"
  }
}
```

## CI/CD Integration

Perfect for automated workflows:

```bash
# Extract email ID for further processing
EMAIL_ID=$(resend-cli email send --output json \
  --from="Acme <onboarding@resend.dev>" \
  --to="delivered@resend.dev" \
  --subject="Welcome to our app" \
  --html="<h1>Welcome!</h1>" | jq -r '.data.id')

echo "Sent email with ID: $EMAIL_ID"
```

## Troubleshooting

### Common Issues

**Missing API Key:**
```
✗ Configuration Error
  Missing required environment variable: RESEND_API_KEY
  Get your API key at https://resend.com/api-keys
```

**Input Validation:** All inputs are validated - invalid emails, missing required fields, etc. will show clear error messages

**Unknown Options:** Unknown command options will trigger helpful error messages with suggestions

## Development

See [DEVELOPMENT.md](./DEVELOPMENT.md) for development setup, architecture details, and contributing guidelines.

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development setup.


![visitors](https://visitor-badge.laobi.icu/badge?page_id=letanure/resend-cli)
---

*README is auto-generated based on CLI commands and modules*
