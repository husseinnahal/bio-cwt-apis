// handles database connection secrets outside the schema file.

import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Path to the primary Prisma schema file
  schema: 'prisma/schema.prisma',

  // Configure seed command for migrations
  migrations: {
    seed: 'ts-node ./prisma/seed.ts',
  },

  datasource: {
    url: env('DATABASE_URL'),
  },
});
