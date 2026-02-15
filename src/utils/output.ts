export function outputSuccess(data: unknown): void {
  console.log(JSON.stringify({ success: true, data }, null, 2));
}

export function outputError(message: string, details?: Record<string, unknown>): void {
  const error: Record<string, unknown> = { message, ...details };
  console.log(JSON.stringify({ success: false, error }, null, 2));
  process.exitCode = 1;
}
