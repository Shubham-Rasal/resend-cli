# Contributing to resend-cli

Thanks for your interest in contributing!

## Getting Started

1. Fork and clone the repo
2. Install dependencies: `pnpm install`
3. Run in development mode: `npx tsx src/main.ts --help`

## Development

```bash
# Build
pnpm build

# Run unit tests (no API key needed)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run integration tests (requires RESEND_API_KEY)
RESEND_API_KEY=re_xxx pnpm test:integration
```

## Project Structure

```
src/
  main.ts              # CLI entry point
  commands/            # One file per resource (emails, domains, etc.)
  utils/
    api-client.ts      # Resend SDK wrapper
    auth.ts            # API key resolution
    async-command.ts   # Error handling for commands
    output.ts          # JSON output formatting
tests/
  unit/                # Unit tests (mocked API)
  integration/         # Integration tests (live API)
```

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Add or update tests as needed
4. Ensure `pnpm test` passes
5. Submit a PR with a clear description of the change

## Reporting Bugs

Open an issue at https://github.com/Shubham-Rasal/resend-cli/issues with:

- What you expected to happen
- What actually happened
- Steps to reproduce
- CLI version (`resend --version`)
