"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.Transaction = exports.Refund = exports.DamageClaim = exports.Dispute = exports.Earning = exports.Issue = exports.Review = exports.Deposit = exports.Payment = exports.Booking = exports.AvailabilityBlock = exports.EquipmentPhoto = exports.Equipment = exports.Verification = exports.User = exports.sequelize = void 0;
const database_1 = require("../config/database");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return database_1.sequelize; } });
const user_model_1 = require("./user.model");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_model_1.User; } });
const verification_model_1 = require("./verification.model");
Object.defineProperty(exports, "Verification", { enumerable: true, get: function () { return verification_model_1.Verification; } });
const equipment_model_1 = require("./equipment.model");
Object.defineProperty(exports, "Equipment", { enumerable: true, get: function () { return equipment_model_1.Equipment; } });
const equipmentPhoto_model_1 = require("./equipmentPhoto.model");
Object.defineProperty(exports, "EquipmentPhoto", { enumerable: true, get: function () { return equipmentPhoto_model_1.EquipmentPhoto; } });
const availabilityBlock_model_1 = require("./availabilityBlock.model");
Object.defineProperty(exports, "AvailabilityBlock", { enumerable: true, get: function () { return availabilityBlock_model_1.AvailabilityBlock; } });
const booking_model_1 = require("./booking.model");
Object.defineProperty(exports, "Booking", { enumerable: true, get: function () { return booking_model_1.Booking; } });
const payment_model_1 = require("./payment.model");
Object.defineProperty(exports, "Payment", { enumerable: true, get: function () { return payment_model_1.Payment; } });
const deposit_model_1 = require("./deposit.model");
Object.defineProperty(exports, "Deposit", { enumerable: true, get: function () { return deposit_model_1.Deposit; } });
const review_model_1 = require("./review.model");
Object.defineProperty(exports, "Review", { enumerable: true, get: function () { return review_model_1.Review; } });
const issue_model_1 = require("./issue.model");
Object.defineProperty(exports, "Issue", { enumerable: true, get: function () { return issue_model_1.Issue; } });
const earning_model_1 = require("./earning.model");
Object.defineProperty(exports, "Earning", { enumerable: true, get: function () { return earning_model_1.Earning; } });
const dispute_model_1 = require("./dispute.model");
Object.defineProperty(exports, "Dispute", { enumerable: true, get: function () { return dispute_model_1.Dispute; } });
const damageClaim_model_1 = require("./damageClaim.model");
Object.defineProperty(exports, "DamageClaim", { enumerable: true, get: function () { return damageClaim_model_1.DamageClaim; } });
const refund_model_1 = require("./refund.model");
Object.defineProperty(exports, "Refund", { enumerable: true, get: function () { return refund_model_1.Refund; } });
const transaction_model_1 = require("./transaction.model");
Object.defineProperty(exports, "Transaction", { enumerable: true, get: function () { return transaction_model_1.Transaction; } });
const notification_model_1 = require("./notification.model");
Object.defineProperty(exports, "Notification", { enumerable: true, get: function () { return notification_model_1.Notification; } });
/**
 * All model associations live in ONE place so relationships are easy to
 * audit as the schema grows. When you add a new model, define its
 * associations down here rather than inside the model file itself.
 */
