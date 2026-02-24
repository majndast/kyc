import { setRequestLocale, getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { CourseCard } from '@/components/learn/course-card'
import { Course } from '@/lib/supabase/types'

interface LearnPageProps {
  params: Promise<{ locale: string }>
}

interface CourseWithLessonIds extends Course {
  lessons: { id: string }[]
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('learn')

  const supabase = await createClient()

  const coursesResult = await supabase
    .from('courses')
    .select(
      `
      *,
      lessons (id)
    `
    )
    .order('order_index')

  const courses = (coursesResult.data || []) as CourseWithLessonIds[]

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let progressMap: Record<string, number> = {}

  if (user) {
    const progressResult = await supabase
      .from('user_progress')
      .select('lesson_id, completed')
      .eq('user_id', user.id)
      .eq('completed', true)

    const progress = (progressResult.data || []) as { lesson_id: string; completed: boolean }[]
    progress.forEach((p) => {
      progressMap[p.lesson_id] = 1
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const lessonIds = course.lessons?.map((l) => l.id) || []
          const completedCount = lessonIds.filter(
            (id) => progressMap[id]
          ).length

          return (
            <CourseCard
              key={course.id}
              course={course}
              locale={locale as 'cs' | 'en'}
              completedLessons={completedCount}
              totalLessons={lessonIds.length}
            />
          )
        })}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No courses available yet. Check back soon!</p>
        </div>
      )}
    </div>
  )
}
