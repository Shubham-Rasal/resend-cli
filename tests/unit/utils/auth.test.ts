import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { resolveApiKey } from "../../../src/utils/auth.js";

vi.mock("node:fs", () => ({
  readFileSync: vi.fn(),
}));

import { readFileSync } from "node:fs";

const mockReadFileSync = vi.mocked(readFileSync);

describe("resolveApiKey", () => {
  const originalEnv = process.env.RESEND_API_KEY;

  beforeEach(() => {
    delete process.env.RESEND_API_KEY;
    mockReadFileSync.mockReset();
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.RESEND_API_KEY = originalEnv;
    } else {
      delete process.env.RESEND_API_KEY;
    }
  });

  it("returns flag value first", () => {
    process.env.RESEND_API_KEY = "env_key";
    expect(resolveApiKey("flag_key")).toBe("flag_key");
  });

  it("falls back to env var", () => {
    process.env.RESEND_API_KEY = "env_key";
    expect(resolveApiKey()).toBe("env_key");
  });

  it("falls back to file", () => {
    mockReadFileSync.mockReturnValue("file_key\n");
    expect(resolveApiKey()).toBe("file_key");
  });

  it("throws if no key found", () => {
    mockReadFileSync.mockImplementation(() => {
      throw new Error("ENOENT");
    });
    expect(() => resolveApiKey()).toThrow("No API key found");
  });
});
