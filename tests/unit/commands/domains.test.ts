import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { setupDomainsCommands } from "../../../src/commands/domains.js";

const mockDomains = {
  create: vi.fn(),
  list: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  verify: vi.fn(),
};

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({ domains: mockDomains })),
}));

function createProgram(): Command {
  const program = new Command();
  program.option("--api-key <key>", "API key");
  program.exitOverride();
  setupDomainsCommands(program);
  return program;
}

describe("domains commands", () => {
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

  it("creates a domain", async () => {
    mockDomains.create.mockResolvedValue({
      data: { id: "domain_123", name: "example.com" },
      error: null,
    });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "domains", "create", "--name", "example.com"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
    expect(output.data.name).toBe("example.com");
  });

  it("lists domains", async () => {
    mockDomains.list.mockResolvedValue({ data: { data: [{ id: "d1" }] }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "domains", "list"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
  });

  it("gets a domain by ID", async () => {
    mockDomains.get.mockResolvedValue({ data: { id: "domain_123", name: "example.com" }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "domains", "get", "domain_123"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
    expect(output.data.id).toBe("domain_123");
  });

  it("deletes a domain", async () => {
    mockDomains.remove.mockResolvedValue({ data: { deleted: true }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "domains", "delete", "domain_123"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
  });

  it("verifies a domain", async () => {
    mockDomains.verify.mockResolvedValue({ data: { object: "domain" }, error: null });
    const program = createProgram();
    await program.parseAsync(["node", "test", "--api-key", "re_test", "domains", "verify", "domain_123"]);
    await new Promise((r) => setTimeout(r, 50));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output.success).toBe(true);
  });
});
