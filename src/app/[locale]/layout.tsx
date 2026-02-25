import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, Locale } from '@/lib/i18n'
import { ClientProviders } from '@/components/providers/client-providers'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <ClientProviders>
        {children}
      </ClientProviders>
    </NextIntlClientProvider>
  )
}
