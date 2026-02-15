import { Command } from "commander";
import { resolveApiKey } from "../utils/auth.js";
import { createClient } from "../utils/api-client.js";
import { outputSuccess, outputError } from "../utils/output.js";
import {
  handleAsyncCommand,
  getApiKeyFromCommand,
} from "../utils/async-command.js";

export function setupDomainsCommands(program: Command): void {
  const domains = program.command("domains").description("Manage domains");

  domains
    .command("create")
    .description("Add a new domain")
    .requiredOption("--name <name>", "Domain name")
    .option("--region <region>", "Region (us-east-1, eu-west-1, sa-east-1)")
    .option("--open-tracking", "Enable open tracking")
    .option("--click-tracking", "Enable click tracking")
    .option("--tls <tls>", "TLS setting (enforced or opportunistic)")
    .action(
      handleAsyncCommand(async (_opts, cmd: Command) => {
        const opts = cmd.opts();
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);

        const payload: Record<string, unknown> = { name: opts.name };
        if (opts.region) payload.region = opts.region;
        if (opts.openTracking !== undefined)
          payload.openTracking = opts.openTracking;
        if (opts.clickTracking !== undefined)
          payload.clickTracking = opts.clickTracking;
        if (opts.tls) payload.tls = opts.tls;

        const result = await client.domains.create(
          payload as any
        );
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  domains
    .command("list")
    .description("List all domains")
    .action(
      handleAsyncCommand(async (_opts, cmd: Command) => {
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.domains.list();
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  domains
    .command("get")
    .description("Get domain details")
    .argument("<id>", "Domain ID")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.domains.get(id);
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  domains
    .command("update")
    .description("Update domain settings")
    .argument("<id>", "Domain ID")
    .option("--open-tracking", "Enable open tracking")
    .option("--no-open-tracking", "Disable open tracking")
    .option("--click-tracking", "Enable click tracking")
    .option("--no-click-tracking", "Disable click tracking")
    .option("--tls <tls>", "TLS setting (enforced or opportunistic)")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const opts = cmd.opts();
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);

        const payload: Record<string, unknown> = { id };
        if (opts.openTracking !== undefined)
          payload.openTracking = opts.openTracking;
        if (opts.clickTracking !== undefined)
          payload.clickTracking = opts.clickTracking;
        if (opts.tls) payload.tls = opts.tls;

        const result = await client.domains.update(
          payload as any
        );
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  domains
    .command("delete")
    .description("Delete a domain")
    .argument("<id>", "Domain ID")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.domains.remove(id);
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );

  domains
    .command("verify")
    .description("Verify a domain")
    .argument("<id>", "Domain ID")
    .action(
      handleAsyncCommand(async (id: string, _opts, cmd: Command) => {
        const apiKey = resolveApiKey(getApiKeyFromCommand(cmd));
        const client = createClient(apiKey);
        const result = await client.domains.verify(id);
        if (result.error) {
          outputError(result.error.message, { name: result.error.name });
        } else {
          outputSuccess(result.data);
        }
      })
    );
}
