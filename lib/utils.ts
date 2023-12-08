import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

export const LETTERS_LOWER = 'abcdefghijklmnopqrstuvwxyz'
export const LETTERS_UPPER = LETTERS_LOWER.toUpperCase()
export const NUMBERS = Array.from(Array(1000).keys()).join('')

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

export const formatDateToLocal = (
  d: Date | string,
  opts?: {
    locale?: string
    includeTime?: boolean
  }
) => {
  const date = typeof d === 'string' ? new Date(d) : d
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }

  const includeTime = opts?.includeTime ?? false
  if (includeTime) {
    options.hour = 'numeric'
    options.minute = 'numeric'
    options.timeZoneName = 'short'
  }

  const locale = opts?.locale || 'en-US'

  const formatter = new Intl.DateTimeFormat(locale, options)
  return formatter.format(date)
}

export const isNullOrUndefined = <T>(
  value: T | null | undefined
): value is null | undefined => {
  return value === null || value === undefined
}

export const isNumber = <T>(value: T | unknown): value is Number => {
  return typeof value === 'number'
}

export const isBoolean = <T>(value: T | unknown): value is Boolean => {
  return typeof value === 'boolean'
}

export const isDate = <T>(value: T | unknown): value is Date => {
  return value instanceof Date
}

export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export const truncate = (str: string, n: number) => {
  return str.length > n ? str.substr(0, n - 1) + '...' : str
}

export const startsWithVowel = (str: string) => {
  return /^[aeiou]/i.test(str)
}

/**
 * return a value that has been rounded to a set precision
 */
export const round = (value: number, precision = 3) =>
  parseFloat(value.toFixed(precision))

/**
 * return a value that has been limited between min & max
 */
export const clamp = (value: number, min = 0, max = 100) => {
  return Math.min(Math.max(value, min), max)
}

/**
 * return a value that has been re-mapped according to the from/to
 * - for example, adjust(10, 0, 100, 100, 0) = 90
 */
export const adjust = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
) => {
  return round(
    toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin)
  )
}

export function isValidUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str
  try {
    if (str.includes('.') && !str.includes(' ')) {
      return new URL(`https://${str}`).toString()
    }
  } catch (e) {
    return null
  }
}

export const isEmptyString = (str: string) => {
  if (str === '""') return true
  return str.trim().length === 0
}

export const generateRandomUUID = (prefix?: string) => {
  return prefix ? `${prefix}-${uuidv4()}` : uuidv4()
}

export const generateRandomCode = (l = 6): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < l; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

function getRandomJitter(jitterValue: number): number {
  return Math.random() * (jitterValue * 2) - jitterValue
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchRequestWithRetries<T>(
  req: () => Promise<T>,
  errMessage: string = 'Max retries reached.',
  MAX_RETRIES = 5,
  BASE_DELAY_MS = 500,
  JITTER_MS = 100
): Promise<T> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await req()
    } catch (error) {
      let backoffTime =
        BASE_DELAY_MS * Math.pow(2, attempt) + getRandomJitter(JITTER_MS)
      console.warn(`Rate limited! Retrying in ${backoffTime}ms...`)
      await delay(backoffTime)
    }
  }

  // If it reaches here, it means all retry attempts failed.
  throw new Error(errMessage)
}

/**
 * Check if a value is empty
 * This is a more robust version of lodash's isEmpty
 */
export const isEmpty = (v: unknown) => {
  if (v === undefined || v === null) return true
  if (typeof v === 'string') return v.trim().length === 0
  if (typeof v === 'object') return Object.keys(v).length === 0
  if (Array.isArray(v)) return v.length === 0
  return false
}

/**
 * Parse a zod schema, or return the default value if the value is invalid.
 */

export const parseZodSchemaOrDefault = <T>(
  schema: z.ZodDefault<z.ZodType<T>>,
  value: unknown
): T => {
  const result = schema.safeParse(value)

  if (!result.success) {
    const defaultV = schema.safeParse(undefined)
    if (!defaultV.success) throw new Error('No default value found.') // should never happen

    return defaultV.data
  }
  return result.data
}

/**
 *
 * @returns true if the current environment is production
 */
export const isProduction = () => {
  return (
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production' ||
    process.env.SEED_ENV === 'production'
  )
}

export const camelCaseToTitleCase = (str: string) => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
}

export const snakeCaseToTitleCase = (str: string) => {
  return str
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
}
