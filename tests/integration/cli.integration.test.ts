import { describe, it, expect } from "vitest";
import { runCli } from "./helpers.js";

describe("CLI basics", () => {
  it("shows help with --help", () => {
    const result = runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("CLI for the Resend email API");
    expect(result.stdout).toContain("emails");
    expect(result.stdout).toContain("domains");
    expect(result.stdout).toContain("api-keys");
    expect(result.stdout).toContain("audiences");
    expect(result.stdout).toContain("contacts");
    expect(result.stdout).toContain("broadcasts");
  });

  it("shows version with --version", () => {
    const result = runCli(["--version"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim()).toBe("0.1.0");
  });

  it("shows emails subcommands help", () => {
    const result = runCli(["emails", "--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("send");
    expect(result.stdout).toContain("send-batch");
    expect(result.stdout).toContain("get");
    expect(result.stdout).toContain("update");
    expect(result.stdout).toContain("cancel");
  });

  it("returns error JSON when no API key is set", () => {
    const result = runCli(["emails", "get", "some-id"], { RESEND_API_KEY: "" });
    expect(result.exitCode).toBe(1);
    expect(result.json).toBeTruthy();
    expect((result.json as any).success).toBe(false);
    expect((result.json as any).error.message).toContain("No API key found");
  });
});
