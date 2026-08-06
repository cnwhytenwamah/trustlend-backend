"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplates = void 0;
exports.sendEmail = sendEmail;
const resend_1 = require("resend");
const env_1 = require("../config/env");
const resend = new resend_1.Resend(env_1.env.RESEND_API_KEY);
/**
 * Thin wrapper around Resend. Called from BullMQ workers (see
 * src/jobs/workers/notification.worker.ts), never directly from a
 * controller — emails should always be queued, not sent inline in the
 * request/response cycle.
 */
async function sendEmail({ to, subject, html }) {
    await resend.emails.send({
        from: env_1.env.EMAIL_FROM,
        to,
        subject,
        html,
    });
}
exports.emailTemplates = {
    verifyEmail: (firstName, verifyUrl) => ({
        subject: 'Verify your TrustLend account',
        html: `<p>Hi ${firstName},</p><p>Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
    }),
    resetPassword: (firstName, resetUrl) => ({
        subject: 'Reset your TrustLend password',
        html: `<p>Hi ${firstName},</p><p>Click the link below to reset your password. This link expires in 30 minutes.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    }),
};
//# sourceMappingURL=email.service.js.map