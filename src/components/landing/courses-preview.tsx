import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CoursesPreview() {
  const t = useTranslations('landing.courses')
  const locale = useLocale()

  // Preview courses - these match what will be in the database
  const courses = [
    {
      slug: 'web-basics',
      icon: '🌐',
      title_cs: 'Základy Webu',
      title_en: 'Web Basics',
      description_cs:
        'HTML, CSS a JavaScript - základní stavební kameny každého webu.',
      description_en:
        'HTML, CSS and JavaScript - the building blocks of every website.',
      lessons: 3,
    },
    {
      slug: 'react-essentials',
      icon: '⚛️',
      title_cs: 'React Essentials',
      title_en: 'React Essentials',
      description_cs:
        'Nauč se React - komponenty, props, state a základní hooky.',
      description_en:
        'Learn React - components, props, state and basic hooks.',
      lessons: 4,
    },
    {
      slug: 'nextjs-basics',
      icon: '▲',
      title_cs: 'Next.js Basics',
      title_en: 'Next.js Basics',
      description_cs:
        'Server komponenty, routing a vše co potřebuješ pro moderní web.',
      description_en:
        'Server components, routing and everything you need for modern web.',
      lessons: 3,
    },
  ]

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {courses.map((course) => (
            <Card key={course.slug} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{course.icon}</span>
                  <CardTitle className="text-lg">
                    {locale === 'cs' ? course.title_cs : course.title_en}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {locale === 'cs'
                    ? course.description_cs
                    : course.description_en}
                </p>
                <p className="text-xs text-muted-foreground">
                  {course.lessons}{' '}
                  {locale === 'cs' ? 'lekcí' : 'lessons'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/learn">
              {locale === 'cs' ? 'Zobrazit všechny kurzy' : 'View all courses'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
