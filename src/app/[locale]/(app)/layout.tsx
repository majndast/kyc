import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { GamificationSync } from '@/components/gamification'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <GamificationSync isLoggedIn={!!user} />
      <Header user={user ? { email: user.email! } : null} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
