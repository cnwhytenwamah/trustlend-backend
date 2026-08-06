"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../repositories/user.repository");
const AppError_1 = require("../utils/AppError");
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const queue_1 = require("../jobs/queue");
const userRepository = new user_repository_1.UserRepository();
// Short-lived, purpose-specific tokens for email verification / password
// reset. Kept separate from access/refresh secrets so they can't be
// swapped for each other.
function signPurposeToken(payload, expiresIn) {
    return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_ACCESS_SECRET, { expiresIn });
}
function verifyPurposeToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
}
exports.authService = {
    async register(input) {
        const exists = await userRepository.emailExists(input.email);
        if (exists) {
            throw AppError_1.AppError.conflict('An account with this email already exists');
        }
        const passwordHash = await bcrypt_1.default.hash(input.password, env_1.env.BCRYPT_SALT_ROUNDS);
        const user = await userRepository.create({
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone ?? null,
            passwordHash,
            role: 'user',
        });
        const verifyToken = signPurposeToken({ userId: user.id, purpose: 'verify-email' }, '24h');
        const verifyUrl = `${env_1.env.CLIENT_URL}/verify-email?token=${verifyToken}`;
        await queue_1.notificationQueue.add('send-email', { type: 'verifyEmail', to: user.email, firstName: user.firstName, verifyUrl }, queue_1.defaultJobOptions);
        return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
    },
    async login(input) {
        const user = await userRepository.findByEmailWithPassword(input.email);
        if (!user) {
            throw AppError_1.AppError.unauthorized("Invalid email or password");
        }
        const passwordMatches = await bcrypt_1.default.compare(input.password, user.get("passwordHash"));
        if (!passwordMatches) {
            throw AppError_1.AppError.unauthorized("Invalid email or password");
        }
        if (user.get("status") !== "active") {
            throw AppError_1.AppError.forbidden("This account is not active. Contact support.");
        }
        const accessToken = (0, jwt_1.signAccessToken)({
            userId: user.get("id"),
            role: user.get("role"),
        });
        const refreshToken = (0, jwt_1.signRefreshToken)({
            userId: user.get("id"),
            role: user.get("role"),
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.get("id"),
                email: user.get("email"),
                firstName: user.get("firstName"),
                lastName: user.get("lastName"),
                role: user.get("role"),
            },
        };
    },
    async refreshToken(refreshToken) {
        let payload;
        try {
            payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        }
        catch {
            throw AppError_1.AppError.unauthorized('Invalid or expired refresh token');
        }
        const user = await userRepository.findById(payload.userId);
        if (!user || user.status !== 'active') {
            throw AppError_1.AppError.unauthorized('Invalid session');
        }
        const accessToken = (0, jwt_1.signAccessToken)({ userId: user.id, role: user.role });
        return { accessToken };
    },
    async forgotPassword(email) {
        const user = await userRepository.findByEmail(email);
        // Always respond as if it succeeded — don't reveal whether the email exists.
        if (!user)
            return;
        const resetToken = signPurposeToken({ userId: user.id, purpose: 'reset-password' }, '30m');
        const resetUrl = `${env_1.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        await queue_1.notificationQueue.add('send-email', { type: 'resetPassword', to: user.email, firstName: user.firstName, resetUrl }, queue_1.defaultJobOptions);
    },
    async resetPassword(token, newPassword) {
        let payload;
        try {
            payload = verifyPurposeToken(token);
        }
        catch {
            throw AppError_1.AppError.badRequest('Invalid or expired reset token');
        }
        if (payload.purpose !== 'reset-password') {
            throw AppError_1.AppError.badRequest('Invalid token');
        }
        const passwordHash = await bcrypt_1.default.hash(newPassword, env_1.env.BCRYPT_SALT_ROUNDS);
        const updated = await userRepository.update(payload.userId, { passwordHash });
        if (!updated) {
            throw AppError_1.AppError.notFound('User not found');
        }
    },
    async verifyEmail(token) {
        let payload;
        try {
            payload = verifyPurposeToken(token);
        }
        catch {
            throw AppError_1.AppError.badRequest('Invalid or expired verification token');
        }
        if (payload.purpose !== 'verify-email') {
            throw AppError_1.AppError.badRequest('Invalid token');
        }
        const updated = await userRepository.update(payload.userId, {
            isEmailVerified: true,
            emailVerifiedAt: new Date(),
        });
        if (!updated) {
            throw AppError_1.AppError.notFound('User not found');
        }
    },
    async resendVerification(email) {
        const user = await userRepository.findByEmail(email);
        if (!user)
            return; // don't reveal whether the email exists
        if (user.isEmailVerified)
            return;
        const verifyToken = signPurposeToken({ userId: user.id, purpose: 'verify-email' }, '24h');
        const verifyUrl = `${env_1.env.CLIENT_URL}/verify-email?token=${verifyToken}`;
        await queue_1.notificationQueue.add('send-email', { type: 'verifyEmail', to: user.email, firstName: user.firstName, verifyUrl }, queue_1.defaultJobOptions);
    },
};
//# sourceMappingURL=auth.service.js.map