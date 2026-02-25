'use client'

import { useEffect, useState } from 'react'
import { useGamificationStore } from '@/lib/stores/gamification-store'
import { cn } from '@/lib/utils'

export function XpGainAnimation() {
  const pendingXpGains = useGamificationStore((state) => state.pendingXpGains)
  const consumeXpGain = useGamificationStore((state) => state.consumeXpGain)
  const [displayedGains, setDisplayedGains] = useState<
    Array<{ id: string; amount: number; visible: boolean }>
  >([])

  useEffect(() => {
    if (pendingXpGains.length === 0) return

    const newGains = pendingXpGains.filter(
      (g) => !displayedGains.some((d) => d.id === g.id)
    )

    if (newGains.length === 0) return

    // Add new gains to display
    setDisplayedGains((prev) => [
      ...prev,
      ...newGains.map((g) => ({ id: g.id, amount: g.amount, visible: true })),
    ])

    // Consume from store immediately
    newGains.forEach((g) => consumeXpGain(g.id))

    // Animate out after delay
    const timeoutId = setTimeout(() => {
      setDisplayedGains((prev) =>
        prev.map((g) =>
          newGains.some((ng) => ng.id === g.id) ? { ...g, visible: false } : g
        )
      )
    }, 1500)

    // Remove from display after animation
    const cleanupId = setTimeout(() => {
      setDisplayedGains((prev) =>
        prev.filter((g) => !newGains.some((ng) => ng.id === g.id))
      )
    }, 2000)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(cleanupId)
    }
  }, [pendingXpGains, consumeXpGain, displayedGains])

  if (displayedGains.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 pointer-events-none">
      {displayedGains.map((gain, index) => (
        <div
          key={gain.id}
          className={cn(
            'mb-2 px-4 py-2 rounded-full bg-amber-500 text-white font-bold text-lg shadow-lg transition-all duration-500',
            gain.visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4'
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          +{gain.amount} XP
        </div>
      ))}
    </div>
  )
}
