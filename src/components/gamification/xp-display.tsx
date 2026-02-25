'use client'

import { useGamificationStore, selectXpProgress } from '@/lib/stores/gamification-store'
import { cn } from '@/lib/utils'
import { Zap } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { useTranslations } from 'next-intl'

interface XpDisplayProps {
  className?: string
  showProgress?: boolean
}

export function XpDisplay({ className, showProgress = false }: XpDisplayProps) {
  const t = useTranslations('gamification')
  const hasHydrated = useGamificationStore((state) => state._hasHydrated)
  const totalXp = useGamificationStore((state) => state.totalXp)
  const currentLevel = useGamificationStore((state) => state.currentLevel)
  const xpProgress = useGamificationStore(selectXpProgress)

  // Don't render until hydrated to avoid mismatch
  if (!hasHydrated) {
    return null
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium cursor-default',
              className
            )}
          >
            <Zap className="h-4 w-4 fill-current" />
            <span>{totalXp}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="w-48">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('level')} {currentLevel}</span>
              <span className="text-muted-foreground">
                {xpProgress.current}/{xpProgress.needed} XP
              </span>
            </div>
            {showProgress && (
              <Progress value={xpProgress.percentage} className="h-2" />
            )}
            <p className="text-xs text-muted-foreground">
              {t('xpToNextLevel', { xp: xpProgress.needed - xpProgress.current })}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
