import { auth } from '@clerk/nextjs'
import { cx } from 'class-variance-authority'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { AuthPath, buildPath, PrivatePath } from '@/lib/paths'

export default async function Hero() {
  const { userId } = auth()

  const gif = (
    <iframe
      src="https://giphy.com/embed/5fBH6zoAQg9dHK2ttsc"
      className="giphy-embed"
      allowFullScreen
    ></iframe>
  )

  return (
    <div className="flex flex-col items-center justify-center gap-10 px-5 py-20">
      <p className="lg:text-md rounded-full border px-4 py-2 text-center text-xs text-muted-foreground md:text-sm">
        Revolutionizing budget tracking.
      </p>
      <h1 className="mx-auto text-center text-5xl font-medium md:max-w-xl md:text-6xl lg:max-w-3xl lg:text-7xl">
        Use AI to spend your money wisley
      </h1>
      <Link
        href={
          userId
            ? buildPath({
                path: PrivatePath.Home,
              })
            : buildPath({
                path: AuthPath.SignUp,
              })
        }
      >
        <Button className={cx('flex items-center gap-2')}>
          <ArrowRightIcon className="h-4 w-4" />
          Get started
        </Button>
      </Link>
      <div className="mx-auto flex gap-2 items-center justify-center mt-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>{gif}</div>
        ))}
      </div>
    </div>
  )
}
