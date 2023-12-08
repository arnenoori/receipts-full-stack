import type { Config } from 'drizzle-kit'
import { DB_NAMESPACE } from './server/db/schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL env var is required')
}

export default {
  schema: './server/db/schema.ts',
  out: './server/db/drizzle',
  driver: 'mysql2',
  strict: true,
  dbCredentials: {
    uri: process.env.DATABASE_URL,
  },
  tablesFilter: DB_NAMESPACE + '*',
} satisfies Config
