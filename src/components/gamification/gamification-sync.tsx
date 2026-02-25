'use client'

import { useEffect } from 'react'
import { useGamificationStore } from '@/lib/stores/gamification-store'

interface GamificationSyncProps {
  isLoggedIn: boolean
}

export function GamificationSync({ isLoggedIn }: GamificationSyncProps) {
  const syncFromServer = useGamificationStore((state) => state.syncFromServer)

  useEffect(() => {
    if (!isLoggedIn) return

    const fetchGamificationData = async () => {
      try {
        const response = await fetch('/api/gamification/earn-xp')
        if (response.ok) {
          const data = await response.json()
          syncFromServer({
            totalXp: data.profile.total_xp || 0,
            currentLevel: data.profile.current_level || 1,
            dailyGoal: data.profile.daily_goal || 20,
            currentStreak: data.profile.current_streak || 0,
            longestStreak: data.profile.longest_streak || 0,
            lastActivityDate: data.profile.last_activity_date,
            streakFreezes: data.profile.streak_freezes || 0,
            hearts: data.profile.hearts || 5,
            maxHearts: data.profile.max_hearts || 5,
            dailyXp: data.daily?.xp_earned || 0,
            dailyGoalMet: data.daily?.goal_met || false,
          })
        }
      } catch (error) {
        console.error('Failed to fetch gamification data:', error)
      }
    }

    fetchGamificationData()
  }, [isLoggedIn, syncFromServer])

  // This component doesn't render anything
  return null
}
