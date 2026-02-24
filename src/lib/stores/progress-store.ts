import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LessonProgress {
  lessonId: string
  completed: boolean
  quizScore: number | null
  completedAt: string | null
}

interface ProgressState {
  progress: Record<string, LessonProgress>
  setLessonProgress: (lessonId: string, data: Partial<LessonProgress>) => void
  markLessonCompleted: (lessonId: string, quizScore?: number) => void
  getLessonProgress: (lessonId: string) => LessonProgress | undefined
  getCourseProgress: (lessonIds: string[]) => {
    completed: number
    total: number
    percentage: number
  }
  syncFromServer: (serverProgress: LessonProgress[]) => void
  reset: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},

      setLessonProgress: (lessonId, data) =>
        set((state) => {
          const existing = state.progress[lessonId] || {
            lessonId,
            completed: false,
            quizScore: null,
            completedAt: null,
          }
          return {
            progress: {
              ...state.progress,
              [lessonId]: {
                ...existing,
                ...data,
                lessonId, // Ensure lessonId is always correct
              },
            },
          }
        }),

      markLessonCompleted: (lessonId, quizScore) =>
        set((state) => {
          const existing = state.progress[lessonId] || {
            lessonId,
            completed: false,
            quizScore: null,
            completedAt: null,
          }
          return {
            progress: {
              ...state.progress,
              [lessonId]: {
                ...existing,
                completed: true,
                quizScore: quizScore ?? existing.quizScore,
                completedAt: new Date().toISOString(),
                lessonId,
              },
            },
          }
        }),

      getLessonProgress: (lessonId) => get().progress[lessonId],

      getCourseProgress: (lessonIds) => {
        const { progress } = get()
        const completed = lessonIds.filter(
          (id) => progress[id]?.completed
        ).length
        const total = lessonIds.length
        return {
          completed,
          total,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        }
      },

      syncFromServer: (serverProgress) =>
        set((state) => {
          const newProgress = { ...state.progress }
          serverProgress.forEach((p) => {
            newProgress[p.lessonId] = p
          })
          return { progress: newProgress }
        }),

      reset: () => set({ progress: {} }),
    }),
    {
      name: 'kyc-progress',
    }
  )
)
