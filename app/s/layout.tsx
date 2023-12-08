import TabNav from '@/components/ui/tab-nav'
import LandingNav from '../(landing)/_components/landing-nav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LandingNav />
      <div className="px-20 flex flex-col gap-4">
        <TabNav
          items={[
            {
              name: 'Receipts',
              href: '/s',
            },
            {
              name: 'Budgets',
              href: '/s/budget',
            },
            {
              name: 'Chat',
              href: '/s/chat',
            },
          ]}
        />
        {children}
      </div>
    </>
  )
}
