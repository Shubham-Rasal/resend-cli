import { Command } from "commander";
import { readFileSync } from "node:fs";
import { resolveApiKey } from "../utils/auth.js";
import { createClient } from "../utils/api-client.js";
import { outputSuccess, outputError } from "../utils/output.js";
import {
  handleAsyncCommand,
  getApiKeyFromCommand,
} from "../utils/async-command.js";

function parseTags(tags: string[]): Array<{ name: string; value: string }> {
  return tags.map((tag) => {
    const eqIndex = tag.indexOf("=");
    if (eqIndex === -1) {
      throw new Error(`Invalid tag format: "${tag}". Expected key=value`);
    }
    return { name: tag.slice(0, eqIndex), value: tag.slice(eqIndex + 1) };
  });
}

export function setupEmailsCommands(program: Command): void {
  const emails = program.command("emails").description("Manage emails");

  emails
    .command("send")
    .description("Send an email")
    .requiredOption("--from <from>", "Sender email address")
    .requiredOption("--to <to...>", "Recipient email address(es)")
    .requiredOption("--subject <subject>", "Email subject")
    .option("--html <html>", "HTML body")
    .option("--text <text>", "Plain text body")
    .option("--cc <cc...>", "CC recipients")
    .option("--bcc <bcc...>", "BCC recipients")
    .option("--reply-to <replyTo...>", "Reply-to addresses")
    .option("--scheduled-at <scheduledAt>", "Schedule send time (ISO 8601)")
    .option("--tag <tags...>", "Tags as key=value pairs")
    .option("--idempotency-key <key>", "Idempotency key for deduplication")
    .action(
      handleAsyncCommand(async (_opts, cmd: Command) => {
        const opts = cmd.opts();
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);

        const payload: Record<string, unknown> = {
          from: opts.from,
          to: opts.to,
          subject: opts.subject,
        };

        if (opts.html) payload.html = opts.html;
        if (opts.text) payload.text = opts.text;
        if (opts.cc) payload.cc = opts.cc;
        if (opts.bcc) payload.bcc = opts.bcc;
        if (opts.replyTo) payload.reply_to = opts.replyTo;
        if (opts.scheduledAt) payload.scheduled_at = opts.scheduledAt;
        if (opts.tag) payload.tags = parseTags(opts.tag);

        const headers: Record<string, string> = {};
        if (opts.idempotencyKey) {
          headers["Idempotency-Key"] = opts.idempotencyKey;
        }

        const result = await client.emails.send(payload as any);
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  emails
    .command("send-batch")
    .description("Send a batch of emails")
    .requiredOption("--file <path>", "Path to JSON file with email array")
    .action(
      handleAsyncCommand(async (_opts, cmd: Command) => {
        const opts = cmd.opts();
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);

        const content = readFileSync(opts.file, "utf-8");
        const emails = JSON.parse(content);

        if (!Array.isArray(emails)) {
          throw new Error("Batch file must contain a JSON array of emails");
        }

        const result = await client.batch.send(emails);
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  emails
    .command("get")
    .description("Get email details")
    .argument("<id>", "Email ID")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.emails.get(id);
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  emails
    .command("update")
    .description("Update a scheduled email")
    .argument("<id>", "Email ID")
    .requiredOption("--scheduled-at <scheduledAt>", "New scheduled time (ISO 8601)")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const opts = cmd.opts();
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.emails.update({
          id,
          scheduledAt: opts.scheduledAt,
        });
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  emails
    .command("cancel")
    .description("Cancel a scheduled email")
    .argument("<id>", "Email ID")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.emails.cancel(id);
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );
}
