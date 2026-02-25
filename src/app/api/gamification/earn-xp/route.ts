import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateXpForQuiz, XP_VALUES, calculateLevel } from '@/lib/gamification/xp-config'
import { calculateStreakUpdate } from '@/lib/gamification/streak-service'
import { Database } from '@/lib/supabase/types'

type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type DailyXpInsert = Database['public']['Tables']['daily_xp']['Insert']
type XpTransactionInsert = Database['public']['Tables']['xp_transactions']['Insert']
type UserProgressUpdate = Database['public']['Tables']['user_progress']['Update']

interface EarnXpRequest {
  lessonId?: string
  quizScore?: number
  source: 'lesson_complete' | 'quiz_complete'
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: EarnXpRequest = await request.json()
    const { lessonId, quizScore, source } = body

    if (!source) {
      return NextResponse.json(
        { error: 'source is required' },
        { status: 400 }
      )
    }

    // Calculate XP amount
    let xpAmount = 0
    let xpSource = ''

    if (source === 'quiz_complete' && quizScore !== undefined) {
      xpAmount = calculateXpForQuiz(quizScore)
      xpSource = quizScore === 100 ? 'quiz_perfect' : quizScore >= 70 ? 'quiz_good' : 'quiz_complete'
    } else if (source === 'lesson_complete') {
      xpAmount = XP_VALUES.LESSON_COMPLETE
      xpSource = 'lesson_complete'
    }

    if (xpAmount === 0) {
      return NextResponse.json(
        { error: 'Invalid source or score' },
        { status: 400 }
      )
    }

    // Get current user profile
    interface ProfileData {
      total_xp: number | null
      current_level: number | null
      current_streak: number | null
      longest_streak: number | null
      last_activity_date: string | null
      streak_freezes: number | null
    }
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('total_xp, current_level, current_streak, longest_streak, last_activity_date, streak_freezes')
      .eq('id', user.id)
      .single() as { data: ProfileData | null; error: { code: string } | null }

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    const currentProfile = profile || {
      total_xp: 0,
      current_level: 1,
      current_streak: 0,
      longest_streak: 0,
      last_activity_date: null,
      streak_freezes: 0,
    }

    // Calculate streak update
    const streakResult = calculateStreakUpdate({
      currentStreak: currentProfile.current_streak || 0,
      longestStreak: currentProfile.longest_streak || 0,
      lastActivityDate: currentProfile.last_activity_date,
      streakFreezes: currentProfile.streak_freezes || 0,
    })

    // Add streak bonus if streak was extended
    let streakBonus = 0
    if (streakResult.streakExtended && streakResult.newStreak > 1) {
      streakBonus = XP_VALUES.STREAK_BONUS * Math.min(streakResult.newStreak, 10)
    }

    const totalXpGained = xpAmount + streakBonus
    const newTotalXp = (currentProfile.total_xp || 0) + totalXpGained
    const newLevel = calculateLevel(newTotalXp)
    const leveledUp = newLevel > (currentProfile.current_level || 1)

    const today = new Date().toISOString().split('T')[0]

    // Update profile
    const profileData: ProfileInsert = {
      id: user.id,
      total_xp: newTotalXp,
      current_level: newLevel,
      current_streak: streakResult.newStreak,
      longest_streak: Math.max(currentProfile.longest_streak || 0, streakResult.newStreak),
      last_activity_date: today,
      streak_freezes: streakResult.freezeUsed
        ? (currentProfile.streak_freezes || 0) - 1
        : currentProfile.streak_freezes || 0,
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert(profileData as never, {
        onConflict: 'id',
      })

    if (updateError) {
      console.error('Profile update error:', updateError)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    // Record XP transaction
    const xpTransactionData: XpTransactionInsert = {
      user_id: user.id,
      amount: xpAmount,
      source: xpSource,
      source_id: lessonId || null,
    }
    await supabase
      .from('xp_transactions')
      .insert(xpTransactionData as never)

    if (streakBonus > 0) {
      const streakTransactionData: XpTransactionInsert = {
        user_id: user.id,
        amount: streakBonus,
        source: 'streak_bonus',
        source_id: null,
      }
      await supabase
        .from('xp_transactions')
        .insert(streakTransactionData as never)
    }

    // Update daily XP
    const { data: dailyData } = await supabase
      .from('daily_xp')
      .select('xp_earned')
      .eq('user_id', user.id)
      .eq('date', today)
      .single() as { data: { xp_earned: number } | null }

    const newDailyXp = (dailyData?.xp_earned || 0) + totalXpGained

    const dailyXpData: DailyXpInsert = {
      user_id: user.id,
      date: today,
      xp_earned: newDailyXp,
      goal_met: newDailyXp >= 20,
    }
    await supabase
      .from('daily_xp')
      .upsert(dailyXpData as never, {
        onConflict: 'user_id,date',
      })

    // Update user_progress if lessonId provided
    if (lessonId) {
      const progressUpdate: UserProgressUpdate = { xp_earned: xpAmount }
      await supabase
        .from('user_progress')
        .update(progressUpdate as never)
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
    }

    return NextResponse.json({
      success: true,
      data: {
        xpGained: xpAmount,
        streakBonus,
        totalXpGained,
        newTotalXp,
        newLevel,
        leveledUp,
        previousLevel: currentProfile.current_level || 1,
        streak: {
          current: streakResult.newStreak,
          extended: streakResult.streakExtended,
          broken: streakResult.streakBroken,
          isNewRecord: streakResult.isNewRecord,
          freezeUsed: streakResult.freezeUsed,
        },
      },
    })
  } catch (error) {
    console.error('Earn XP API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get profile gamification data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('total_xp, current_level, daily_goal, current_streak, longest_streak, last_activity_date, streak_freezes, hearts, max_hearts')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    // Get today's XP
    const today = new Date().toISOString().split('T')[0]
    const { data: dailyData } = await supabase
      .from('daily_xp')
      .select('xp_earned, goal_met')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    return NextResponse.json({
      profile: profile || {
        total_xp: 0,
        current_level: 1,
        daily_goal: 20,
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: null,
        streak_freezes: 0,
        hearts: 5,
        max_hearts: 5,
      },
      daily: dailyData || {
        xp_earned: 0,
        goal_met: false,
      },
    })
  } catch (error) {
    console.error('Get gamification data error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
