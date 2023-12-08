import Hero from './_components/hero'

export default function Page() {
  return (
    <main
      className="flex min-h-[865px] flex-col gap-10 overflow-y-hidden"
      style={{
        maxHeight: 'calc(100vh - 2rem)',
      }}
    >
      <Hero />
    </main>
  )
}
