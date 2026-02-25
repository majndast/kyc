'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/lib/i18n/navigation'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from './language-switcher'
import { Code2, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  user?: { email: string } | null
  showAuthButtons?: boolean
}

export function Header({ user, showAuthButtons = true }: HeaderProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/learn', label: t('nav.learn') },
  ]

  if (user) {
    navItems.push({ href: '/profile', label: t('nav.profile') })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Code2 className="h-6 w-6" />
            <span className="hidden sm:inline">{t('common.appName')}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {showAuthButtons && (
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <form action="/api/auth/signout" method="POST">
                  <Button variant="ghost" size="sm" type="submit">
                    {t('nav.logout')}
                  </Button>
                </form>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">{t('nav.login')}</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">{t('nav.register')}</Link>
                  </Button>
                </>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container mx-auto flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname === item.href
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {showAuthButtons && !user && (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
            {showAuthButtons && user && (
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                >
                  {t('nav.logout')}
                </button>
              </form>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
