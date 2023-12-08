'use client'

import { generateReactHelpers } from '@uploadthing/react/hooks'

import type { OurFileRouter } from '@/server/uploadthing/core'
import { Uploader } from 'uploadthing/server'

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>()

export type ExtractUploadPropsType<T> = T extends Uploader<infer U> ? U : never