// User <-> Verification (1:1)
user_model_1.User.hasOne(verification_model_1.Verification, {
    foreignKey: 'userId',
    as: 'verification',
});
verification_model_1.Verification.belongsTo(user_model_1.User, {
    foreignKey: 'userId',
    as: 'user',
});
// User <-> Equipment (1:many, as owner)
user_model_1.User.hasMany(equipment_model_1.Equipment, {
    foreignKey: 'ownerId',
    as: 'equipment',
});
equipment_model_1.Equipment.belongsTo(user_model_1.User, {
    foreignKey: 'ownerId',
    as: 'owner',
});
// Equipment <-> EquipmentPhoto (1:many)
equipment_model_1.Equipment.hasMany(equipmentPhoto_model_1.EquipmentPhoto, {
    foreignKey: 'equipmentId',
    as: 'photos',
    onDelete: 'CASCADE',
});
equipmentPhoto_model_1.EquipmentPhoto.belongsTo(equipment_model_1.Equipment, {
    foreignKey: 'equipmentId',
    as: 'equipment',
});
// Equipment <-> AvailabilityBlock (1:many)
equipment_model_1.Equipment.hasMany(availabilityBlock_model_1.AvailabilityBlock, {
    foreignKey: 'equipmentId',
    as: 'blockedDates',
});
availabilityBlock_model_1.AvailabilityBlock.belongsTo(equipment_model_1.Equipment, {
    foreignKey: 'equipmentId',
    as: 'equipment',
});
// Equipment <-> Booking (1:many)
equipment_model_1.Equipment.hasMany(booking_model_1.Booking, {
    foreignKey: 'equipmentId',
    as: 'bookings',
});
booking_model_1.Booking.belongsTo(equipment_model_1.Equipment, {
    foreignKey: 'equipmentId',
    as: 'equipment',
});
// User <-> Booking (as renter, and as owner via denormalized ownerId)
user_model_1.User.hasMany(booking_model_1.Booking, {
    foreignKey: 'renterId',
    as: 'bookingsAsRenter',
});
booking_model_1.Booking.belongsTo(user_model_1.User, {
    foreignKey: 'renterId',
    as: 'renter',
});
user_model_1.User.hasMany(booking_model_1.Booking, {
    foreignKey: 'ownerId',
    as: 'bookingsAsOwner',
});
booking_model_1.Booking.belongsTo(user_model_1.User, {
    foreignKey: 'ownerId',
    as: 'owner',
});
// Booking <-> Payment (1:many — rental payment, deposit payment, etc.)
booking_model_1.Booking.hasMany(payment_model_1.Payment, {
    foreignKey: 'bookingId',
    as: 'payments',
});
payment_model_1.Payment.belongsTo(booking_model_1.Booking, {
    foreignKey: 'bookingId',
    as: 'booking',
});
user_model_1.User.hasMany(payment_model_1.Payment, {
    foreignKey: 'userId',
    as: 'payments',
});
payment_model_1.Payment.belongsTo(user_model_1.User, {
    foreignKey: 'userId',
    as: 'user',
});
// Booking <-> Deposit (1:1) / Payment <-> Deposit (1:1)
booking_model_1.Booking.hasOne(deposit_model_1.Deposit, {
    foreignKey: 'bookingId',
    as: 'deposit',
});
deposit_model_1.Deposit.belongsTo(booking_model_1.Booking, {
    foreignKey: 'bookingId',
    as: 'booking',
});
payment_model_1.Payment.hasOne(deposit_model_1.Deposit, {
    foreignKey: 'paymentId',
    as: 'deposit',
});
deposit_model_1.Deposit.belongsTo(payment_model_1.Payment, {
    foreignKey: 'paymentId',
    as: 'payment',
});
// Payment <-> Refund (1:many)
payment_model_1.Payment.hasMany(refund_model_1.Refund, {
    foreignKey: 'paymentId',
    as: 'refunds',
});
refund_model_1.Refund.belongsTo(payment_model_1.Payment, {
    foreignKey: 'paymentId',
    as: 'payment',
});
// Booking <-> Review (1:many)
booking_model_1.Booking.hasMany(review_model_1.Review, {
    foreignKey: 'bookingId',
    as: 'reviews',
});
review_model_1.Review.belongsTo(booking_model_1.Booking, {
    foreignKey: 'bookingId',
    as: 'booking',
});
equipment_model_1.Equipment.hasMany(review_model_1.Review, {
    foreignKey: 'equipmentId',
    as: 'reviews',
});
review_model_1.Review.belongsTo(equipment_model_1.Equipment, {
    foreignKey: 'equipmentId',
    as: 'equipment',
});
user_model_1.User.hasMany(review_model_1.Review, {
    foreignKey: 'reviewerId',
    as: 'reviewsGiven',
});
review_model_1.Review.belongsTo(user_model_1.User, {
    foreignKey: 'reviewerId',
    as: 'reviewer',
});
user_model_1.User.hasMany(review_model_1.Review, {
    foreignKey: 'revieweeId',
    as: 'reviewsReceived',
});
review_model_1.Review.belongsTo(user_model_1.User, {
    foreignKey: 'revieweeId',
    as: 'reviewee',
});
// Booking <-> Issue (1:many)
booking_model_1.Booking.hasMany(issue_model_1.Issue, {
    foreignKey: 'bookingId',
    as: 'issues',
});
issue_model_1.Issue.belongsTo(booking_model_1.Booking, {
    foreignKey: 'bookingId',
    as: 'booking',
});
user_model_1.User.hasMany(issue_model_1.Issue, {
    foreignKey: 'reporterId',
    as: 'reportedIssues',
});
issue_model_1.Issue.belongsTo(user_model_1.User, {
    foreignKey: 'reporterId',
    as: 'reporter',
});
// Booking <-> Earning (1:1)
booking_model_1.Booking.hasOne(earning_model_1.Earning, {
    foreignKey: 'bookingId',
    as: 'earning',
});
earning_model_1.Earning.belongsTo(booking_model_1.Booking, {
    foreignKey: 'bookingId',
    as: 'booking',
});
user_model_1.User.hasMany(earning_model_1.Earning, {
    foreignKey: 'ownerId',
    as: 'earnings',
});
earning_model_1.Earning.belongsTo(user_model_1.User, {
    foreignKey: 'ownerId',
    as: 'owner',
});
// Booking <-> Dispute (1:many)
booking_model_1.Booking.hasMany(dispute_model_1.Dispute, {
    foreignKey: 'bookingId',
    as: 'disputes',
});
dispute_model_1.Dispute.belongsTo(booking_model_1.Booking, {
    foreignKey: 'bookingId',
    as: 'booking',
});
user_model_1.User.hasMany(dispute_model_1.Dispute, {
    foreignKey: 'raisedById',
    as: 'disputesRaised',
});
dispute_model_1.Dispute.belongsTo(user_model_1.User, {
    foreignKey: 'raisedById',
    as: 'raisedBy',
});
user_model_1.User.hasMany(dispute_model_1.Dispute, {
    foreignKey: 'againstId',
    as: 'disputesAgainst',
});
dispute_model_1.Dispute.belongsTo(user_model_1.User, {
    foreignKey: 'againstId',
    as: 'against',
});
// Booking <-> DamageClaim (1:many)
booking_model_1.Booking.hasMany(damageClaim_model_1.DamageClaim, {
    foreignKey: 'bookingId',
    as: 'damageClaims',
});
damageClaim_model_1.DamageClaim.belongsTo(booking_model_1.Booking, {
    foreignKey: 'bookingId',
    as: 'booking',
});
user_model_1.User.hasMany(damageClaim_model_1.DamageClaim, {
    foreignKey: 'claimantId',
    as: 'damageClaimsFiled',
});
damageClaim_model_1.DamageClaim.belongsTo(user_model_1.User, {
    foreignKey: 'claimantId',
    as: 'claimant',
});
// User <-> Transaction (1:many)
user_model_1.User.hasMany(transaction_model_1.Transaction, {
    foreignKey: 'userId',
    as: 'transactions',
});
transaction_model_1.Transaction.belongsTo(user_model_1.User, {
    foreignKey: 'userId',
    as: 'user',
});
// User <-> Notification (1:many)
user_model_1.User.hasMany(notification_model_1.Notification, {
    foreignKey: 'userId',
    as: 'notifications',
});
notification_model_1.Notification.belongsTo(user_model_1.User, {
    foreignKey: 'userId',
    as: 'user',
});
//# sourceMappingURL=index.js.map