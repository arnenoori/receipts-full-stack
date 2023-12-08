import { auth } from '@clerk/nextjs'
import type { FileRouter } from 'uploadthing/next'
import { createUploadthing } from 'uploadthing/next'

import { randomUUID } from 'crypto'
import { db } from '../db'
import { receipts } from '../db/schema'

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const { userId } = await auth()

      // If you throw, the user will not be able to upload
      if (!userId) throw new Error('Unauthorized')

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.insert(receipts).values({
        imageUrl: file.url,
        userId: metadata.userId,
        merchant: 'Unknown',
        id: randomUUID(),
      })
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
