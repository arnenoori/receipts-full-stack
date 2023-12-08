import '@/styles/globals.css'

import { ThemeProvider } from '@/components/theme/theme-provider'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import { TRPCReactProvider } from '@/trpc/react'
import { ClerkProvider } from '@clerk/nextjs'
import { GeistMono, GeistSans } from 'geist/font'
import { cookies } from 'next/headers'

export const metadata = {
  title: 'Receipts',
  description: 'Revolutionizing budgeting.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            `${GeistSans.variable} ${GeistMono.variable}`
          )}
        >
          <TRPCReactProvider cookies={cookies().toString()}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ThemeToggle shortcutOnly />
              {children}
              <Toaster />
            </ThemeProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
