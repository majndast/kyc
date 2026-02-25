// Streak Service - Logic for streak calculations

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  streakFreezes: number
}

export interface StreakUpdateResult {
  newStreak: number
  streakBroken: boolean
  streakExtended: boolean
  isNewRecord: boolean
  freezeUsed: boolean
}

function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}

function getDaysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export function calculateStreakUpdate(streakData: StreakData): StreakUpdateResult {
  const today = getDateString()
  const { currentStreak, longestStreak, lastActivityDate, streakFreezes } = streakData

  // First activity ever
  if (!lastActivityDate) {
    return {
      newStreak: 1,
      streakBroken: false,
      streakExtended: true,
      isNewRecord: true,
      freezeUsed: false
    }
  }

  // Already active today
  if (lastActivityDate === today) {
    return {
      newStreak: currentStreak,
      streakBroken: false,
      streakExtended: false,
      isNewRecord: false,
      freezeUsed: false
    }
  }

  const daysSinceLastActivity = getDaysDifference(lastActivityDate, today)

  // Consecutive day - extend streak
  if (daysSinceLastActivity === 1) {
    const newStreak = currentStreak + 1
    return {
      newStreak,
      streakBroken: false,
      streakExtended: true,
      isNewRecord: newStreak > longestStreak,
      freezeUsed: false
    }
  }

  // Missed one day - use freeze if available
  if (daysSinceLastActivity === 2 && streakFreezes > 0) {
    const newStreak = currentStreak + 1
    return {
      newStreak,
      streakBroken: false,
      streakExtended: true,
      isNewRecord: newStreak > longestStreak,
      freezeUsed: true
    }
  }

  // Streak broken - reset to 1
  return {
    newStreak: 1,
    streakBroken: currentStreak > 0,
    streakExtended: true,
    isNewRecord: false,
    freezeUsed: false
  }
}

export function shouldShowStreakWarning(lastActivityDate: string | null): boolean {
  if (!lastActivityDate) return false

  const today = getDateString()
  if (lastActivityDate === today) return false

  const daysSince = getDaysDifference(lastActivityDate, today)
  return daysSince === 1 // Show warning if they haven't been active today but were yesterday
}

export function getStreakMessage(
  currentStreak: number,
  locale: 'cs' | 'en'
): string {
  if (currentStreak === 0) {
    return locale === 'cs' ? 'Začni svou sérii!' : 'Start your streak!'
  }
  if (currentStreak === 1) {
    return locale === 'cs' ? '1 den v řadě!' : '1 day streak!'
  }
  if (currentStreak < 7) {
    return locale === 'cs' ? `${currentStreak} dny v řadě!` : `${currentStreak} day streak!`
  }
  if (currentStreak < 30) {
    return locale === 'cs' ? `${currentStreak} dní v řadě! Skvělé!` : `${currentStreak} day streak! Great!`
  }
  if (currentStreak < 100) {
    return locale === 'cs' ? `${currentStreak} dní v řadě! Úžasné!` : `${currentStreak} day streak! Amazing!`
  }
  return locale === 'cs' ? `${currentStreak} dní v řadě! Legendární!` : `${currentStreak} day streak! Legendary!`
}

export function getStreakEmoji(currentStreak: number): string {
  if (currentStreak === 0) return ''
  if (currentStreak < 7) return '🔥'
  if (currentStreak < 30) return '🔥🔥'
  if (currentStreak < 100) return '🔥🔥🔥'
  return '🔥💎'
}
