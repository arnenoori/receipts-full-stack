// pages/_app.tsx
import {AppProps } from 'next/app';
import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const publicPaths = ['/', '/sign-in*', '/sign-up*']

const isPublic = (path: string) => {
  return publicPaths.find(x =>
    path.match(new RegExp(`^${x}$`.replace('*$', '($|/)')))
  )
}

// Use authMiddleware in _app.tsx
export default function MyApp({ Component, pageProps }: AppProps) {
  const middleware = authMiddleware({
    afterAuth: (auth, req) => {
      if (isPublic(req.nextUrl.pathname)) {
        return NextResponse.next();
      }

      if (!auth.userId) {
        const signInUrl = new URL('/sign-in', req.url)
        signInUrl.searchParams.set('redirect_url', req.url)
        return NextResponse.redirect(signInUrl);
      }

      return NextResponse.next();
    }
  });

  return (
    <Component {...pageProps} />
  );
}