import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { handleAsyncCommand } from "../../../src/utils/async-command.js";

describe("handleAsyncCommand", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    process.exitCode = undefined;
  });

  afterEach(() => {
    logSpy.mockRestore();
    process.exitCode = undefined;
  });

  it("calls the async function", async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    const wrapped = handleAsyncCommand(fn);
    wrapped("arg1", "arg2");
    await new Promise((r) => setTimeout(r, 10));
    expect(fn).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("catches errors and outputs error JSON", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("test error"));
    const wrapped = handleAsyncCommand(fn);
    wrapped();
    await new Promise((r) => setTimeout(r, 10));
    const output = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(output).toEqual({
      success: false,
      error: { message: "test error" },
    });
    expect(process.exitCode).toBe(1);
  });
});
