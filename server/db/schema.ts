import { relations, sql } from 'drizzle-orm'
import {
  float,
  int,
  mysqlEnum,
  mysqlTableCreator,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const DB_NAMESPACE = 'csc_480_'

const mysqlTable = mysqlTableCreator((name) => `${DB_NAMESPACE}${name}`)

// ====================
// Budget
// ====================

// define table
export const budgets = mysqlTable('budgets', {
  userId: varchar('id', { length: 256 }).primaryKey(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow()
    .notNull(),
  groceries: float('groceries').notNull().default(100),
  clothingAndAccessories: float('clothing_and_accessories')
    .notNull()
    .default(100),
  electronics: float('electronics').notNull().default(100),
  homeAndGarden: float('home_and_garden').notNull().default(100),
  healthAndBeauty: float('health_and_beauty').notNull().default(100),
  entertainment: float('entertainment').notNull().default(100),
  travel: float('travel').notNull().default(100),
  automotive: float('automotive').notNull().default(100),
  services: float('services').notNull().default(100),
  giftsAndSpecialOccasions: float('gifts_and_special_occasions')
    .notNull()
    .default(100),
  education: float('education').notNull().default(100),
  fitnessAndSports: float('fitness_and_sports').notNull().default(100),
  pets: float('pets').notNull().default(100),
  officeSupplies: float('office_supplies').notNull().default(100),
  financialServices: float('financial_services').notNull().default(100),
  other: float('other').notNull().default(100),
})

// define types
export type Budget = typeof budgets.$inferSelect
export type NewBudget = typeof budgets.$inferInsert
export const InsertBudgetSchema = createInsertSchema(budgets)
export const SelectBudgetSchema = createSelectSchema(budgets)

// ====================
// Purchases
// ====================

export const CATEGORIES = [
  'groceries',
  'clothing_and_accessories',
  'electronics',
  'home_and_garden',
  'health_and_beauty',
  'entertainment',
  'travel',
  'automotive',
  'services',
  'gifts_and_special_occasions',
  'education',
  'fitness_and_sports',
  'pets',
  'office_supplies',
  'financial_services',
  'other',
] as const

// define table
export const purchases = mysqlTable('purchases', {
  id: varchar('id', { length: 36 }).primaryKey(),
  receiptId: varchar('receipt_id', { length: 36 }).notNull(),
  price: float('price').notNull(),
  warrantyDate: timestamp('warranty_date'),
  item: varchar('item', { length: 256 }),
  returnDate: timestamp('return_date'),
  category: mysqlEnum('category', CATEGORIES),
  quantity: int('quantity').notNull().default(1),
})

// define types
export type Purchase = typeof purchases.$inferSelect
export type NewPurchase = typeof purchases.$inferInsert
export const InsertPurchaseSchema = createInsertSchema(purchases)
export const SelectPurchaseSchema = createSelectSchema(purchases)

// define relations
export const purchasesRelations = relations(purchases, ({ one, many }) => ({
  receipt: one(receipts, {
    fields: [purchases.receiptId],
    references: [receipts.id],
  }),
}))

// ====================
// Receipts
// ====================

// define table
export const receipts = mysqlTable('receipts', {
  id: varchar('id', { length: 36 }).primaryKey(),
  imageUrl: varchar('image_url', { length: 256 }).notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow()
    .notNull(),
  userId: varchar('user_id', { length: 256 }).notNull(),
  merchant: varchar('merchant', { length: 256 }).notNull(),
  description: text('description'),
})

// define types
export type Receipt = typeof receipts.$inferSelect
export type NewReceipt = typeof receipts.$inferInsert
export const InsertReceiptSchema = createInsertSchema(receipts)
export const SelectReceiptSchema = createSelectSchema(receipts)

// define relations
export const receiptsRelations = relations(receipts, ({ many }) => ({
  purchases: many(purchases),
}))

export const ReceiptExtractionSchema = z.object({
  merchant: z.string().optional(),
  description: z.string().optional(),
  purchases: z.array(
    z.object({
      price: z.number(),
      item: z.string().nullish(),
      category: InsertPurchaseSchema.shape.category,
      quantity: z.number(),
    })
  ),
})
