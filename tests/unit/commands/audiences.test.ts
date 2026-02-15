import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { setupAudiencesCommands } from "../../../src/commands/audiences.js";

const mockAudiences = { create: vi.fn(), list: vi.fn(), get: vi.fn(), remove: vi.fn() };

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({ audiences: mockAudiences })),
}));

function createProgram(): Command {
  const program = new Command();
  program.option("--api-key <key>", "API key");
  program.exitOverride();
  setupAudiencesCommands(program);
  return program;
}

describe("audiences commands", () => {
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

  it("creates an audience", async () => {
    mockAudiences.create.mockResolvedValue({ data: { id: "aud_123", name: "Newsletter" }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "audiences", "create", "--name", "Newsletter"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
    expect(output.data.name).toBe("Newsletter");
  });

  it("lists audiences", async () => {
    mockAudiences.list.mockResolvedValue({ data: { data: [{ id: "aud_1" }] }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "audiences", "list"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
  });

  it("gets an audience by ID", async () => {
    mockAudiences.get.mockResolvedValue({ data: { id: "aud_123", name: "Newsletter" }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "audiences", "get", "aud_123"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
    expect(output.data.id).toBe("aud_123");
  });

  it("deletes an audience", async () => {
    mockAudiences.remove.mockResolvedValue({ data: { deleted: true }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "audiences", "delete", "aud_123"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
  });
});
