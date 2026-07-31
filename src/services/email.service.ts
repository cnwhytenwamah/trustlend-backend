import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { env } from '../config/env';

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

const resend =
  env.EMAIL_PROVIDER === 'resend'
    ? new Resend(env.RESEND_API_KEY)
    : null;

const transporter =
  env.EMAIL_PROVIDER === 'nodemailer'
    ? nodemailer.createTransport({
        host: env.MAIL_HOST,
        port: env.MAIL_PORT,
        secure: env.MAIL_SECURE,
        auth: {
          user: env.MAIL_USER,
          pass: env.MAIL_PASSWORD,
        },
      })
    : null;

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailInput): Promise<void> {
  if (env.EMAIL_PROVIDER === 'resend') {
    if (!resend) {
      throw new Error('Resend client not initialized');
    }

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    return;
  }

  if (env.EMAIL_PROVIDER === 'nodemailer') {
    if (!transporter) {
      throw new Error('Nodemailer transporter not initialized');
    }

    await transporter.sendMail({
      from: `"TrustLend" <${env.MAIL_USER}>`,
      sender: env.MAIL_USER,
      replyTo: env.MAIL_USER,
      to,
      subject,
      text: 'Please use an HTML-compatible email client to view this message.',
      html,
    });

    return;
  }

  throw new Error('Unsupported email provider');
}

export const emailTemplates = {
  verifyEmail: (firstName: string, verifyUrl: string) => ({
    subject: 'Verify Your Email',

    html: `
      <h2>Hello ${firstName},</h2>

      <p>Welcome to TrustLend.</p>

      <p>Please verify your email address by clicking the button below:</p>

      <p>
        <a
          href="${verifyUrl}"
          style="
            background:#2563eb;
            color:#ffffff;
            padding:12px 20px;
            text-decoration:none;
            border-radius:6px;
            display:inline-block;
            font-weight:600;
          "
        >
          Verify Email
        </a>
      </p>

      <p>If you did not create an account, you can safely ignore this email.</p>
    `,
  }),

  resetPassword: (firstName: string, resetUrl: string) => ({
    subject: 'Reset Your Password',

    html: `
      <h2>Hello ${firstName},</h2>

      <p>You requested to reset your password.</p>

      <p>
        <a
          href="${resetUrl}"
          style="
            background:#2563eb;
            color:#ffffff;
            padding:12px 20px;
            text-decoration:none;
            border-radius:6px;
            display:inline-block;
            font-weight:600;
          "
        >
          Reset Password
        </a>
      </p>

      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    `,
  }),
};