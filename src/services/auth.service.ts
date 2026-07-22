import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { env } from '../config/env';
import { notificationQueue, defaultJobOptions } from '../jobs/queue';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

const userRepository = new UserRepository();

// Short-lived, purpose-specific tokens for email verification / password
// reset. Kept separate from access/refresh secrets so they can't be
// swapped for each other.
function signPurposeToken(payload: { userId: string; purpose: string }, expiresIn: string) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn } as jwt.SignOptions);
}
function verifyPurposeToken(token: string): { userId: string; purpose: string } {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string; purpose: string };
}

export const authService = {
  async register(input: RegisterInput) {
    const exists = await userRepository.emailExists(input.email);
    if (exists) {
      throw AppError.conflict('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);

    const user = await userRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone ?? null,
      passwordHash,
      role: 'user',
    } as never);

    const verifyToken = signPurposeToken({ userId: user.id, purpose: 'verify-email' }, '24h');
    const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${verifyToken}`;

    await notificationQueue.add(
      'send-email',
      { type: 'verifyEmail', to: user.email, firstName: user.firstName, verifyUrl },
      defaultJobOptions,
    );

    return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmailWithPassword(input.email);
    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw AppError.unauthorized('Invalid email or password');
    }

    if (user.status !== 'active') {
      throw AppError.forbidden('This account is not active. Contact support.');
    }

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  },

  async refreshToken(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw AppError.unauthorized('Invalid or expired refresh token');
    }

    const user = await userRepository.findById(payload.userId);
    if (!user || user.status !== 'active') {
      throw AppError.unauthorized('Invalid session');
    }

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    return { accessToken };
  },

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);
    // Always respond as if it succeeded — don't reveal whether the email exists.
    if (!user) return;

    const resetToken = signPurposeToken({ userId: user.id, purpose: 'reset-password' }, '30m');
    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await notificationQueue.add(
      'send-email',
      { type: 'resetPassword', to: user.email, firstName: user.firstName, resetUrl },
      defaultJobOptions,
    );
  },

  async resetPassword(token: string, newPassword: string) {
    let payload;
    try {
      payload = verifyPurposeToken(token);
    } catch {
      throw AppError.badRequest('Invalid or expired reset token');
    }
    if (payload.purpose !== 'reset-password') {
      throw AppError.badRequest('Invalid token');
    }

    const passwordHash = await bcrypt.hash(newPassword, env.BCRYPT_SALT_ROUNDS);
    const updated = await userRepository.update(payload.userId, { passwordHash } as never);
    if (!updated) {
      throw AppError.notFound('User not found');
    }
  },

  async verifyEmail(token: string) {
    let payload;
    try {
      payload = verifyPurposeToken(token);
    } catch {
      throw AppError.badRequest('Invalid or expired verification token');
    }
    if (payload.purpose !== 'verify-email') {
      throw AppError.badRequest('Invalid token');
    }

    const updated = await userRepository.update(payload.userId, {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    } as never);
    if (!updated) {
      throw AppError.notFound('User not found');
    }
  },

  async resendVerification(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) return; 
    if (user.isEmailVerified) return;

    const verifyToken = signPurposeToken({ userId: user.id, purpose: 'verify-email' }, '24h');
    const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${verifyToken}`;

    await notificationQueue.add(
      'send-email',
      { type: 'verifyEmail', to: user.email, firstName: user.firstName, verifyUrl },
      defaultJobOptions,
    );
  },
};
