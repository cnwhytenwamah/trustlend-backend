/**
 * Seeds a diverse set of test users — for exercising Auth (login as
 * different accounts) and Admin Users (list/search/filter/status/verify)
 * without needing to register everyone by hand through Postman.
 *
 * Run with: npm run seed:users
 *
 * Creates one user per row below, upserted by email (safe to re-run —
 * won't duplicate existing users, just skips them and reports "already exists").
 * Password for every user is the same: Password123!
 */
import '../src/config/env';
import { sequelize } from '../src/config/database';
import '../src/models';
import { User } from '../src/models/user.model';
import bcrypt from 'bcrypt';
import { signAccessToken } from '../src/utils/jwt';
import { env } from '../src/config/env';

const TEST_PASSWORD = 'Password123!';

interface SeedUserSpec {
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'deleted';
  isEmailVerified: boolean;
  isIdentityVerified: boolean;
}

const USERS: SeedUserSpec[] = [
  {
    email: 'admin@trustlend.dev',
    firstName: 'Ada',
    lastName: 'Admin',
    role: 'admin',
    status: 'active',
    isEmailVerified: true,
    isIdentityVerified: true,
  },
  {
    email: 'owner.verified@trustlend.dev',
    firstName: 'Owen',
    lastName: 'Verified',
    role: 'user',
    status: 'active',
    isEmailVerified: true,
    isIdentityVerified: true,
  },
  {
    email: 'renter.verified@trustlend.dev',
    firstName: 'Rita',
    lastName: 'Verified',
    role: 'user',
    status: 'active',
    isEmailVerified: true,
    isIdentityVerified: true,
  },
  {
    email: 'unverified.email@trustlend.dev',
    firstName: 'Uche',
    lastName: 'Pending',
    role: 'user',
    status: 'active',
    isEmailVerified: false,
    isIdentityVerified: false,
  },
  {
    email: 'unverified.identity@trustlend.dev',
    firstName: 'Ifeoma',
    lastName: 'NotKyc',
    role: 'user',
    status: 'active',
    isEmailVerified: true,
    isIdentityVerified: false,
  },
  {
    email: 'suspended.user@trustlend.dev',
    firstName: 'Sam',
    lastName: 'Suspended',
    role: 'user',
    status: 'suspended',
    isEmailVerified: true,
    isIdentityVerified: false,
  },
  {
    email: 'deleted.user@trustlend.dev',
    firstName: 'Dele',
    lastName: 'Deleted',
    role: 'user',
    status: 'deleted',
    isEmailVerified: true,
    isIdentityVerified: false,
  },
  // A handful of plain active users — useful for testing pagination and
  // ?search= on GET /admin/users without every account being "special".
  {
    email: 'chidi.okafor@trustlend.dev',
    firstName: 'Chidi',
    lastName: 'Okafor',
    role: 'user',
    status: 'active',
    isEmailVerified: true,
    isIdentityVerified: false,
  },
  {
    email: 'amaka.eze@trustlend.dev',
    firstName: 'Amaka',
    lastName: 'Eze',
    role: 'user',
    status: 'active',
    isEmailVerified: true,
    isIdentityVerified: false,
  },
  {
    email: 'tunde.bakare@trustlend.dev',
    firstName: 'Tunde',
    lastName: 'Bakare',
    role: 'user',
    status: 'active',
    isEmailVerified: true,
    isIdentityVerified: false,
  },
];

async function main() {
  await sequelize.authenticate();
  console.log('Connected to database\n');

  const passwordHash = await bcrypt.hash(TEST_PASSWORD, env.BCRYPT_SALT_ROUNDS);
  const results: Array<{ spec: SeedUserSpec; id: string; created: boolean }> = [];

  for (const spec of USERS) {
    const existing = await User.findOne({ where: { email: spec.email } });
    if (existing) {
      results.push({ spec, id: existing.id, created: false });
      continue;
    }

    const user = await User.create({
      firstName: spec.firstName,
      lastName: spec.lastName,
      email: spec.email,
      passwordHash,
      role: spec.role,
      status: spec.status,
      isEmailVerified: spec.isEmailVerified,
      emailVerifiedAt: spec.isEmailVerified ? new Date() : null,
      isIdentityVerified: spec.isIdentityVerified,
      identityVerifiedAt: spec.isIdentityVerified ? new Date() : null,
    } as never);

    results.push({ spec, id: user.id, created: true });
  }

  console.log(`Password for every user below: ${TEST_PASSWORD}\n`);
  console.log(
    'Email'.padEnd(34),
    'Role'.padEnd(6),
    'Status'.padEnd(10),
    'Email✓'.padEnd(8),
    'ID✓'.padEnd(6),
    'New?',
  );
  console.log('-'.repeat(80));
  for (const { spec, created } of results) {
    console.log(
      spec.email.padEnd(34),
      spec.role.padEnd(6),
      spec.status.padEnd(10),
      (spec.isEmailVerified ? 'yes' : 'no').padEnd(8),
      (spec.isIdentityVerified ? 'yes' : 'no').padEnd(6),
      created ? 'created' : 'already existed',
    );
  }

  console.log('\n=== Ready-to-use access tokens (signed directly, bypassing /auth/login) ===\n');
  for (const { spec, id } of results) {
    if (spec.status !== 'active') continue; // suspended/deleted users can't log in anyway
    const token = signAccessToken({ userId: id, role: spec.role });
    console.log(`${spec.email.padEnd(34)} : ${token}`);
  }

  console.log('\nDone.');
  await sequelize.close();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
