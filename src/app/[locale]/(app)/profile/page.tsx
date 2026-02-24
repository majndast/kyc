import { setRequestLocale, getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from '@/lib/i18n/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Trophy, Target } from 'lucide-react'
import { Course } from '@/lib/supabase/types'

interface ProfilePageProps {
  params: Promise<{ locale: string }>
}

interface CourseWithLessonIds extends Course {
  lessons: { id: string }[]
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('profile')

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect({ href: '/login', locale })
    return null
  }

  // Fetch all courses with lessons
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

  // Fetch user progress
  const progressResult = await supabase
    .from('user_progress')
    .select('lesson_id, completed, quiz_score')
    .eq('user_id', user.id)
    .eq('completed', true)

  const progress = (progressResult.data || []) as { lesson_id: string; completed: boolean; quiz_score: number | null }[]

  const completedLessonIds = new Set(progress.map((p) => p.lesson_id))
  const totalLessons = courses.reduce(
    (sum, c) => sum + (c.lessons?.length || 0),
    0
  )
  const completedTotal = completedLessonIds.size
  const averageScore =
    progress.length > 0
      ? Math.round(
          progress.reduce((sum, p) => sum + (p.quiz_score || 0), 0) /
            progress.length
        )
      : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('completedLessons')}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedTotal} / {totalLessons}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('totalProgress')}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalLessons > 0
                ? Math.round((completedTotal / totalLessons) * 100)
                : 0}
              %
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Quiz Score
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">{t('progress')}</h2>

        {courses.map((course) => {
          const lessonIds = course.lessons?.map((l) => l.id) || []
          const courseCompleted = lessonIds.filter((id) =>
            completedLessonIds.has(id)
          ).length
          const courseProgress =
            lessonIds.length > 0
              ? Math.round((courseCompleted / lessonIds.length) * 100)
              : 0
          const title = locale === 'cs' ? course.title_cs : course.title_en

          return (
            <Card key={course.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {course.icon && <span>{course.icon}</span>}
                    <span className="font-medium">{title}</span>
                  </div>
                  <Badge variant={courseProgress === 100 ? 'default' : 'secondary'}>
                    {courseCompleted} / {lessonIds.length}
                  </Badge>
                </div>
                <Progress value={courseProgress} className="h-2" />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
