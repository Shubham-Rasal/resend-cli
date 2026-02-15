# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 0.1.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public issue
2. Email the maintainer or use [GitHub's private vulnerability reporting](https://github.com/Shubham-Rasal/resend-cli/security/advisories/new)
3. Include steps to reproduce the issue
4. Allow reasonable time for a fix before public disclosure

## API Key Handling

This CLI handles Resend API keys. Keys are read from (in order):

1. `--api-key` command-line flag
2. `RESEND_API_KEY` environment variable
3. `~/.resend_api_key` file

API keys are never logged, cached, or transmitted anywhere other than the Resend API.
