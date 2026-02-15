import { Command } from "commander";
import { outputError } from "./output.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function handleAsyncCommand(
  fn: (...args: any[]) => Promise<void>
): (...args: any[]) => void {
  return (...args: any[]) => {
    fn(...args).catch((err: unknown) => {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      outputError(message);
    });
  };
}

export function getApiKeyFromCommand(cmd: Command): string | undefined {
  // Walk up to the root program to get the global --api-key option
  let current: Command | null = cmd;
  while (current) {
    const opts = current.opts();
    if (opts.apiKey) return opts.apiKey as string;
    current = current.parent;
  }
  return undefined;
}
