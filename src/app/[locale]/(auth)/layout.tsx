import { Link } from '@/lib/i18n/navigation'
import { Code2 } from 'lucide-react'
import { LanguageSwitcher } from '@/components/shared/language-switcher'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Code2 className="h-6 w-6" />
          <span>Know Your Code</span>
        </Link>
        <LanguageSwitcher />
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  )
}
