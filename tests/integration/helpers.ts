import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import { resolve } from "node:path";

const CLI_PATH = resolve(import.meta.dirname, "../../dist/main.js");

export interface CliResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  json: Record<string, unknown> | null;
}

export function runCli(args: string[], env?: Record<string, string>): CliResult {
  const result: SpawnSyncReturns<string> = spawnSync("node", [CLI_PATH, ...args], {
    encoding: "utf-8",
    env: { ...process.env, ...env },
    timeout: 15000,
  });

  let json: Record<string, unknown> | null = null;
  try {
    json = JSON.parse(result.stdout.trim());
  } catch {
    // stdout wasn't valid JSON
  }

  return {
    stdout: result.stdout,
    stderr: result.stderr,
    exitCode: result.status,
    json,
  };
}

export const hasApiKey = !!process.env.RESEND_API_KEY;
