import { Command } from "commander";
import { resolveApiKey } from "../utils/auth.js";
import { createClient } from "../utils/api-client.js";
import { outputSuccess, outputError } from "../utils/output.js";
import {
  handleAsyncCommand,
  getApiKeyFromCommand,
} from "../utils/async-command.js";

export function setupContactsCommands(program: Command): void {
  const contacts = program.command("contacts").description("Manage contacts");

  contacts
    .command("create")
    .description("Create a new contact")
    .requiredOption("--audience-id <audienceId>", "Audience ID")
    .requiredOption("--email <email>", "Contact email address")
    .option("--first-name <firstName>", "First name")
    .option("--last-name <lastName>", "Last name")
    .option("--unsubscribed", "Mark as unsubscribed")
    .action(
      handleAsyncCommand(async (_opts, cmd: Command) => {
        const opts = cmd.opts();
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);

        const payload: Record<string, unknown> = {
          audienceId: opts.audienceId,
          email: opts.email,
        };
        if (opts.firstName) payload.firstName = opts.firstName;
        if (opts.lastName) payload.lastName = opts.lastName;
        if (opts.unsubscribed !== undefined)
          payload.unsubscribed = opts.unsubscribed;

        const result = await client.contacts.create(
          payload as any
        );
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  contacts
    .command("list")
    .description("List contacts in an audience")
    .requiredOption("--audience-id <audienceId>", "Audience ID")
    .action(
      handleAsyncCommand(async (_opts, cmd: Command) => {
        const opts = cmd.opts();
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.contacts.list({
          audienceId: opts.audienceId,
        });
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  contacts
    .command("get")
    .description("Get contact details")
    .argument("<id>", "Contact ID")
    .requiredOption("--audience-id <audienceId>", "Audience ID")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const opts = cmd.opts();
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.contacts.get({
          audienceId: opts.audienceId,
          id,
        });
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  contacts
    .command("update")
    .description("Update a contact")
    .argument("<id>", "Contact ID")
    .requiredOption("--audience-id <audienceId>", "Audience ID")
    .option("--first-name <firstName>", "First name")
    .option("--last-name <lastName>", "Last name")
    .option("--unsubscribed", "Mark as unsubscribed")
    .option("--no-unsubscribed", "Mark as subscribed")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const opts = cmd.opts();
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);

        const payload: Record<string, unknown> = {
          audienceId: opts.audienceId,
          id,
        };
        if (opts.firstName) payload.firstName = opts.firstName;
        if (opts.lastName) payload.lastName = opts.lastName;
        if (opts.unsubscribed !== undefined)
          payload.unsubscribed = opts.unsubscribed;

        const result = await client.contacts.update(
          payload as any
        );
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  contacts
    .command("delete")
    .description("Delete a contact")
    .argument("<id>", "Contact ID")
    .requiredOption("--audience-id <audienceId>", "Audience ID")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const opts = cmd.opts();
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.contacts.remove({
          audienceId: opts.audienceId,
          id,
        });
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );
}
