import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'

type UserProgressInsert = Database['public']['Tables']['user_progress']['Insert']

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { lessonId, quizScore } = body

    if (!lessonId) {
      return NextResponse.json(
        { error: 'lessonId is required' },
        { status: 400 }
      )
    }

    const progressData: UserProgressInsert = {
      user_id: user.id,
      lesson_id: lessonId,
      completed: true,
      quiz_score: quizScore,
      completed_at: new Date().toISOString(),
    }

    // Upsert progress
    const { data, error } = await supabase
      .from('user_progress')
      .upsert(progressData as never, {
        onConflict: 'user_id,lesson_id',
      })
      .select()
      .single()

    if (error) {
      console.error('Progress save error:', error)
      return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Progress API error:', error)
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

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    return NextResponse.json({ progress: data })
  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
