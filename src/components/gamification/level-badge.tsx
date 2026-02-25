'use client'

import { useGamificationStore } from '@/lib/stores/gamification-store'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTranslations } from 'next-intl'

interface LevelBadgeProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-12 w-12 text-lg',
}

export function LevelBadge({ className, size = 'sm' }: LevelBadgeProps) {
  const t = useTranslations('gamification')
  const hasHydrated = useGamificationStore((state) => state._hasHydrated)
  const currentLevel = useGamificationStore((state) => state.currentLevel)

  if (!hasHydrated) {
    return null
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold cursor-default shadow-sm',
              sizeClasses[size],
              className
            )}
          >
            {currentLevel}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('level')} {currentLevel}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
