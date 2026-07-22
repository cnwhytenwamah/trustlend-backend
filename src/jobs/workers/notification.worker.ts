import { Worker, Job } from 'bullmq';
import { redisConnection } from '../../config/redis';
import { sendEmail, emailTemplates } from '../../services/email.service';

interface VerifyEmailJobData {
  type: 'verifyEmail';
  to: string;
  firstName: string;
  verifyUrl: string;
}

interface ResetPasswordJobData {
  type: 'resetPassword';
  to: string;
  firstName: string;
  resetUrl: string;
}

type NotificationJobData = VerifyEmailJobData | ResetPasswordJobData;

export const notificationWorker = new Worker<NotificationJobData>(
  'notifications',
  async (job: Job<NotificationJobData>) => {
    const data = job.data;

    switch (data.type) {
      case 'verifyEmail': {
        const { subject, html } = emailTemplates.verifyEmail(data.firstName, data.verifyUrl);
        await sendEmail({ to: data.to, subject, html });
        break;
      }
      case 'resetPassword': {
        const { subject, html } = emailTemplates.resetPassword(data.firstName, data.resetUrl);
        await sendEmail({ to: data.to, subject, html });
        break;
      }
      // TODO: add cases for booking notifications, push (FCM), etc.
      default:
        console.warn('Unknown notification job type:', data);
    }
  },
  { connection: redisConnection },
);

notificationWorker.on('completed', (job) => {
  console.log(`Notification job ${job.id} completed`);
});

notificationWorker.on('failed', (job, err) => {
  console.error(`Notification job ${job?.id} failed:`, err.message);
});
