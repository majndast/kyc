'use client'

import { useGamificationStore } from '@/lib/stores/gamification-store'
import { getStreakMessage } from '@/lib/gamification/streak-service'
import { cn } from '@/lib/utils'
import { Flame } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useLocale, useTranslations } from 'next-intl'

interface StreakDisplayProps {
  className?: string
}

export function StreakDisplay({ className }: StreakDisplayProps) {
  const t = useTranslations('gamification')
  const locale = useLocale() as 'cs' | 'en'
  const currentStreak = useGamificationStore((state) => state.currentStreak)
  const longestStreak = useGamificationStore((state) => state.longestStreak)
  const streakFreezes = useGamificationStore((state) => state.streakFreezes)

  const isActive = currentStreak > 0

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-full text-sm font-medium cursor-default transition-colors',
              isActive
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
              className
            )}
          >
            <Flame
              className={cn(
                'h-4 w-4 transition-all',
                isActive && 'fill-current animate-pulse'
              )}
            />
            <span>{currentStreak}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="w-48">
          <div className="space-y-1">
            <p className="font-medium">{getStreakMessage(currentStreak, locale)}</p>
            <p className="text-xs text-muted-foreground">
              {t('longestStreak')}: {longestStreak} {t('days')}
            </p>
            {streakFreezes > 0 && (
              <p className="text-xs text-blue-500">
                {t('streakFreezes')}: {streakFreezes}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
