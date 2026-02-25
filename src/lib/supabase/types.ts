export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          locale: string
          created_at: string
          total_xp: number
          current_level: number
          daily_goal: number
          current_streak: number
          longest_streak: number
          last_activity_date: string | null
          streak_freezes: number
          hearts: number
          max_hearts: number
          last_heart_regen: string | null
        }
        Insert: {
          id: string
          locale?: string
          created_at?: string
          total_xp?: number
          current_level?: number
          daily_goal?: number
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string | null
          streak_freezes?: number
          hearts?: number
          max_hearts?: number
          last_heart_regen?: string | null
        }
        Update: {
          id?: string
          locale?: string
          created_at?: string
          total_xp?: number
          current_level?: number
          daily_goal?: number
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string | null
          streak_freezes?: number
          hearts?: number
          max_hearts?: number
          last_heart_regen?: string | null
        }
      }
      courses: {
        Row: {
          id: string
          slug: string
          title_cs: string
          title_en: string
          description_cs: string | null
          description_en: string | null
          icon: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title_cs: string
          title_en: string
          description_cs?: string | null
          description_en?: string | null
          icon?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title_cs?: string
          title_en?: string
          description_cs?: string | null
          description_en?: string | null
          icon?: string | null
          order_index?: number
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          slug: string
          title_cs: string
          title_en: string
          content_cs: string
          content_en: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          slug: string
          title_cs: string
          title_en: string
          content_cs: string
          content_en: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          slug?: string
          title_cs?: string
          title_en?: string
          content_cs?: string
          content_en?: string
          order_index?: number
          created_at?: string
        }
      }
      quiz_questions: {
        Row: {
          id: string
          lesson_id: string
          question_cs: string
          question_en: string
          code_snippet: string | null
          options: QuizOption[]
          explanation_cs: string | null
          explanation_en: string | null
          order_index: number
        }
        Insert: {
          id?: string
          lesson_id: string
          question_cs: string
          question_en: string
          code_snippet?: string | null
          options: QuizOption[]
          explanation_cs?: string | null
          explanation_en?: string | null
          order_index?: number
        }
        Update: {
          id?: string
          lesson_id?: string
          question_cs?: string
          question_en?: string
          code_snippet?: string | null
          options?: QuizOption[]
          explanation_cs?: string | null
          explanation_en?: string | null
          order_index?: number
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          quiz_score: number | null
          completed_at: string | null
          xp_earned: number
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          quiz_score?: number | null
          completed_at?: string | null
          xp_earned?: number
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          quiz_score?: number | null
          completed_at?: string | null
          xp_earned?: number
        }
      }
      daily_xp: {
        Row: {
          id: string
          user_id: string
          date: string
          xp_earned: number
          goal_met: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          xp_earned?: number
          goal_met?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          xp_earned?: number
          goal_met?: boolean
          created_at?: string
        }
      }
      xp_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          source: string
          source_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          source: string
          source_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          source?: string
          source_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export interface QuizOption {
  text_cs: string
  text_en: string
  is_correct: boolean
}

// Helper types for easier usage
export type Course = Database['public']['Tables']['courses']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type QuizQuestion = Database['public']['Tables']['quiz_questions']['Row']
export type UserProgress = Database['public']['Tables']['user_progress']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type DailyXp = Database['public']['Tables']['daily_xp']['Row']
export type XpTransaction = Database['public']['Tables']['xp_transactions']['Row']

// Extended types with relations
export interface CourseWithLessons extends Course {
  lessons: Lesson[]
}

export interface LessonWithQuiz extends Lesson {
  quiz_questions: QuizQuestion[]
}
