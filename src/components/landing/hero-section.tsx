import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Code2, ArrowRight } from 'lucide-react'

export function HeroSection() {
  const t = useTranslations('landing.hero')

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8">
            <Code2 className="h-4 w-4" />
            <span className="text-sm font-medium">Know Your Code</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {t('title')}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                {t('cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/learn">{t('secondaryCta')}</Link>
            </Button>
          </div>
        </div>

        {/* Decorative code snippet */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="rounded-lg bg-zinc-950 text-zinc-50 p-6 font-mono text-sm overflow-hidden shadow-2xl">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <pre className="text-xs md:text-sm">
              <code>
                <span className="text-purple-400">const</span>{' '}
                <span className="text-blue-400">Button</span> = ({'{'}
                <span className="text-orange-400"> children </span>{'}'}) {'=> '}
                {'{\n'}
                {'  '}
                <span className="text-purple-400">return</span> (
                {'\n    <'}
                <span className="text-green-400">button</span>{' '}
                <span className="text-blue-300">className</span>=
                <span className="text-yellow-300">"btn"</span>
                {'>\n'}
                {'      {'}
                <span className="text-orange-400">children</span>
                {'}\n'}
                {'    </'}
                <span className="text-green-400">button</span>
                {'>\n  );\n}'};
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
    </section>
  )
}
