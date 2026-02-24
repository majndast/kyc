import { setRequestLocale } from 'next-intl/server'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { CoursesPreview } from '@/components/landing/courses-preview'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CoursesPreview />
    </>
  )
}
