import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { outputSuccess, outputError } from "../../../src/utils/output.js";

describe("output", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    process.exitCode = undefined;
  });

  afterEach(() => {
    logSpy.mockRestore();
    process.exitCode = undefined;
  });

  describe("outputSuccess", () => {
    it("prints success JSON", () => {
      outputSuccess({ id: "123" });
      const output = JSON.parse(logSpy.mock.calls[0][0] as string);
      expect(output).toEqual({ success: true, data: { id: "123" } });
    });

    it("handles null data", () => {
      outputSuccess(null);
      const output = JSON.parse(logSpy.mock.calls[0][0] as string);
      expect(output).toEqual({ success: true, data: null });
    });
  });

  describe("outputError", () => {
    it("prints error JSON and sets exit code", () => {
      outputError("Something went wrong");
      const output = JSON.parse(logSpy.mock.calls[0][0] as string);
      expect(output).toEqual({
        success: false,
        error: { message: "Something went wrong" },
      });
      expect(process.exitCode).toBe(1);
    });

    it("includes extra details", () => {
      outputError("Bad request", { statusCode: 400 });
      const output = JSON.parse(logSpy.mock.calls[0][0] as string);
      expect(output.error.statusCode).toBe(400);
    });
  });
});
