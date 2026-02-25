import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { calculateLevel, getXpProgress } from '@/lib/gamification/xp-config'

interface XpGainEvent {
  id: string
  amount: number
  source: string
  timestamp: number
}

interface GamificationState {
  // Hydration state
  _hasHydrated: boolean

  // XP & Level
  totalXp: number
  currentLevel: number

  // Daily progress
  dailyXp: number
  dailyGoal: number
  dailyGoalMet: boolean
  lastDailyReset: string | null

  // Streaks
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  streakFreezes: number

  // Hearts
  hearts: number
  maxHearts: number
  lastHeartRegen: string | null

  // UI state
  pendingXpGains: XpGainEvent[]
  showLevelUpModal: boolean
  newLevel: number | null

  // Actions
  setHasHydrated: (state: boolean) => void
  addXp: (amount: number, source: string) => void
  consumeXpGain: (id: string) => void
  setDailyGoal: (goal: number) => void
  updateStreak: (newStreak: number, longestStreak: number, date: string) => void
  useStreakFreeze: () => boolean
  loseHeart: () => boolean
  regenerateHeart: () => void
  closeLevelUpModal: () => void
  syncFromServer: (data: Partial<GamificationState>) => void
  checkDailyReset: () => void
  reset: () => void
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

const initialState = {
  _hasHydrated: false,
  totalXp: 0,
  currentLevel: 1,
  dailyXp: 0,
  dailyGoal: 20,
  dailyGoalMet: false,
  lastDailyReset: null,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  streakFreezes: 0,
  hearts: 5,
  maxHearts: 5,
  lastHeartRegen: null,
  pendingXpGains: [],
  showLevelUpModal: false,
  newLevel: null,
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      addXp: (amount: number, source: string) =>
        set((state) => {
          const today = getTodayString()

          // Check if we need to reset daily progress
          if (state.lastDailyReset !== today) {
            state.dailyXp = 0
            state.dailyGoalMet = false
          }

          const newTotalXp = state.totalXp + amount
          const newDailyXp = state.dailyXp + amount
          const newLevel = calculateLevel(newTotalXp)
          const leveledUp = newLevel > state.currentLevel
          const goalMet = newDailyXp >= state.dailyGoal

          const xpGainEvent: XpGainEvent = {
            id: generateId(),
            amount,
            source,
            timestamp: Date.now(),
          }

          return {
            totalXp: newTotalXp,
            currentLevel: newLevel,
            dailyXp: newDailyXp,
            dailyGoalMet: goalMet || state.dailyGoalMet,
            lastDailyReset: today,
            pendingXpGains: [...state.pendingXpGains, xpGainEvent],
            showLevelUpModal: leveledUp,
            newLevel: leveledUp ? newLevel : state.newLevel,
          }
        }),

      consumeXpGain: (id: string) =>
        set((state) => ({
          pendingXpGains: state.pendingXpGains.filter((g) => g.id !== id),
        })),

      setDailyGoal: (goal: number) =>
        set({ dailyGoal: goal }),

      updateStreak: (newStreak: number, longestStreak: number, date: string) =>
        set({
          currentStreak: newStreak,
          longestStreak,
          lastActivityDate: date,
        }),

      useStreakFreeze: () => {
        const state = get()
        if (state.streakFreezes <= 0) return false
        set({ streakFreezes: state.streakFreezes - 1 })
        return true
      },

      loseHeart: () => {
        const state = get()
        if (state.hearts <= 0) return false
        set({ hearts: state.hearts - 1 })
        return true
      },

      regenerateHeart: () =>
        set((state) => ({
          hearts: Math.min(state.hearts + 1, state.maxHearts),
          lastHeartRegen: new Date().toISOString(),
        })),

      closeLevelUpModal: () =>
        set({ showLevelUpModal: false, newLevel: null }),

      syncFromServer: (data: Partial<GamificationState>) =>
        set((state) => ({
          ...state,
          ...data,
          // Recalculate level from totalXp if provided
          currentLevel: data.totalXp ? calculateLevel(data.totalXp) : state.currentLevel,
        })),

      checkDailyReset: () => {
        const state = get()
        const today = getTodayString()
        if (state.lastDailyReset !== today) {
          set({
            dailyXp: 0,
            dailyGoalMet: false,
            lastDailyReset: today,
          })
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: 'kyc-gamification',
      partialize: (state) => ({
        // Only persist these fields - exclude _hasHydrated, UI state, and actions
        totalXp: state.totalXp,
        currentLevel: state.currentLevel,
        dailyXp: state.dailyXp,
        dailyGoal: state.dailyGoal,
        dailyGoalMet: state.dailyGoalMet,
        lastDailyReset: state.lastDailyReset,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastActivityDate: state.lastActivityDate,
        streakFreezes: state.streakFreezes,
        hearts: state.hearts,
        maxHearts: state.maxHearts,
        lastHeartRegen: state.lastHeartRegen,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

// Selectors
export const selectXpProgress = (state: GamificationState) =>
  getXpProgress(state.totalXp, state.currentLevel)

export const selectDailyProgress = (state: GamificationState) => ({
  current: state.dailyXp,
  goal: state.dailyGoal,
  percentage: Math.min(100, Math.round((state.dailyXp / state.dailyGoal) * 100)),
  met: state.dailyGoalMet,
})
