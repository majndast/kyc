'use client'

import { useGamificationStore, selectDailyProgress } from '@/lib/stores/gamification-store'
import { DAILY_GOALS } from '@/lib/gamification/xp-config'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Target, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface DailyGoalWidgetProps {
  className?: string
  compact?: boolean
}

export function DailyGoalWidget({ className, compact = false }: DailyGoalWidgetProps) {
  const t = useTranslations('gamification')
  const hasHydrated = useGamificationStore((state) => state._hasHydrated)
  const dailyProgress = useGamificationStore(selectDailyProgress)
  const dailyGoal = useGamificationStore((state) => state.dailyGoal)
  const setDailyGoal = useGamificationStore((state) => state.setDailyGoal)

  if (!hasHydrated) {
    return null
  }

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-full text-sm font-medium cursor-default',
          dailyProgress.met
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
          className
        )}
      >
        {dailyProgress.met ? (
          <Check className="h-4 w-4" />
        ) : (
          <Target className="h-4 w-4" />
        )}
        <span>
          {dailyProgress.current}/{dailyProgress.goal}
        </span>
      </div>
    )
  }

  return (
    <div className={cn('p-4 rounded-lg border bg-card', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {dailyProgress.met ? (
            <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          ) : (
            <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          )}
          <span className="font-medium">{t('dailyGoal')}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2">
              {dailyGoal} XP
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {DAILY_GOALS.map((goal) => (
              <DropdownMenuItem
                key={goal}
                onClick={() => setDailyGoal(goal)}
                className={cn(goal === dailyGoal && 'bg-accent')}
              >
                {goal} XP - {goal <= 10 ? t('casual') : goal <= 20 ? t('regular') : goal <= 30 ? t('serious') : t('intense')}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <Progress
          value={dailyProgress.percentage}
          className={cn(
            'h-3',
            dailyProgress.met && '[&>div]:bg-green-500'
          )}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {dailyProgress.current} / {dailyProgress.goal} XP
          </span>
          {dailyProgress.met ? (
            <span className="text-green-600 dark:text-green-400 font-medium">
              {t('goalComplete')}
            </span>
          ) : (
            <span>{dailyProgress.goal - dailyProgress.current} XP {t('remaining')}</span>
          )}
        </div>
      </div>
    </div>
  )
}
