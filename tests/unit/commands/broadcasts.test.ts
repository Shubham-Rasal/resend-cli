import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { setupBroadcastsCommands } from "../../../src/commands/broadcasts.js";

const mockBroadcasts = {
  create: vi.fn(), list: vi.fn(), get: vi.fn(),
  update: vi.fn(), send: vi.fn(), remove: vi.fn(),
};

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({ broadcasts: mockBroadcasts })),
}));

function createProgram(): Command {
  const program = new Command();
  program.option("--api-key <key>", "API key");
  program.exitOverride();
  setupBroadcastsCommands(program);
  return program;
}

describe("broadcasts commands", () => {
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

  it("creates a broadcast", async () => {
    mockBroadcasts.create.mockResolvedValue({ data: { id: "bc_123" }, error: null });
    const program = createProgram();
    await program.parseAsync([
      "node", "test", "--api-key", "re_test",
      "broadcasts", "create",
      "--audience-id", "aud_123", "--from", "test@example.com",
      "--subject", "Newsletter", "--html", "<h1>Hello</h1>",
    ]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
    expect(output.data.id).toBe("bc_123");
  });

  it("lists broadcasts", async () => {
    mockBroadcasts.list.mockResolvedValue({ data: { data: [{ id: "bc_1" }] }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "broadcasts", "list"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
  });

  it("gets a broadcast by ID", async () => {
    mockBroadcasts.get.mockResolvedValue({ data: { id: "bc_123", subject: "Newsletter" }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "broadcasts", "get", "bc_123"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
  });

  it("sends a broadcast", async () => {
    mockBroadcasts.send.mockResolvedValue({ data: { id: "bc_123" }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "broadcasts", "send", "bc_123"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
  });

  it("deletes a broadcast", async () => {
    mockBroadcasts.remove.mockResolvedValue({ data: { deleted: true }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "broadcasts", "delete", "bc_123"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
  });
});
