import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Code, TrendingUp } from 'lucide-react'

export function FeaturesSection() {
  const t = useTranslations('landing.features')

  const features = [
    {
      icon: BookOpen,
      title: t('interactive.title'),
      description: t('interactive.description'),
    },
    {
      icon: Code,
      title: t('practical.title'),
      description: t('practical.description'),
    },
    {
      icon: TrendingUp,
      title: t('progress.title'),
      description: t('progress.description'),
    },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
