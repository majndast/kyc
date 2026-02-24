import { Link } from '@/lib/i18n/navigation'
import { useTranslations } from 'next-intl'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Course } from '@/lib/supabase/types'

interface CourseCardProps {
  course: Course
  locale: 'cs' | 'en'
  completedLessons: number
  totalLessons: number
}

export function CourseCard({
  course,
  locale,
  completedLessons,
  totalLessons,
}: CourseCardProps) {
  const t = useTranslations('learn')

  const title = locale === 'cs' ? course.title_cs : course.title_en
  const description =
    locale === 'cs' ? course.description_cs : course.description_en

  const progress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const isStarted = completedLessons > 0
  const isCompleted = completedLessons === totalLessons && totalLessons > 0

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          {course.icon && <span className="text-2xl">{course.icon}</span>}
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {isCompleted && (
              <Badge variant="default" className="mt-1">
                {t('completed')}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {description && (
          <CardDescription className="mb-4">{description}</CardDescription>
        )}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {t('progress', {
                completed: completedLessons,
                total: totalLessons,
              })}
            </span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/learn/${course.slug}`}>
            {isStarted ? t('continueCourse') : t('startCourse')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
