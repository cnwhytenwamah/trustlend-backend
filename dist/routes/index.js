"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./v1/auth.routes"));
const user_routes_1 = __importDefault(require("./v1/user.routes"));
const verification_routes_1 = __importDefault(require("./v1/verification.routes"));
const availability_routes_1 = __importDefault(require("./v1/availability.routes"));
const equipment_routes_1 = __importDefault(require("./v1/equipment.routes"));
const booking_routes_1 = __importDefault(require("./v1/booking.routes"));
const payment_routes_1 = __importDefault(require("./v1/payment.routes"));
const deposit_routes_1 = __importDefault(require("./v1/deposit.routes"));
const review_routes_1 = __importDefault(require("./v1/review.routes"));
const issue_routes_1 = __importDefault(require("./v1/issue.routes"));
const earning_routes_1 = __importDefault(require("./v1/earning.routes"));
const notification_routes_1 = __importDefault(require("./v1/notification.routes"));
const admin_routes_1 = __importDefault(require("./v1/admin.routes"));
const dispute_routes_1 = __importDefault(require("./v1/dispute.routes"));
const damageClaim_routes_1 = __importDefault(require("./v1/damageClaim.routes"));
const refund_routes_1 = __importDefault(require("./v1/refund.routes"));
const transaction_routes_1 = __importDefault(require("./v1/transaction.routes"));
const analytics_routes_1 = __importDefault(require("./v1/analytics.routes"));
const router = (0, express_1.Router)();
/**
 * Every v1 route file below already defines its OWN full path
 * (e.g. router.get('/equipment/:id', ...) or router.get('/admin/equipment', ...)),
 * so they're all mounted flat at the version root. Don't add another
 * path segment here — add it inside the specific route file instead.
 */
router.use('/auth', auth_routes_1.default); // exception: auth.routes.ts uses relative paths under /auth
router.use('/users', user_routes_1.default); // exception: user.routes.ts uses relative paths under /users
router.use('/', verification_routes_1.default);
router.use('/', availability_routes_1.default);
router.use('/', equipment_routes_1.default);
router.use('/', booking_routes_1.default);
router.use('/', payment_routes_1.default);
router.use('/', deposit_routes_1.default);
router.use('/', review_routes_1.default);
router.use('/', issue_routes_1.default);
router.use('/', earning_routes_1.default);
router.use('/', notification_routes_1.default);
router.use('/', admin_routes_1.default);
router.use('/', dispute_routes_1.default);
router.use('/', damageClaim_routes_1.default);
router.use('/', refund_routes_1.default);
router.use('/', transaction_routes_1.default);
router.use('/', analytics_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map