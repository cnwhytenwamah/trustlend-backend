"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: env_1.env.CLIENT_URL,
        credentials: true,
    }));
    app.use((0, morgan_1.default)(env_1.isDev ? 'dev' : 'combined'));
    // Payment webhooks (Paystack/Flutterwave) need the raw body to verify
    // signatures — mount that BEFORE the generic json() parser so it isn't
    // consumed/transformed first.
    app.use('/api/:version/payments/webhook', express_1.default.raw({ type: '*/*' }));
    app.use(express_1.default.json({ limit: '2mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    // Basic global rate limiting. Add stricter, endpoint-specific limiters
    // (e.g. on /auth/login) later as needed.
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        limit: 300,
        standardHeaders: true,
        legacyHeaders: false,
    }));
    app.get('/health', (_req, res) => {
        res.json({ success: true, message: 'TrustLend API is running', timestamp: new Date().toISOString() });
    });
    app.use(`/api/${env_1.env.API_VERSION}`, routes_1.default);
    app.use(error_middleware_1.notFoundMiddleware);
    app.use(error_middleware_1.errorMiddleware);
    return app;
}
//# sourceMappingURL=app.js.map