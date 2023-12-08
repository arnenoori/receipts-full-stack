import Logo from '@/components/ui/logo'
import { ClerkStyledElements } from '@/lib/clerk'
import {
  AuthPath,
  PathToSearchParamsMap,
  PrivatePath,
  buildPath,
} from '@/lib/paths'
import { SignUp } from '@clerk/nextjs'

export default function Page({
  searchParams,
}: {
  searchParams: PathToSearchParamsMap[typeof AuthPath.SignUp]
}) {
  const redirectUrl =
    searchParams.redirect ?? buildPath({ path: PrivatePath.Home })

  return (
    <div className="w-screen h-screen flex justify-center items-center gap-14 flex flex-col">
      <Logo withText={false} className="-mt-20" size="lg" />
      <SignUp
        redirectUrl={redirectUrl}
        appearance={{
          elements: ClerkStyledElements,
        }}
      />
    </div>
  )
}
