import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@wood.com';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Seeded initial admin user successfully: admin@wood.com');
  } else {
    console.log('Admin user already exists, skipping seed');
  }
  // Seed default CMS content for the Hero Section
  await prisma.cmsContent.upsert({
    where: { key: 'hero' },
    update: {},
    create: {
      key: 'hero',
      value: {
        title: 'Solid Wood Products',
        subtitle: 'Oak, beech, ash from 1700 CZK per m3',
        images: [
          '/hero-carpentry.png',
          '/hero-staircase.png',
          '/hero-table.png',
        ],
      },
    },
  });

  // Seed default CMS content for the About Us Section
  await prisma.cmsContent.upsert({
    where: { key: 'about' },
    update: {},
    create: {
      key: 'about',
      value: {
        description: 'BIO CWT — We manufacture solid wood products according to individual drawings. We make chairs, armchairs, wardrobes, beds and much more in our own workshop, equipped with all the necessary industrial equipment.',
        images: [
          '/about-1.png',
          '/about-2.png',
          '/about-3.png',
        ],
      },
    },
  });

  // Seed default CMS content for the Advantages Section
  await prisma.cmsContent.upsert({
    where: { key: 'advantages' },
    update: {},
    create: {
      key: 'advantages',
      value: {
        title: 'Advantages Working With Us',
        advantages: [
          'In-house carpentry production',
          'We only treat wood with environmentally friendly and safe products',
          'Prices from the manufacturer, no extra charges',
        ],
        image: '/advantage-stairs.png',
      },
    },
  });

  // Seed default CMS content for the Our Work Section (Image Carousel)
  await prisma.cmsContent.upsert({
    where: { key: 'ourWork' },
    update: {},
    create: {
      key: 'ourWork',
      value: {
        images: [
          { src: '/work-kitchen.png', alt: 'Custom wooden kitchen' },
          { src: '/hero-staircase.png', alt: 'Wooden spiral staircase' },
          { src: '/hero-table.png', alt: 'Solid wood dining table' },
        ],
      },
    },
  });

  console.log('Seeded initial CMS content successfully.');

  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
