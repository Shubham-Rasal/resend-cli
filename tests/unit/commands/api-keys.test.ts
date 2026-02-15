import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { setupApiKeysCommands } from "../../../src/commands/api-keys.js";

const mockApiKeys = { create: vi.fn(), list: vi.fn(), remove: vi.fn() };

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({ apiKeys: mockApiKeys })),
}));

function createProgram(): Command {
  const program = new Command();
  program.option("--api-key <key>", "API key");
  program.exitOverride();
  setupApiKeysCommands(program);
  return program;
}

describe("api-keys commands", () => {
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

  it("creates an API key", async () => {
    mockApiKeys.create.mockResolvedValue({ data: { id: "key_123", token: "re_xxx" }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "api-keys", "create", "--name", "My Key"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
    expect(output.data.token).toBe("re_xxx");
  });

  it("lists API keys", async () => {
    mockApiKeys.list.mockResolvedValue({ data: { data: [{ id: "key_1" }] }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "api-keys", "list"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
  });

  it("deletes an API key", async () => {
    mockApiKeys.remove.mockResolvedValue({ data: undefined, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "api-keys", "delete", "key_123"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
  });
});
