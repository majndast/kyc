'use client'

import { useEffect, useState } from 'react'
import { useGamificationStore } from '@/lib/stores/gamification-store'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

export function LevelUpModal() {
  const t = useTranslations('gamification')
  const showLevelUpModal = useGamificationStore((state) => state.showLevelUpModal)
  const newLevel = useGamificationStore((state) => state.newLevel)
  const closeLevelUpModal = useGamificationStore((state) => state.closeLevelUpModal)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (showLevelUpModal) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showLevelUpModal])

  return (
    <Dialog open={showLevelUpModal} onOpenChange={closeLevelUpModal}>
      <DialogContent className="text-center sm:max-w-md overflow-hidden">
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  'absolute w-2 h-2 rounded-full animate-confetti',
                  i % 4 === 0 && 'bg-yellow-400',
                  i % 4 === 1 && 'bg-purple-500',
                  i % 4 === 2 && 'bg-blue-500',
                  i % 4 === 3 && 'bg-green-500'
                )}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random() * 1}s`,
                }}
              />
            ))}
          </div>
        )}
        <DialogHeader>
          <div className="mx-auto mb-4 relative">
            <div className="absolute inset-0 animate-ping">
              <Star className="h-20 w-20 text-yellow-400 opacity-25" />
            </div>
            <Star className="h-20 w-20 text-yellow-400 fill-yellow-400 animate-pulse" />
          </div>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
            {t('levelUp')}!
          </DialogTitle>
          <DialogDescription className="text-xl">
            {t('reachedLevel', { level: newLevel ?? 1 })}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-4xl font-bold shadow-lg">
              {newLevel}
            </div>
          </div>
          <Button onClick={closeLevelUpModal} size="lg" className="w-full">
            {t('awesome')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
