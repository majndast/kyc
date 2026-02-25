'use client'

import { useEffect } from 'react'
import { useGamificationStore } from '@/lib/stores/gamification-store'

export function useGamificationSync(isLoggedIn: boolean) {
  const syncFromServer = useGamificationStore((state) => state.syncFromServer)

  useEffect(() => {
    if (!isLoggedIn) return

    const fetchGamificationData = async () => {
      try {
        const response = await fetch('/api/gamification/earn-xp')
        if (response.ok) {
          const data = await response.json()
          syncFromServer({
            totalXp: data.profile.total_xp,
            currentLevel: data.profile.current_level,
            dailyGoal: data.profile.daily_goal,
            currentStreak: data.profile.current_streak,
            longestStreak: data.profile.longest_streak,
            lastActivityDate: data.profile.last_activity_date,
            streakFreezes: data.profile.streak_freezes,
            hearts: data.profile.hearts,
            maxHearts: data.profile.max_hearts,
            dailyXp: data.daily.xp_earned,
            dailyGoalMet: data.daily.goal_met,
          })
        }
      } catch (error) {
        console.error('Failed to fetch gamification data:', error)
      }
    }

    fetchGamificationData()
  }, [isLoggedIn, syncFromServer])
}
