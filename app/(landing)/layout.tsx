import '@/styles/globals.css'

import LandingNav from './_components/landing-nav'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <LandingNav />
      {children}
    </>
  )
}
