import { Command } from "commander";
import { resolveApiKey } from "../utils/auth.js";
import { createClient } from "../utils/api-client.js";
import { outputSuccess, outputError } from "../utils/output.js";
import {
  handleAsyncCommand,
  getApiKeyFromCommand,
} from "../utils/async-command.js";

export function setupAudiencesCommands(program: Command): void {
  const audiences = program
    .command("audiences")
    .description("Manage audiences");

  audiences
    .command("create")
    .description("Create a new audience")
    .requiredOption("--name <name>", "Audience name")
    .action(
      handleAsyncCommand(async (_opts, cmd: Command) => {
        const opts = cmd.opts();
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.audiences.create({ name: opts.name });
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  audiences
    .command("list")
    .description("List all audiences")
    .action(
      handleAsyncCommand(async (_opts, cmd: Command) => {
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.audiences.list();
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  audiences
    .command("get")
    .description("Get audience details")
    .argument("<id>", "Audience ID")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.audiences.get(id);
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  audiences
    .command("delete")
    .description("Delete an audience")
    .argument("<id>", "Audience ID")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.audiences.remove(id);
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );
}
