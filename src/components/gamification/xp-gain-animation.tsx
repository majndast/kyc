'use client'

import { useEffect, useRef, useState } from 'react'
import { useGamificationStore } from '@/lib/stores/gamification-store'
import { cn } from '@/lib/utils'

interface DisplayedGain {
  id: string
  amount: number
  visible: boolean
}

export function XpGainAnimation() {
  const pendingXpGains = useGamificationStore((state) => state.pendingXpGains)
  const consumeXpGain = useGamificationStore((state) => state.consumeXpGain)
  const [displayedGains, setDisplayedGains] = useState<DisplayedGain[]>([])
  const processedIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Find new gains that haven't been processed
    const newGains = pendingXpGains.filter(
      (g) => !processedIds.current.has(g.id)
    )

    if (newGains.length === 0) return

    // Mark as processed immediately
    newGains.forEach((g) => {
      processedIds.current.add(g.id)
      consumeXpGain(g.id)
    })

    // Add to display
    setDisplayedGains((prev) => [
      ...prev,
      ...newGains.map((g) => ({ id: g.id, amount: g.amount, visible: true })),
    ])

    // Schedule hide animation
    const hideTimeout = setTimeout(() => {
      setDisplayedGains((prev) =>
        prev.map((g) =>
          newGains.some((ng) => ng.id === g.id) ? { ...g, visible: false } : g
        )
      )
    }, 2000)

    // Schedule removal
    const removeTimeout = setTimeout(() => {
      setDisplayedGains((prev) =>
        prev.filter((g) => !newGains.some((ng) => ng.id === g.id))
      )
      // Clean up processed IDs
      newGains.forEach((g) => processedIds.current.delete(g.id))
    }, 2500)

    return () => {
      clearTimeout(hideTimeout)
      clearTimeout(removeTimeout)
    }
  }, [pendingXpGains, consumeXpGain])

  if (displayedGains.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 pointer-events-none flex flex-col items-end gap-2">
      {displayedGains.map((gain) => (
        <div
          key={gain.id}
          className={cn(
            'px-4 py-2 rounded-full bg-amber-500 text-white font-bold text-lg shadow-lg transition-all duration-500 ease-out',
            gain.visible
              ? 'opacity-100 translate-x-0 scale-100'
              : 'opacity-0 translate-x-4 scale-95'
          )}
        >
          +{gain.amount} XP
        </div>
      ))}
    </div>
  )
}
