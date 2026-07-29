"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
const apiResponse_1 = require("../utils/apiResponse");
exports.authController = {
    async register(req, res) {
        const user = await auth_service_1.authService.register(req.body);
        return (0, apiResponse_1.sendSuccess)(res, {
            statusCode: 201,
            message: 'Account created. Please check your email to verify your account.',
            data: user,
        });
    },
    async login(req, res) {
        const result = await auth_service_1.authService.login(req.body);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Login successful', data: result });
    },
    async logout(_req, res) {
        // Stateless JWT — the client discards its tokens. If server-side
        // revocation is needed later, blacklist the refresh token's jti in Redis here.
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Logged out successfully' });
    },
    async refreshToken(req, res) {
        const { refreshToken } = req.body;
        const result = await auth_service_1.authService.refreshToken(refreshToken);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Token refreshed', data: result });
    },
    async forgotPassword(req, res) {
        await auth_service_1.authService.forgotPassword(req.body.email);
        return (0, apiResponse_1.sendSuccess)(res, {
            message: 'If an account with that email exists, a reset link has been sent.',
        });
    },
    async resetPassword(req, res) {
        await auth_service_1.authService.resetPassword(req.body.token, req.body.newPassword);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Password reset successful' });
    },
    async verifyEmail(req, res) {
        await auth_service_1.authService.verifyEmail(req.body.token);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'Email verified successfully' });
    },
    async resendVerification(req, res) {
        await auth_service_1.authService.resendVerification(req.body.email);
        return (0, apiResponse_1.sendSuccess)(res, { message: 'If that email exists, a verification link has been sent.' });
    },
};
//# sourceMappingURL=auth.controller.js.map