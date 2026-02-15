import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { homedir } from "node:os";

export function resolveApiKey(flagValue?: string): string {
  // 1. CLI flag
  if (flagValue) return flagValue;

  // 2. Environment variable
  const envKey = process.env.RESEND_API_KEY;
  if (envKey) return envKey;

  // 3. File in home directory
  try {
    const filePath = resolve(homedir(), ".resend_api_key");
    const content = readFileSync(filePath, "utf-8").trim();
    if (content) return content;
  } catch {
    // File doesn't exist or isn't readable
  }

  throw new Error(
    "No API key found. Provide one via --api-key, RESEND_API_KEY env var, or ~/.resend_api_key file."
  );
}
