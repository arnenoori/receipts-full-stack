import {
  AuthPath,
  Path,
  PermissionsMap,
  PublicPath,
  buildPath,
  getPermissions,
} from '@/lib/paths'
import { authMiddleware } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { pathToRegexp } from 'path-to-regexp'

const redirectToPath = (path: string, base: string): NextResponse => {
  const url = new URL(path, base)
  return NextResponse.redirect(url)
}

const redirectToError = (req: NextRequest): NextResponse => {
  return NextResponse.redirect('/404')
}

const redirectToHome = (req: NextRequest): NextResponse => {
  const home = buildPath({
    path: PublicPath.Home,
  })

  return redirectToPath(home, req.url)
}

export default authMiddleware({
  afterAuth: async (auth, req) => {
    const pathname = req.nextUrl.pathname

    const matchingPath = (Object.keys(PermissionsMap) as Path[]).find(
      (path) => {
        const re = pathToRegexp(path)
        const match = re.exec(pathname)

        if (!match) {
          return false
        }

        return true
      }
    )

    if (!matchingPath) {
      return redirectToError(req)
    }

    const permissions = getPermissions(matchingPath)
    const isLoggedIn = auth.userId

    if (!isLoggedIn && permissions.authState === 'logged-in') {
      // if the user is not logged in and the path requires them to be logged in
      // redirect them to the sign in page
      return redirectToPath(
        buildPath({
          path: AuthPath.SignIn,
          searchParams: { redirect: new URL(req.url).pathname },
        }),
        req.url
      )
    } else if (isLoggedIn && permissions.authState === 'logged-out') {
      // if the user is logged in and the path requires them to be logged out
      // redirect them to the home page
      return redirectToHome(req)
    }

    return NextResponse.next()
  },
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
