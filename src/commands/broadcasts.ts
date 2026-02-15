import { Command } from "commander";
import { resolveApiKey } from "../utils/auth.js";
import { createClient } from "../utils/api-client.js";
import { outputSuccess, outputError } from "../utils/output.js";
import {
  handleAsyncCommand,
  getApiKeyFromCommand,
} from "../utils/async-command.js";

export function setupBroadcastsCommands(program: Command): void {
  const broadcasts = program
    .command("broadcasts")
    .description("Manage broadcasts");

  broadcasts
    .command("create")
    .description("Create a new broadcast")
    .requiredOption("--audience-id <audienceId>", "Audience ID")
    .requiredOption("--from <from>", "Sender email address")
    .requiredOption("--subject <subject>", "Email subject")
    .option("--html <html>", "HTML body")
    .option("--text <text>", "Plain text body")
    .option("--name <name>", "Broadcast name")
    .action(
      handleAsyncCommand(async (_opts, cmd: Command) => {
        const opts = cmd.opts();
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);

        const payload: Record<string, unknown> = {
          audienceId: opts.audienceId,
          from: opts.from,
          subject: opts.subject,
        };
        if (opts.html) payload.html = opts.html;
        if (opts.text) payload.text = opts.text;
        if (opts.name) payload.name = opts.name;

        const result = await client.broadcasts.create(
          payload as any
        );
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  broadcasts
    .command("list")
    .description("List all broadcasts")
    .action(
      handleAsyncCommand(async (_opts, cmd: Command) => {
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.broadcasts.list();
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  broadcasts
    .command("get")
    .description("Get broadcast details")
    .argument("<id>", "Broadcast ID")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.broadcasts.get(id);
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  broadcasts
    .command("update")
    .description("Update a broadcast")
    .argument("<id>", "Broadcast ID")
    .option("--from <from>", "Sender email address")
    .option("--subject <subject>", "Email subject")
    .option("--html <html>", "HTML body")
    .option("--text <text>", "Plain text body")
    .option("--name <name>", "Broadcast name")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const opts = cmd.opts();
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);

        const payload: Record<string, unknown> = {};
        if (opts.from) payload.from = opts.from;
        if (opts.subject) payload.subject = opts.subject;
        if (opts.html) payload.html = opts.html;
        if (opts.text) payload.text = opts.text;
        if (opts.name) payload.name = opts.name;

        const result = await client.broadcasts.update(id, payload as any);
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  broadcasts
    .command("send")
    .description("Send a broadcast")
    .argument("<id>", "Broadcast ID")
    .option("--scheduled-at <scheduledAt>", "Schedule send time (ISO 8601)")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const opts = cmd.opts();
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);

        const payload: Record<string, unknown> = {};
        if (opts.scheduledAt) payload.scheduledAt = opts.scheduledAt;

        const result = await client.broadcasts.send(
          id,
          Object.keys(payload).length > 0 ? (payload as any) : undefined
        );
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  broadcasts
    .command("delete")
    .description("Delete a broadcast")
    .argument("<id>", "Broadcast ID")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.broadcasts.remove(id);
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );
}
