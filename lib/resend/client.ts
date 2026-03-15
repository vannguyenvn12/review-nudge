import { Resend } from "resend";

/**
 * Resend singleton for server-side email sending.
 * Import this wherever emails are dispatched (Route Handlers, Server Actions).
 * Never use in Client Components — RESEND_API_KEY must stay server-side.
 */
const resend = new Resend(process.env.RESEND_API_KEY);

export { resend };
