'use client'

import { useEffect } from 'react'
import { XpGainAnimation } from './xp-gain-animation'
import { LevelUpModal } from './level-up-modal'
import { useGamificationStore } from '@/lib/stores/gamification-store'

interface GamificationProviderProps {
  children: React.ReactNode
}

export function GamificationProvider({ children }: GamificationProviderProps) {
  const checkDailyReset = useGamificationStore((state) => state.checkDailyReset)

  // Check daily reset on mount
  useEffect(() => {
    checkDailyReset()
  }, [checkDailyReset])

  return (
    <>
      {children}
      <XpGainAnimation />
      <LevelUpModal />
    </>
  )
}
