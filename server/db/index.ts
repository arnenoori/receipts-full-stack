import { env } from '@/env/server'
import { Client } from '@planetscale/database'
import { drizzle } from 'drizzle-orm/planetscale-serverless'
import * as schema from './schema'

export const db = drizzle(
  new Client({
    url: env.DATABASE_URL,
  }).connection(),
  { schema }
)

export type DBTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

export type DBType = typeof db
