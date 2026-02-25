'use client'

import dynamic from 'next/dynamic'

const GamificationProvider = dynamic(
  () => import('@/components/gamification/gamification-provider').then(mod => mod.GamificationProvider),
  { ssr: false }
)

interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <GamificationProvider>
      {children}
    </GamificationProvider>
  )
}
