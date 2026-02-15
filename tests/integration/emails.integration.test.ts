import { describe, it, expect } from "vitest";
import { runCli, hasApiKey } from "./helpers.js";

describe.skipIf(!hasApiKey)("emails integration", () => {
  it("sends an email and returns success JSON", () => {
    const result = runCli([
      "emails", "send",
      "--from", "Test <onboarding@resend.dev>",
      "--to", "delivered@resend.dev",
      "--subject", "CLI integration test",
      "--text", "Hello from integration test",
    ]);

    expect(result.exitCode).toBe(0);
    expect(result.json).toBeTruthy();
    expect((result.json as any).success).toBe(true);
    expect((result.json as any).data.id).toBeTruthy();
  });

  it("returns error JSON for invalid email ID", () => {
    const result = runCli(["emails", "get", "nonexistent_id"]);

    expect(result.exitCode).toBe(1);
    expect(result.json).toBeTruthy();
    expect((result.json as any).success).toBe(false);
  });
});
