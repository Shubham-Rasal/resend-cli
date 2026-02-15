import { Resend } from "resend";

export function createClient(apiKey: string): Resend {
  return new Resend(apiKey);
}
