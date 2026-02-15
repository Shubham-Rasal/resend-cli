import { Command } from "commander";
import { resolveApiKey } from "../utils/auth.js";
import { createClient } from "../utils/api-client.js";
import { outputSuccess, outputError } from "../utils/output.js";
import {
  handleAsyncCommand,
  getApiKeyFromCommand,
} from "../utils/async-command.js";

export function setupApiKeysCommands(program: Command): void {
  const apiKeys = program.command("api-keys").description("Manage API keys");

  apiKeys
    .command("create")
    .description("Create a new API key")
    .requiredOption("--name <name>", "Name for the API key")
    .option("--permission <permission>", "Permission level (full-access or sending-access)")
    .option("--domain-id <domainId>", "Restrict to a specific domain")
    .action(
      handleAsyncCommand(async (_opts, cmd: Command) => {
        const opts = cmd.opts();
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);

        const payload: Record<string, unknown> = { name: opts.name };
        if (opts.permission) payload.permission = opts.permission;
        if (opts.domainId) payload.domain_id = opts.domainId;

        const result = await client.apiKeys.create(
          payload as any
        );
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  apiKeys
    .command("list")
    .description("List all API keys")
    .action(
      handleAsyncCommand(async (_opts, cmd: Command) => {
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.apiKeys.list();
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  apiKeys
    .command("delete")
    .description("Delete an API key")
    .argument("<id>", "API key ID")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.apiKeys.remove(id);
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );
}
