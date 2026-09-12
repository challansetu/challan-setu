import { PrismaClient, DiscountType, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {
  SEED_ADMIN_PHONE,
  SEED_ADMIN_NAME,
  SEED_ADMIN_EMAIL,
  SEED_TEST_USER_PHONE,
  SEED_TEST_USER_NAME,
  SEED_TEST_USER_EMAIL,
  DISCOUNT_PERCENTAGE,
  DISCOUNT_RULE_NAME,
  DISCOUNT_RULE_DESCRIPTION,
  DISCOUNT_VALIDITY_MS,
  SEED_TEST_VEHICLE,
  SEED_TEST_VEHICLE_NICKNAME,
} from '../src/common/constants';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user (app user)
  const admin = await prisma.user.upsert({
    where: { phone: SEED_ADMIN_PHONE },
    update: {},
    create: {
      phone: SEED_ADMIN_PHONE,
      name: SEED_ADMIN_NAME,
      email: SEED_ADMIN_EMAIL,
      role: UserRole.ADMIN,
    },
  });
  console.log(`✅ Admin user created: ${admin.phone}`);

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { phone: SEED_TEST_USER_PHONE },
    update: {},
    create: {
      phone: SEED_TEST_USER_PHONE,
      name: SEED_TEST_USER_NAME,
      email: SEED_TEST_USER_EMAIL,
      role: UserRole.USER,
    },
  });
  console.log(`✅ Test user created: ${testUser.phone}`);

  // Create default discount rule: 30% platform-funded discount (no cap)
  const existingRule = await prisma.discountRule.findFirst({ where: { name: DISCOUNT_RULE_NAME } });
  if (!existingRule) {
    const discountRule = await prisma.discountRule.create({
      data: {
        name: DISCOUNT_RULE_NAME,
        description: DISCOUNT_RULE_DESCRIPTION,
        discountType: DiscountType.PERCENTAGE,
        discountValue: DISCOUNT_PERCENTAGE,
        maxDiscount: null,
        minOrderAmount: 0,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + DISCOUNT_VALIDITY_MS),
      },
    });
    console.log(`✅ Discount rule created: ${discountRule.name}`);
  } else {
    console.log(`⏭️  Discount rule already exists: ${existingRule.name}`);
  }

  // Create sample vehicle for test user
  const existingVehicle = await prisma.vehicle.findFirst({ where: { userId: testUser.id, vehicleNumber: SEED_TEST_VEHICLE } });
  if (!existingVehicle) {
    const vehicle = await prisma.vehicle.create({
      data: {
        userId: testUser.id,
        vehicleNumber: SEED_TEST_VEHICLE,
        nickname: SEED_TEST_VEHICLE_NICKNAME,
      },
    });
    console.log(`✅ Vehicle created: ${vehicle.vehicleNumber}`);
  } else {
    console.log(`⏭️  Vehicle already exists: ${SEED_TEST_VEHICLE}`);
  }

  // Create super admin for admin panel — password must come from the
  // environment; never hardcode a real, usable credential in source control.
  const superAdminEmail = process.env.SEED_SUPER_ADMIN_EMAIL;
  const superAdminPassword = process.env.SEED_SUPER_ADMIN_PASSWORD;
  if (superAdminEmail && superAdminPassword) {
    const superAdminHash = await bcrypt.hash(superAdminPassword, 12);
    const superAdmin = await prisma.adminUser.upsert({
      where: { email: superAdminEmail },
      update: {},
      create: {
        email: superAdminEmail,
        passwordHash: superAdminHash,
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
      },
    });
    console.log(`✅ Super admin ensured: ${superAdmin.email}`);
  } else {
    console.log('⏭️  Skipping super admin creation: set SEED_SUPER_ADMIN_EMAIL and SEED_SUPER_ADMIN_PASSWORD to seed one.');
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
