import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'Mousti+2002',
    12
  );

  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@dermashop.lb' },
    update: { password: hashedPassword },
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@dermashop.lb',
      password: hashedPassword,
    },
  });
  console.log('✓ Admin ready');

  const products = [
    { name: 'Vitamin C Serum', category: 'serums', price: 8, bulkPrice: 16, bulkQty: 3, description: 'Brightening and anti-aging powerhouse.', stock: true },
    { name: 'Hyaluronic Acid Serum', category: 'serums', price: 8, bulkPrice: 16, bulkQty: 3, description: 'Deep hydration and plumping.', stock: true },
    { name: 'Collagen Serum', category: 'serums', price: 8, bulkPrice: 16, bulkQty: 3, description: 'Firmness and elasticity boost.', stock: true },
    { name: 'Pierre Cardin Whitening Cream', category: 'skin', price: 13, description: 'Professional brightening treatment.', stock: true },
    { name: 'Detoxifying Clay Mask', category: 'skin', price: 13, description: 'Deep pore cleansing and purification.', stock: true },
    { name: 'Sun Cream SPF 50+', category: 'skin', price: 11, description: 'Advanced UV protection.', stock: true },
    { name: 'Anti-Hair Loss Spray', category: 'hair', price: 12, description: 'Strengthens and prevents hair loss.', stock: true },
    { name: 'Hair Fiber', category: 'hair', price: 15, description: 'Instant volume and coverage.', stock: true },
    { name: 'Scalp Massager', category: 'hair', price: 5, description: 'Stimulates blood flow and growth.', stock: true },
    { name: 'Derma Roller', category: 'tools', price: 8, description: 'Professional microneedling tool.', stock: true },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { name: p.name },
      update: {},
      create: p as any,
    });
  }
  console.log('✓ Products seeded');

  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      active: true,
      percentOff: 10,
      firstOrderOnly: true,
    },
  });
  console.log('✓ Welcome coupon ready');

  await prisma.branding.upsert({
    where: { id: 'single' },
    update: {},
    create: { id: 'single', logoUrl: null },
  });
  console.log('✓ Branding row ready');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());