# Resend CLI: An opinionated Resend email API client

CLI tool for [Resend](https://resend.com) with JSON output across all 29 commands. Designed for LLM agents, scripts, and humans who prefer structured data over dashboards.

## Why?

I want my LLM agents and scripts to send emails, manage domains, and work with audiences through Resend — without pulling in a full MCP server or writing fetch calls. `resend emails send` is all it takes. Every command returns clean JSON to stdout, making it trivial to pipe into `jq`, feed to an LLM, or integrate into CI/CD.

**This project scratches my own itches.** It wraps the full Resend API surface: emails, domains, API keys, audiences, contacts, and broadcasts. YMMV.

## Command Examples

### Emails

```bash
# Send an email
resend emails send --from "Acme <hello@acme.com>" --to user@example.com \
  --subject "Welcome!" --html "<h1>Hello</h1>"

# Send with plain text, CC, BCC, and tags
resend emails send --from hello@acme.com --to user@example.com \
  --subject "Update" --text "Plain text body" \
  --cc manager@acme.com --bcc archive@acme.com \
  --tag campaign=onboarding --tag version=2

# Schedule an email
resend emails send --from hello@acme.com --to user@example.com \
  --subject "Reminder" --text "Don't forget!" \
  --scheduled-at "2025-12-25T09:00:00Z"

# Send a batch of emails (up to 100)
resend emails send-batch --file ./batch.json

# Get email details
resend emails get em_123abc

# Update a scheduled email
resend emails update em_123abc --scheduled-at "2025-12-26T09:00:00Z"

# Cancel a scheduled email
resend emails cancel em_123abc
```

### Domains

```bash
# Add a domain
resend domains create --name example.com --region us-east-1

# List all domains
resend domains list

# Get domain details (DNS records, status, etc.)
resend domains get d_123abc

# Update domain settings
resend domains update d_123abc --open-tracking --click-tracking --tls enforced

# Disable tracking
resend domains update d_123abc --no-open-tracking --no-click-tracking

# Verify a domain
resend domains verify d_123abc

# Delete a domain
resend domains delete d_123abc
```

### API Keys

```bash
# Create a full-access API key
resend api-keys create --name "Production"

# Create a sending-only key restricted to a domain
resend api-keys create --name "Marketing" --permission sending-access --domain-id d_123abc

# List all API keys
resend api-keys list

# Delete an API key
resend api-keys delete ak_123abc
```

### Audiences

```bash
# Create an audience
resend audiences create --name "Newsletter Subscribers"

# List all audiences
resend audiences list

# Get audience details
resend audiences get aud_123abc

# Delete an audience
resend audiences delete aud_123abc
```

### Contacts

All contact commands require `--audience-id` because Resend namespaces contacts under audiences.

```bash
# Add a contact to an audience
resend contacts create --audience-id aud_123abc --email user@example.com \
  --first-name Jane --last-name Doe

# List contacts in an audience
resend contacts list --audience-id aud_123abc

# Get contact details
resend contacts get con_123abc --audience-id aud_123abc

# Update a contact
resend contacts update con_123abc --audience-id aud_123abc \
  --first-name Janet --unsubscribed

# Delete a contact
resend contacts delete con_123abc --audience-id aud_123abc
```

### Broadcasts

```bash
# Create a broadcast
resend broadcasts create --audience-id aud_123abc \
  --from "Newsletter <news@acme.com>" --subject "March Update" \
  --html "<h1>What's new</h1>" --name "march-2025"

# List all broadcasts
resend broadcasts list

# Get broadcast details
resend broadcasts get bc_123abc

# Update a broadcast before sending
resend broadcasts update bc_123abc --subject "March Update (revised)"

# Send a broadcast immediately
resend broadcasts send bc_123abc

# Schedule a broadcast
resend broadcasts send bc_123abc --scheduled-at "2025-03-15T10:00:00Z"

# Delete a broadcast
resend broadcasts delete bc_123abc
```

### Piping & Scripting

```bash
# Extract the email ID from a send
resend emails send --from a@acme.com --to b@acme.com \
  --subject "Test" --text "Hi" | jq -r '.data.id'

# List all domain IDs
resend domains list | jq -r '.data.data[].id'

# Bulk-add contacts from a CSV
cat contacts.csv | while IFS=, read email first last; do
  resend contacts create --audience-id aud_123 \
    --email "$email" --first-name "$first" --last-name "$last"
done
```

## Output Format

Every command returns JSON to stdout. Exit code 0 on success, 1 on error.

**Success:**

```json
{
  "success": true,
  "data": { "id": "em_123abc" }
}
```

**Error:**

```json
{
  "success": false,
  "error": { "message": "Invalid API key", "name": "validation_error" }
}
```

## Installation

### npm (recommended)

```bash
npm install -g the-resend-cli
resend --help
```

Or run without installing:

```bash
npx the-resend-cli --help
```

### From source

```bash
git clone https://github.com/Shubham-Rasal/resend-cli.git
cd resend-cli/resend-cli
pnpm install
pnpm build
node dist/main.js --help
```

### Development setup

```bash
git clone https://github.com/Shubham-Rasal/resend-cli.git
cd resend-cli/resend-cli
pnpm install
npx tsx src/main.ts --help  # No compilation needed
```

## Authentication

You can authenticate by passing in your API key via `--api-key` flag:

```bash
resend --api-key re_xxx emails list
```

… OR by storing it in an environment variable `RESEND_API_KEY`:

```bash
RESEND_API_KEY=re_xxx resend emails send --from a@acme.com --to b@acme.com --subject "Hi" --text "Hello"
```

… OR by storing it in `~/.resend_api_key` once, and then forgetting about it because the tool will check that file automatically:

```bash
# Save key once:
echo "re_xxx" > ~/.resend_api_key

# Day-to-day, just use the tool
resend emails send --from a@acme.com --to b@acme.com --subject "Hi" --text "Hello"
```

### Getting a Resend API key

1. Sign up or log in at [resend.com](https://resend.com)
2. Go to **API Keys** in the sidebar
3. Click **Create API Key**

## Example rule for your LLM agent

```markdown
We send transactional and marketing emails through Resend (https://resend.com). We use the `resend` CLI tool for communicating with the Resend API. Use your Bash tool to call the `resend` executable. Run `resend --help` and `resend <command> --help` to see usage information.

All output is JSON. Parse the `success` field to determine if the operation succeeded. On success, the relevant data is in the `data` field. On failure, the error message is in `error.message`.

When sending emails, always specify `--from`, `--to`, and `--subject`. Use `--html` for rich emails or `--text` for plain text. For bulk sends, write a JSON array to a file and use `resend emails send-batch --file <path>`.

All contact operations require `--audience-id` because Resend namespaces contacts under audiences. When working with contacts, always fetch the audience list first if the audience ID isn't known.
```

## Tech Stack

- **TypeScript** (ESM) with Commander.js v12
- **Resend Node.js SDK** v4 for API calls
- **Vitest** for unit and integration testing
- **pnpm** for package management

## Testing

```bash
# Run unit tests (no API key needed)
pnpm test

# Run integration tests (requires RESEND_API_KEY)
RESEND_API_KEY=re_xxx pnpm test:integration
```

## Command Reference

| Resource | Commands |
|----------|----------|
| **emails** | `send`, `send-batch`, `get`, `update`, `cancel` |
| **domains** | `create`, `list`, `get`, `update`, `delete`, `verify` |
| **api-keys** | `create`, `list`, `delete` |
| **audiences** | `create`, `list`, `get`, `delete` |
| **contacts** | `create`, `list`, `get`, `update`, `delete` |
| **broadcasts** | `create`, `list`, `get`, `update`, `send`, `delete` |

Run `resend <resource> --help` for detailed flags and usage for each command.
