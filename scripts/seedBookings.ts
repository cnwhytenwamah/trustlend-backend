import '../src/config/env';
import { sequelize } from '../src/config/database';
import '../src/models';

import { User } from '../src/models/user.model';
import { Equipment } from '../src/models/equipment.model';
import { Booking } from '../src/models/booking.model';
import { Payment } from '../src/models/payment.model';
import { Deposit } from '../src/models/deposit.model';

import { signAccessToken } from '../src/utils/jwt';

const OWNER_EMAIL = 'owner.verified@trustlend.dev';
const RENTER_EMAIL = 'renter.verified@trustlend.dev';
const ADMIN_EMAIL = 'admin@trustlend.dev';

async function main() {
  await sequelize.authenticate();

  console.log('Connected to database\n');

  // ---------------------------------------------------------------------------
  // Get existing seeded users
  // ---------------------------------------------------------------------------

  const owner = await User.findOne({
    where: { email: OWNER_EMAIL },
    attributes: { include: ['passwordHash'] },
  });

  const renter = await User.findOne({
    where: { email: RENTER_EMAIL },
    attributes: { include: ['passwordHash'] },
  });

  const admin = await User.findOne({
    where: { email: ADMIN_EMAIL },
    attributes: { include: ['passwordHash'] },
  });

  if (!owner || !renter || !admin) {
    throw new Error(
      'Required users not found.\nRun npm run seed:users first.'
    );
  }

  // ---------------------------------------------------------------------------
  // Equipment
  // ---------------------------------------------------------------------------

  let equipment = await Equipment.findOne({
    where: {
      ownerId: owner.id,
      title: 'Test Excavator (seeded)',
    },
  });

  if (!equipment) {
    equipment = await Equipment.create({
      ownerId: owner.id,
      title: 'Test Excavator (seeded)',
      description:
        'Seeded equipment for testing bookings, payments, deposits and damage claims.',
      category: 'Heavy Machinery',
      brand: 'Caterpillar',
      model: '320D',
      condition: 'Excellent',
      dailyRate: 20000,
      weeklyRate: 120000,
      securityDepositAmount: 50000,
      address: 'Lagos',
      status: 'active',
    } as never);

    console.log('Equipment created');
  } else {
    console.log('Existing equipment reused');
  }

  // ---------------------------------------------------------------------------
  // Booking
  // ---------------------------------------------------------------------------

  const booking = await Booking.create({
    renterId: renter.id,
    ownerId: owner.id,
    equipmentId: equipment.id,

    startDate: '2026-07-01',
    endDate: '2026-07-05',

    dailyRate: 20000,
    rentalAmount: 80000,
    depositAmount: 50000,
    totalAmount: 130000,

    status: 'completed',
  } as never);

  console.log('Booking created');

  // ---------------------------------------------------------------------------
  // Payment
  // ---------------------------------------------------------------------------

  const payment = await Payment.create({
    bookingId: booking.id,
    userId: renter.id,

    provider: 'paystack',
    providerReference: `seed_${Date.now()}`,

    type: 'rental_and_deposit',

    amount: 130000,

    currency: 'NGN',

    status: 'successful',

    paidAt: new Date(),
  } as never);

  console.log('Payment created');

  // ---------------------------------------------------------------------------
  // Deposit
  // ---------------------------------------------------------------------------

  const deposit = await Deposit.create({
    bookingId: booking.id,
    paymentId: payment.id,

    amount: 50000,

    status: 'held',

    heldAt: new Date(),
  } as never);

  console.log('Deposit created');

  // ---------------------------------------------------------------------------
  // Tokens
  // ---------------------------------------------------------------------------

  const renterToken = signAccessToken({
    userId: renter.id,
    role: renter.role,
  });

  const ownerToken = signAccessToken({
    userId: owner.id,
    role: owner.role,
  });

  const adminToken = signAccessToken({
    userId: admin.id,
    role: admin.role,
  });

  console.log('\n============================================');
  console.log('POSTMAN VALUES');
  console.log('============================================\n');

  console.log('equipmentId       :', equipment.id);
  console.log('bookingId         :', booking.id);
  console.log('paymentId         :', payment.id);
  console.log('depositId         :', deposit.id);

  console.log('');

  console.log('ownerUserId       :', owner.id);
  console.log('renterUserId      :', renter.id);
  console.log('adminUserId       :', admin.id);

  console.log('');

  console.log('ownerAccessToken  :', ownerToken);
  console.log('renterAccessToken :', renterToken);
  console.log('adminAccessToken  :', adminToken);

  console.log('\n Booking seed completed successfully.');

  await sequelize.close();
}

main().catch(async (error) => {
  console.error(error);

  await sequelize.close();

  process.exit(1);
});