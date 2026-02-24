import { useTranslations } from 'next-intl'
import { Code2 } from 'lucide-react'

export function Footer() {
  const t = useTranslations('common')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Code2 className="h-5 w-5" />
            <span className="font-medium">{t('appName')}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {year} {t('appName')}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
