import { sequelize } from '../config/database';
import { User } from './user.model';
import { Verification } from './verification.model';
import { Equipment } from './equipment.model';
import { EquipmentPhoto } from './equipmentPhoto.model';
import { AvailabilityBlock } from './availabilityBlock.model';
import { Booking } from './booking.model';
import { Payment } from './payment.model';
import { Deposit } from './deposit.model';
import { Review } from './review.model';
import { Issue } from './issue.model';
import { Earning } from './earning.model';
import { Dispute } from './dispute.model';
import { DamageClaim } from './damageClaim.model';
import { Refund } from './refund.model';
import { Transaction } from './transaction.model';
import { Notification } from './notification.model';

/**
 * All model associations live in ONE place so relationships are easy to
 * audit as the schema grows. When you add a new model, define its
 * associations down here rather than inside the model file itself.
 */

// User <-> Verification (1:1)
User.hasOne(Verification, { foreignKey: 'userId', as: 'verification' });
Verification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Equipment (1:many, as owner)
User.hasMany(Equipment, { foreignKey: 'ownerId', as: 'equipment' });
Equipment.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Equipment <-> EquipmentPhoto (1:many)
Equipment.hasMany(EquipmentPhoto, { foreignKey: 'equipmentId', as: 'photos' });
EquipmentPhoto.belongsTo(Equipment, { foreignKey: 'equipmentId', as: 'equipment' });

// Equipment <-> AvailabilityBlock (1:many)
Equipment.hasMany(AvailabilityBlock, { foreignKey: 'equipmentId', as: 'blockedDates' });
AvailabilityBlock.belongsTo(Equipment, { foreignKey: 'equipmentId', as: 'equipment' });

// Equipment <-> Booking (1:many)
Equipment.hasMany(Booking, { foreignKey: 'equipmentId', as: 'bookings' });
Booking.belongsTo(Equipment, { foreignKey: 'equipmentId', as: 'equipment' });

// User <-> Booking (as renter, and as owner via denormalized ownerId)
User.hasMany(Booking, { foreignKey: 'renterId', as: 'bookingsAsRenter' });
Booking.belongsTo(User, { foreignKey: 'renterId', as: 'renter' });
User.hasMany(Booking, { foreignKey: 'ownerId', as: 'bookingsAsOwner' });
Booking.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Booking <-> Payment (1:many — rental payment, deposit payment, etc.)
Booking.hasMany(Payment, { foreignKey: 'bookingId', as: 'payments' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Booking <-> Deposit (1:1) / Payment <-> Deposit (1:1)
Booking.hasOne(Deposit, { foreignKey: 'bookingId', as: 'deposit' });
Deposit.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
Payment.hasOne(Deposit, { foreignKey: 'paymentId', as: 'deposit' });
Deposit.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });

// Payment <-> Refund (1:many)
Payment.hasMany(Refund, { foreignKey: 'paymentId', as: 'refunds' });
Refund.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });

// Booking <-> Review (1:many, since both parties can leave one)
Booking.hasMany(Review, { foreignKey: 'bookingId', as: 'reviews' });
Review.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
Equipment.hasMany(Review, { foreignKey: 'equipmentId', as: 'reviews' });
Review.belongsTo(Equipment, { foreignKey: 'equipmentId', as: 'equipment' });
User.hasMany(Review, { foreignKey: 'reviewerId', as: 'reviewsGiven' });
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });
User.hasMany(Review, { foreignKey: 'revieweeId', as: 'reviewsReceived' });
Review.belongsTo(User, { foreignKey: 'revieweeId', as: 'reviewee' });

// Booking <-> Issue (1:many)
Booking.hasMany(Issue, { foreignKey: 'bookingId', as: 'issues' });
Issue.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
User.hasMany(Issue, { foreignKey: 'reporterId', as: 'reportedIssues' });
Issue.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });

// Booking <-> Earning (1:1) / User(owner) <-> Earning (1:many)
Booking.hasOne(Earning, { foreignKey: 'bookingId', as: 'earning' });
Earning.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
User.hasMany(Earning, { foreignKey: 'ownerId', as: 'earnings' });
Earning.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Booking <-> Dispute (1:many)
Booking.hasMany(Dispute, { foreignKey: 'bookingId', as: 'disputes' });
Dispute.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
User.hasMany(Dispute, { foreignKey: 'raisedById', as: 'disputesRaised' });
Dispute.belongsTo(User, { foreignKey: 'raisedById', as: 'raisedBy' });
User.hasMany(Dispute, { foreignKey: 'againstId', as: 'disputesAgainst' });
Dispute.belongsTo(User, { foreignKey: 'againstId', as: 'against' });

// Booking <-> DamageClaim (1:many)
Booking.hasMany(DamageClaim, { foreignKey: 'bookingId', as: 'damageClaims' });
DamageClaim.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
User.hasMany(DamageClaim, { foreignKey: 'claimantId', as: 'damageClaimsFiled' });
DamageClaim.belongsTo(User, { foreignKey: 'claimantId', as: 'claimant' });

// User <-> Transaction (1:many)
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Notification (1:many)
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
  sequelize,
  User,
  Verification,
  Equipment,
  EquipmentPhoto,
  AvailabilityBlock,
  Booking,
  Payment,
  Deposit,
  Review,
  Issue,
  Earning,
  Dispute,
  DamageClaim,
  Refund,
  Transaction,
  Notification,
};
