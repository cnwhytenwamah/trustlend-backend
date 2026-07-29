"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const email_service_1 = require("../../services/email.service");
exports.notificationWorker = new bullmq_1.Worker('notifications', async (job) => {
    const data = job.data;
    switch (data.type) {
        case 'verifyEmail': {
            const { subject, html } = email_service_1.emailTemplates.verifyEmail(data.firstName, data.verifyUrl);
            await (0, email_service_1.sendEmail)({ to: data.to, subject, html });
            break;
        }
        case 'resetPassword': {
            const { subject, html } = email_service_1.emailTemplates.resetPassword(data.firstName, data.resetUrl);
            await (0, email_service_1.sendEmail)({ to: data.to, subject, html });
            break;
        }
        // TODO: add cases for booking notifications, push (FCM), etc.
        default:
            console.warn('Unknown notification job type:', data);
    }
}, { connection: redis_1.redisConnection });
exports.notificationWorker.on('completed', (job) => {
    console.log(`Notification job ${job.id} completed`);
});
exports.notificationWorker.on('failed', (job, err) => {
    console.error(`Notification job ${job?.id} failed:`, err.message);
});
//# sourceMappingURL=notification.worker.js.map