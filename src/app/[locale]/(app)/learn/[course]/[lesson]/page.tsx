import { setRequestLocale, getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Link } from '@/lib/i18n/navigation'
import { LessonContent } from '@/components/learn/lesson-content'
import { Quiz } from '@/components/learn/quiz'
import { ArrowLeft } from 'lucide-react'
import { Course, Lesson, QuizQuestion, UserProgress } from '@/lib/supabase/types'

interface LessonPageProps {
  params: Promise<{ locale: string; course: string; lesson: string }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { locale, course: courseSlug, lesson: lessonSlug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('learn')

  const supabase = await createClient()

  // Fetch course
  const courseResult = await supabase
    .from('courses')
    .select('*')
    .eq('slug', courseSlug)
    .single()

  const course = courseResult.data as Course | null
  if (!course) {
    return notFound()
  }

  // Fetch lesson
  const lessonResult = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .eq('slug', lessonSlug)
    .single()

  const lesson = lessonResult.data as Lesson | null
  if (!lesson) {
    return notFound()
  }

  // Fetch quiz questions
  const { data: quizQuestionsData } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('lesson_id', lesson.id)
    .order('order_index')

  const quizQuestions = (quizQuestionsData || []) as QuizQuestion[]

  // Check user progress
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isCompleted = false
  let quizScore: number | null = null

  if (user) {
    const progressResult = await supabase
      .from('user_progress')
      .select('completed, quiz_score')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson.id)
      .single()

    const progress = progressResult.data as Pick<UserProgress, 'completed' | 'quiz_score'> | null
    if (progress) {
      isCompleted = progress.completed
      quizScore = progress.quiz_score
    }
  }

  // Get next lesson
  const { data: nextLessonData } = await supabase
    .from('lessons')
    .select('slug')
    .eq('course_id', course.id)
    .gt('order_index', lesson.order_index)
    .order('order_index')
    .limit(1)
    .single()

  const nextLesson = nextLessonData as { slug: string } | null

  const title = locale === 'cs' ? lesson.title_cs : lesson.title_en
  const content = locale === 'cs' ? lesson.content_cs : lesson.content_en
  const courseTitle = locale === 'cs' ? course.title_cs : course.title_en

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href={`/learn/${courseSlug}`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('backToCourse')}: {courseTitle}
      </Link>

      <article>
        <h1 className="text-3xl font-bold mb-6">{title}</h1>

        <LessonContent content={content} />

        {quizQuestions.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <Quiz
              questions={quizQuestions}
              lessonId={lesson.id}
              locale={locale as 'cs' | 'en'}
              isLoggedIn={!!user}
              initialCompleted={isCompleted}
              initialScore={quizScore}
              nextLessonSlug={nextLesson?.slug}
              courseSlug={courseSlug}
            />
          </div>
        )}
      </article>
    </div>
  )
}
