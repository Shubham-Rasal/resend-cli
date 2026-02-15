import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { setupEmailsCommands } from "../../../src/commands/emails.js";

const mockEmails = {
  send: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
  cancel: vi.fn(),
};
const mockBatch = { send: vi.fn() };

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: mockEmails,
    batch: mockBatch,
  })),
}));

vi.mock("node:fs", () => ({
  readFileSync: vi.fn(),
}));

import { readFileSync } from "node:fs";
const mockReadFileSync = vi.mocked(readFileSync);

function createProgram(): Command {
  const program = new Command();
  program.option("--api-key <key>", "API key");
  program.exitOverride();
  setupEmailsCommands(program);
  return program;
}

describe("emails commands", () => {
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

  describe("send", () => {
    it("sends an email and outputs success JSON", async () => {
      mockEmails.send.mockResolvedValue({
        data: { id: "email_123" },
        error: null,
      });

      const program = createProgram();
      await program.parseAsync([
        "node", "test", "--api-key", "re_test",
        "emails", "send",
        "--from", "test@example.com",
        "--to", "user@example.com",
        "--subject", "Hello",
        "--text", "Hi there",
      ]);

      // Wait for async handler
      await new Promise((r) => setTimeout(r, 50));

      const output = JSON.parse(logSpy.mock.calls[0][0] as string);
      expect(output.success).toBe(true);
      expect(output.data.id).toBe("email_123");
    });

    it("outputs error JSON on API error", async () => {
      mockEmails.send.mockResolvedValue({
        data: null,
        error: { message: "Invalid API key", name: "validation_error" },
      });

      const program = createProgram();
      await program.parseAsync([
        "node", "test", "--api-key", "re_test",
        "emails", "send",
        "--from", "test@example.com",
        "--to", "user@example.com",
        "--subject", "Hello",
        "--text", "Hi",
      ]);

      await new Promise((r) => setTimeout(r, 50));

      const output = JSON.parse(logSpy.mock.calls[0][0] as string);
      expect(output.success).toBe(false);
      expect(output.error.message).toBe("Invalid API key");
      expect(process.exitCode).toBe(1);
    });
  });

  describe("get", () => {
    it("gets an email by ID", async () => {
      mockEmails.get.mockResolvedValue({
        data: { id: "email_123", subject: "Hello" },
        error: null,
      });

      const program = createProgram();
      await program.parseAsync([
        "node", "test", "--api-key", "re_test",
        "emails", "get", "email_123",
      ]);

      await new Promise((r) => setTimeout(r, 50));

      const output = JSON.parse(logSpy.mock.calls[0][0] as string);
      expect(output.success).toBe(true);
      expect(output.data.id).toBe("email_123");
    });
  });

  describe("cancel", () => {
    it("cancels a scheduled email", async () => {
      mockEmails.cancel.mockResolvedValue({
        data: { id: "email_123", object: "email" },
        error: null,
      });

      const program = createProgram();
      await program.parseAsync([
        "node", "test", "--api-key", "re_test",
        "emails", "cancel", "email_123",
      ]);

      await new Promise((r) => setTimeout(r, 50));

      const output = JSON.parse(logSpy.mock.calls[0][0] as string);
      expect(output.success).toBe(true);
    });
  });

  describe("send-batch", () => {
    it("sends batch emails from a JSON file", async () => {
      mockBatch.send.mockResolvedValue({
        data: [{ id: "email_1" }, { id: "email_2" }],
        error: null,
      });

      mockReadFileSync.mockReturnValue(
        JSON.stringify([
          { from: "a@test.com", to: "b@test.com", subject: "Batch 1", text: "Hi" },
          { from: "a@test.com", to: "c@test.com", subject: "Batch 2", text: "Hey" },
        ])
      );

      const program = createProgram();
      await program.parseAsync([
        "node", "test", "--api-key", "re_test",
        "emails", "send-batch", "--file", "emails.json",
      ]);

      await new Promise((r) => setTimeout(r, 50));

      const output = JSON.parse(logSpy.mock.calls[0][0] as string);
      expect(output.success).toBe(true);
    });
  });
});
