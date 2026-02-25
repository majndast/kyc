// XP Configuration and Level Thresholds

export const XP_VALUES = {
  LESSON_COMPLETE: 10,
  QUIZ_PERFECT: 15,      // 100%
  QUIZ_GOOD: 10,         // 70%+
  QUIZ_COMPLETE: 5,      // <70%
  STREAK_BONUS: 5,       // Per day of streak
} as const

export const DAILY_GOALS = [10, 20, 30, 50] as const

// Level thresholds - XP required to reach each level
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  50,     // Level 2
  120,    // Level 3
  200,    // Level 4
  300,    // Level 5
  420,    // Level 6
  560,    // Level 7
  720,    // Level 8
  900,    // Level 9
  1100,   // Level 10
  1350,   // Level 11
  1650,   // Level 12
  2000,   // Level 13
  2400,   // Level 14
  2850,   // Level 15
  3350,   // Level 16
  3900,   // Level 17
  4500,   // Level 18
  5150,   // Level 19
  5850,   // Level 20
  6600,   // Level 21
  7400,   // Level 22
  8250,   // Level 23
  9150,   // Level 24
  10100,  // Level 25
] as const

export function calculateLevel(totalXp: number): number {
  let level = 1
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1
      break
    }
  }
  return level
}

export function getXpForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + (currentLevel - LEVEL_THRESHOLDS.length + 1) * 1000
  }
  return LEVEL_THRESHOLDS[currentLevel]
}

export function getXpProgress(totalXp: number, currentLevel: number): { current: number; needed: number; percentage: number } {
  const currentLevelXp = currentLevel > 1 ? LEVEL_THRESHOLDS[currentLevel - 1] : 0
  const nextLevelXp = getXpForNextLevel(currentLevel)
  const xpIntoLevel = totalXp - currentLevelXp
  const xpNeeded = nextLevelXp - currentLevelXp

  return {
    current: xpIntoLevel,
    needed: xpNeeded,
    percentage: Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100))
  }
}

export function calculateXpForQuiz(score: number): number {
  if (score === 100) return XP_VALUES.QUIZ_PERFECT
  if (score >= 70) return XP_VALUES.QUIZ_GOOD
  return XP_VALUES.QUIZ_COMPLETE
}

export type XpSource = 'quiz_perfect' | 'quiz_good' | 'quiz_complete' | 'lesson_complete' | 'streak_bonus'

export function getXpSourceLabel(source: XpSource, locale: 'cs' | 'en'): string {
  const labels: Record<XpSource, { cs: string; en: string }> = {
    quiz_perfect: { cs: 'Perfektní kvíz', en: 'Perfect Quiz' },
    quiz_good: { cs: 'Dobrý kvíz', en: 'Good Quiz' },
    quiz_complete: { cs: 'Kvíz dokončen', en: 'Quiz Completed' },
    lesson_complete: { cs: 'Lekce dokončena', en: 'Lesson Completed' },
    streak_bonus: { cs: 'Streak bonus', en: 'Streak Bonus' },
  }
  return labels[source][locale]
}
