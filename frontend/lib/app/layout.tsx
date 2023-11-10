import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import Nav from './nav';
import Toast from './toast';
import { Suspense } from 'react';
import { ClerkProvider, UserButton } from '@clerk/nextjs';

export const metadata = {
  title: 'Track your receipts',
  description:
    'Upload and track your receipts!'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider frontendApi="your-clerk-frontend-api">
      <html lang="en" className="h-full bg-gray-50">
        <body className="h-full">
          <Suspense>
            <Nav />
            <UserButton afterSignOutUrl="/"/>
          </Suspense>
          {children}
          <Analytics />
          <Toast />
        </body>
      </html>
    </ClerkProvider>
  );
}