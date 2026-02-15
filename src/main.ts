#!/usr/bin/env node

import { Command } from "commander";
import { setupEmailsCommands } from "./commands/emails.js";
import { setupDomainsCommands } from "./commands/domains.js";
import { setupApiKeysCommands } from "./commands/api-keys.js";
import { setupAudiencesCommands } from "./commands/audiences.js";
import { setupContactsCommands } from "./commands/contacts.js";
import { setupBroadcastsCommands } from "./commands/broadcasts.js";

const program = new Command();

program
  .name("resend")
  .description("CLI for the Resend email API")
  .version("0.1.0")
  .option("--api-key <key>", "Resend API key");

setupEmailsCommands(program);
setupDomainsCommands(program);
setupApiKeysCommands(program);
setupAudiencesCommands(program);
setupContactsCommands(program);
setupBroadcastsCommands(program);

program.parse();
