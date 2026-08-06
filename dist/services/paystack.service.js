"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paystackService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
const AppError_1 = require("../utils/AppError");
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
/**
 * Thin wrapper around the Paystack REST API. Flutterwave is the backup
 * provider per the stack decision doc — if/when that's wired in, give it
 * a matching paystackService-shaped module and branch on
 * Payment.provider in payment.service.ts rather than changing this file.
 */
exports.paystackService = {
    async initializeTransaction(input) {
        const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${env_1.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: input.email,
                amount: input.amountKobo,
                reference: input.reference,
                metadata: input.metadata ?? {},
            }),
        });
        const json = (await res.json());
        if (!res.ok || !json.status) {
            throw new AppError_1.AppError(json.message || 'Paystack initialization failed', 502);
        }
        return json.data;
    },
    async verifyTransaction(reference) {
        const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${env_1.env.PAYSTACK_SECRET_KEY}` },
        });
        const json = (await res.json());
        if (!res.ok || !json.status) {
            throw new AppError_1.AppError(json.message || 'Paystack verification failed', 502);
        }
        return json.data;
    },
    /**
     * Paystack signs webhook payloads with HMAC SHA512 of the RAW request
     * body using your secret key. app.ts mounts express.raw() on the
     * webhook path specifically so this signature check is possible —
     * don't run express.json() before this route.
     */
    verifyWebhookSignature(rawBody, signatureHeader) {
        if (!signatureHeader)
            return false;
        const hash = crypto_1.default
            .createHmac('sha512', env_1.env.PAYSTACK_SECRET_KEY)
            .update(rawBody)
            .digest('hex');
        return hash === signatureHeader;
    },
};
//# sourceMappingURL=paystack.service.js.map