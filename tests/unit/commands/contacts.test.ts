import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { setupContactsCommands } from "../../../src/commands/contacts.js";

const mockContacts = { create: vi.fn(), list: vi.fn(), get: vi.fn(), update: vi.fn(), remove: vi.fn() };

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({ contacts: mockContacts })),
}));

function createProgram(): Command {
  const program = new Command();
  program.option("--api-key <key>", "API key");
  program.exitOverride();
  setupContactsCommands(program);
  return program;
}

describe("contacts commands", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    process.exitCode = undefined;
    vi.clearAllMocks();
  });

  afterEach(() => {
    logSpy.mockRestore();
    process.exitCode = undefined;
  });

  it("creates a contact", async () => {
    mockContacts.create.mockResolvedValue({ data: { id: "contact_123" }, error: null });
    const program = createProgram();
    await program.parseAsync([
      "node", "test", "--api-key", "re_test",
      "contacts", "create", "--audience-id", "aud_123", "--email", "user@example.com", "--first-name", "John",
    ]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
    expect(output.data.id).toBe("contact_123");
  });

  it("lists contacts in an audience", async () => {
    mockContacts.list.mockResolvedValue({ data: { data: [{ id: "c1" }] }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "contacts", "list", "--audience-id", "aud_123"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
  });

  it("gets a contact by ID", async () => {
    mockContacts.get.mockResolvedValue({ data: { id: "contact_123", email: "user@example.com" }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "contacts", "get", "contact_123", "--audience-id", "aud_123"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
  });

  it("deletes a contact", async () => {
    mockContacts.remove.mockResolvedValue({ data: { deleted: true }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "contacts", "delete", "contact_123", "--audience-id", "aud_123"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
  });
});
