'use client'

import { LogOut, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { PublicPath, buildPath } from '@/lib/paths'
import { cn, toTitleCase, truncate } from '@/lib/utils'
import { useClerk } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Skeleton } from '../ui/skeleton'

export default function UserDropdown({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  const { user, signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
    router.push(buildPath({ path: PublicPath.Home }))
  }

  const { setTheme, theme } = useTheme()

  const switchTheme = () => {
    if (theme === 'system') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('system')
    }
  }

  if (!user) {
    return (
      <Avatar className="h-8 w-8">
        <Skeleton className="h-8 w-8" />
      </Avatar>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'relative flex px-0 py-0 h-min group/userdropdown gap-2',
            className
          )}
        >
          <Avatar className="transition-all duration-200 ease-in-out h-8 w-8 group-hover/userdropdown:bg-background group-hover/userdropdown:ring rounded-full group-hover/userdropdown:ring-2 group-hover/userdropdown:ring-offset-2">
            <Image
              src={user.imageUrl}
              alt={`@receipts`}
              fill={true}
              className="aspect-square h-full w-full rounded-full dark:filter dark:brightness-90"
            />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          {children}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
        collisionPadding={10}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {user.firstName && (
              <p className="text-sm font-medium leading-none">
                {user.firstName} {user.lastName}
              </p>
            )}
            {user.emailAddresses.length > 0 && (
              <p className="text-xs leading-none text-muted-foreground">
                {truncate(
                  user.emailAddresses[0]
                    ? user.emailAddresses[0].emailAddress ?? ''
                    : '',
                  25
                )}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault()
            switchTheme()
          }}
        >
          <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span>{toTitleCase(theme ?? 'System')} theme</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSignOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
