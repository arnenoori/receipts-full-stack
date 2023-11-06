import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { authMiddleware } from "@clerk/nextjs";
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/sign-in*', '/sign-up*']

const isPublic = (path: string) => {
  return publicPaths.find(x =>
    path.match(new RegExp(`^${x}$`.replace('*$', '($|/)')))
  )
}

export function middleware(request: NextRequest) {
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const { userId } = getAuth(request)

  if (!userId) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect_url', request.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
} 
export const config = { matcher: '/((?!.*\\.).*)' }