import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, Response } from 'next/server'

const publicPaths = ['/', '/sign-in*', '/sign-up*']

const isPublic = (path: string) => {
  return publicPaths.find(x =>
    path.match(new RegExp(`^${x}$`.replace('*$', '($|/)')))
  )
}

export async function middleware(request: NextRequest) {
  if (isPublic(request.nextUrl.pathname)) {
    return new Response(null, { status: 200 })
  }

  // Use Clerk's authMiddleware function
  const authResult = await authMiddleware()(request)

  if (!authResult.next) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect_url', request.url)
    return new Response(null, { status: 302, headers: { Location: signInUrl.toString() } })
  }

  return new Response(null, { status: 200 })
} 

export const config = { matcher: '/((?!.*\\.).*)' }