'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Flame, AlertTriangle, Snowflake } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface StreakModalProps {
  open: boolean
  onClose: () => void
  type: 'celebration' | 'warning' | 'broken'
  streakCount: number
  isNewRecord?: boolean
  hasFreeze?: boolean
  onUseFreeze?: () => void
}

export function StreakModal({
  open,
  onClose,
  type,
  streakCount,
  isNewRecord = false,
  hasFreeze = false,
  onUseFreeze,
}: StreakModalProps) {
  const t = useTranslations('gamification.streakModal')

  if (type === 'celebration') {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="text-center sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4">
              <div className="relative">
                <Flame className="h-16 w-16 text-orange-500 animate-bounce" />
                {isNewRecord && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                    {t('newRecord')}
                  </span>
                )}
              </div>
            </div>
            <DialogTitle className="text-2xl">
              {streakCount} {t('dayStreak')}!
            </DialogTitle>
            <DialogDescription className="text-lg">
              {isNewRecord ? t('newRecordMessage') : t('keepGoing')}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onClose} className="mt-4">
            {t('continue')}
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  if (type === 'warning') {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="text-center sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4">
              <AlertTriangle className="h-16 w-16 text-yellow-500" />
            </div>
            <DialogTitle className="text-2xl">{t('dontLoseStreak')}</DialogTitle>
            <DialogDescription className="text-lg">
              {t('streakAtRisk', { count: streakCount })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <Button onClick={onClose}>
              {t('startLesson')}
            </Button>
            <Button variant="outline" onClick={onClose}>
              {t('later')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // type === 'broken'
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="text-center sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4">
            <Flame className="h-16 w-16 text-gray-400" />
          </div>
          <DialogTitle className="text-2xl">{t('streakLost')}</DialogTitle>
          <DialogDescription className="text-lg">
            {t('streakLostMessage', { count: streakCount })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-4">
          {hasFreeze && onUseFreeze ? (
            <>
              <Button onClick={onUseFreeze} variant="secondary">
                <Snowflake className="mr-2 h-4 w-4" />
                {t('useStreakFreeze')}
              </Button>
              <Button onClick={onClose}>
                {t('startFresh')}
              </Button>
            </>
          ) : (
            <Button onClick={onClose}>
              {t('startFresh')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
