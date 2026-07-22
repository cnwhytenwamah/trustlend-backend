import { Resend } from 'resend';
import { env } from '../config/env';

const resend = new Resend(env.RESEND_API_KEY);

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

/**
 * Thin wrapper around Resend. Called from BullMQ workers (see
 * src/jobs/workers/notification.worker.ts), never directly from a
 * controller — emails should always be queued, not sent inline in the
 * request/response cycle.
 */
export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export const emailTemplates = {
  verifyEmail: (firstName: string, verifyUrl: string) => ({
    subject: 'Verify your TrustLend account',
    html: `<p>Hi ${firstName},</p><p>Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
  }),
  resetPassword: (firstName: string, resetUrl: string) => ({
    subject: 'Reset your TrustLend password',
    html: `<p>Hi ${firstName},</p><p>Click the link below to reset your password. This link expires in 30 minutes.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  }),
};
