import crypto from 'crypto';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

interface InitializeTransactionInput {
  email: string;
  amountKobo: number;
  reference: string;
  metadata?: Record<string, unknown>;
}

interface InitializeTransactionResult {
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface VerifyTransactionResult {
  status: 'success' | 'failed' | 'abandoned';
  reference: string;
  amount: number;
  currency: string;
  paid_at: string | null;
}

/**
 * Thin wrapper around the Paystack REST API. Flutterwave is the backup
 * provider per the stack decision doc — if/when that's wired in, give it
 * a matching paystackService-shaped module and branch on
 * Payment.provider in payment.service.ts rather than changing this file.
 */
export const paystackService = {
  async initializeTransaction(input: InitializeTransactionInput): Promise<InitializeTransactionResult> {
    const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: input.email,
        amount: input.amountKobo,
        reference: input.reference,
        metadata: input.metadata ?? {},
      }),
    });

    const json = (await res.json()) as {
      status: boolean;
      message?: string;
      data: InitializeTransactionResult;
    };

    if (!res.ok || !json.status) {
      throw new AppError(json.message || 'Paystack initialization failed', 502);
    }

    return json.data;
  },

  async verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
    const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` },
    });

    const json = (await res.json()) as {
      status: boolean;
      message?: string;
      data: VerifyTransactionResult;
    };

    if (!res.ok || !json.status) {
      throw new AppError(json.message || 'Paystack verification failed', 502);
    }

    return json.data;
  },

  /**
   * Paystack signs webhook payloads with HMAC SHA512 of the RAW request
   * body using your secret key. app.ts mounts express.raw() on the
   * webhook path specifically so this signature check is possible —
   * don't run express.json() before this route.
   */
  verifyWebhookSignature(rawBody: Buffer, signatureHeader: string | undefined): boolean {
    if (!signatureHeader) return false;
    const hash = crypto
      .createHmac('sha512', env.PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest('hex');
    return hash === signatureHeader;
  },
};
