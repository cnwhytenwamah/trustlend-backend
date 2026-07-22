import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';

export const authController = {
  async register(req: Request, res: Response) {
    const user = await authService.register(req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Account created. Please check your email to verify your account.',
      data: user,
    });
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    return sendSuccess(res, { message: 'Login successful', data: result });
  },

  async logout(_req: Request, res: Response) {
    // Stateless JWT — the client discards its tokens. If server-side
    // revocation is needed later, blacklist the refresh token's jti in Redis here.
    return sendSuccess(res, { message: 'Logged out successfully' });
  },

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    return sendSuccess(res, { message: 'Token refreshed', data: result });
  },

  async forgotPassword(req: Request, res: Response) {
    await authService.forgotPassword(req.body.email);
    return sendSuccess(res, {
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  },

  async resetPassword(req: Request, res: Response) {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    return sendSuccess(res, { message: 'Password reset successful' });
  },

  async verifyEmail(req: Request, res: Response) {
    await authService.verifyEmail(req.body.token);
    return sendSuccess(res, { message: 'Email verified successfully' });
  },

  async resendVerification(req: Request, res: Response) {
    await authService.resendVerification(req.body.email);
    return sendSuccess(res, { message: 'If that email exists, a verification link has been sent.' });
  },
};
