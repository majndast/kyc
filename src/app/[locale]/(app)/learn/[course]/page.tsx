import { setRequestLocale, getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Link } from '@/lib/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Circle, ArrowLeft } from 'lucide-react'
import { Course, Lesson } from '@/lib/supabase/types'

interface CoursePageProps {
  params: Promise<{ locale: string; course: string }>
}

interface CourseWithLessons extends Course {
  lessons: Lesson[]
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { locale, course: courseSlug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('learn')

  const supabase = await createClient()

  const courseResult = await supabase
    .from('courses')
    .select(
      `
      *,
      lessons (*)
    `
    )
    .eq('slug', courseSlug)
    .single()

  const course = courseResult.data as CourseWithLessons | null

  if (!course) {
    return notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let completedLessonIds: string[] = []

  if (user) {
    const progressResult = await supabase
      .from('user_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('completed', true)

    const progress = progressResult.data as { lesson_id: string }[] | null
    completedLessonIds = progress?.map((p) => p.lesson_id) || []
  }

  const lessons = course.lessons || []
  const sortedLessons = [...lessons].sort(
    (a, b) => a.order_index - b.order_index
  )
  const completedCount = sortedLessons.filter((l) =>
    completedLessonIds.includes(l.id)
  ).length
  const progressPercent =
    lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0

  const title = locale === 'cs' ? course.title_cs : course.title_en
  const description =
    locale === 'cs' ? course.description_cs : course.description_en

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('backToCourse')}
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {course.icon && <span className="text-3xl">{course.icon}</span>}
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        {description && (
          <p className="text-muted-foreground mb-4">{description}</p>
        )}

        <div className="flex items-center gap-4">
          <Progress value={progressPercent} className="flex-1 max-w-xs" />
          <span className="text-sm text-muted-foreground">
            {t('progress', { completed: completedCount, total: lessons.length })}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold mb-4">{t('lessonsInCourse')}</h2>

        {sortedLessons.map((lesson, index) => {
          const lessonTitle =
            locale === 'cs' ? lesson.title_cs : lesson.title_en
          const isCompleted = completedLessonIds.includes(lesson.id)

          return (
            <Link
              key={lesson.id}
              href={`/learn/${courseSlug}/${lesson.slug}`}
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t('lesson')} {index + 1}
                  </span>
                  {isCompleted && (
                    <Badge variant="secondary" className="text-xs">
                      {t('completed')}
                    </Badge>
                  )}
                </div>
                <h3 className="font-medium">{lessonTitle}</h3>
              </div>
              <Button variant="ghost" size="sm">
                {isCompleted ? t('continueLesson') : t('startLesson')}
              </Button>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
