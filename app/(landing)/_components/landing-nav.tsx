'use client'

import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import Logo from '@/components/ui/logo'
import UserDropdown from '@/components/user/user-dropdown'
import { AuthPath, PublicPath, buildPath } from '@/lib/paths'

import { ValuesOf } from '@/types/utility-types'

export type NavLink = {
  label: string
  href: ValuesOf<typeof PublicPath>
}

export default function LandingNav() {
  return (
    <header className="flex h-20 w-full items-center justify-center">
      <div className="mx-5 flex w-full px-16 items-center py-4">
        <div className="flex flex-1 gap-2">
          <Logo />
        </div>
        <nav className="sticky top-4 hidden gap-6 px-6 lg:flex" />
        <div className="flex hidden flex-1 justify-end gap-2 lg:flex">
          <SignedIn>
            <UserDropdown />
          </SignedIn>
          <SignedOut>
            <Link href={buildPath({ path: AuthPath.SignIn })}>
              <Button variant={'ghost'}>Login</Button>
            </Link>
            <Link href={buildPath({ path: AuthPath.SignUp })}>
              <Button variant={'outline'}>Sign Up</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
