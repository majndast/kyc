'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CodeBlock } from './code-block'
import { Confetti } from '@/components/ui/confetti'
import { QuizQuestion, QuizOption } from '@/lib/supabase/types'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, ArrowRight, Trophy, Zap, Heart, Sparkles } from 'lucide-react'
import { useGamificationStore } from '@/lib/stores/gamification-store'
import { calculateXpForQuiz } from '@/lib/gamification/xp-config'
import { playSound } from '@/lib/sounds/sound-manager'

interface QuizProps {
  questions: QuizQuestion[]
  lessonId: string
  locale: 'cs' | 'en'
  isLoggedIn: boolean
  initialCompleted: boolean
  initialScore: number | null
  nextLessonSlug?: string
  courseSlug: string
}

export function Quiz({
  questions,
  lessonId,
  locale,
  isLoggedIn,
  initialCompleted,
  initialScore,
  nextLessonSlug,
  courseSlug,
}: QuizProps) {
  const t = useTranslations('quiz')

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [isCompleted, setIsCompleted] = useState(initialCompleted)
  const [finalScore, setFinalScore] = useState(initialScore)
  const [saving, setSaving] = useState(false)
  const [xpEarned, setXpEarned] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [hearts, setHearts] = useState(5)
  const [shake, setShake] = useState(false)

  const addXp = useGamificationStore((state) => state.addXp)

  const question = questions[currentQuestion]
  const options = question.options as QuizOption[]
  const questionText = locale === 'cs' ? question.question_cs : question.question_en
  const explanation =
    locale === 'cs' ? question.explanation_cs : question.explanation_en

  const progress = ((currentQuestion + (isAnswered ? 1 : 0)) / questions.length) * 100

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return
    playSound('click')
    setSelectedAnswer(index)
  }

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = options[selectedAnswer].is_correct
    setIsAnswered(true)

    if (isCorrect) {
      playSound('correct')
      setCorrectAnswers((prev) => prev + 1)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1500)
    } else {
      playSound('wrong')
      setHearts((prev) => Math.max(0, prev - 1))
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  const handleNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      // Quiz finished
      const score = Math.round(
        ((correctAnswers + (options[selectedAnswer!].is_correct ? 1 : 0)) /
          questions.length) *
          100
      )
      setFinalScore(score)
      setIsCompleted(true)

      // Play completion sound
      playSound('complete')
      setShowConfetti(true)

      // Calculate XP earned
      const earnedXp = calculateXpForQuiz(score)
      setXpEarned(earnedXp)

      // Save progress if logged in
      if (isLoggedIn) {
        setSaving(true)
        try {
          await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lessonId, quizScore: score }),
          })

          const xpResponse = await fetch('/api/gamification/earn-xp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lessonId,
              quizScore: score,
              source: 'quiz_complete',
            }),
          })

          if (xpResponse.ok) {
            const xpData = await xpResponse.json()
            addXp(xpData.data.totalXpGained, 'quiz')
          }
        } catch (error) {
          console.error('Failed to save progress:', error)
        }
        setSaving(false)
      } else {
        addXp(earnedXp, 'quiz')
      }
    }
  }

  // Completed state
  if (isCompleted && finalScore !== null) {
    const isPerfect = finalScore === 100
    const isGood = finalScore >= 70

    return (
      <>
        <Confetti active={showConfetti} />
        <Card className="overflow-hidden">
          <div className={cn(
            'h-2',
            isPerfect ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500' :
            isGood ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
            'bg-gradient-to-r from-blue-400 to-indigo-500'
          )} />
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className={cn(
              'mx-auto w-24 h-24 rounded-full flex items-center justify-center',
              isPerfect ? 'bg-yellow-100 dark:bg-yellow-900/30' :
              isGood ? 'bg-green-100 dark:bg-green-900/30' :
              'bg-blue-100 dark:bg-blue-900/30'
            )}>
              {isPerfect ? (
                <Sparkles className="h-12 w-12 text-yellow-500 animate-pulse" />
              ) : (
                <Trophy className={cn(
                  'h-12 w-12',
                  isGood ? 'text-green-500' : 'text-blue-500'
                )} />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">{t('results.title')}</h2>
              <div className={cn(
                'text-5xl font-bold mb-2',
                isPerfect ? 'text-yellow-500' :
                isGood ? 'text-green-500' :
                'text-blue-500'
              )}>
                {finalScore}%
              </div>
              <p className="text-muted-foreground text-lg">
                {isPerfect
                  ? t('results.perfect')
                  : isGood
                  ? t('results.good')
                  : t('results.needsWork')}
              </p>
            </div>

            {xpEarned !== null && (
              <div className="flex items-center justify-center">
                <div className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xl',
                  'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
                  'animate-xp-pop'
                )}>
                  <Zap className="h-6 w-6 fill-current" />
                  <span>+{xpEarned} XP</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              {nextLessonSlug && (
                <Button size="lg" asChild className="text-lg px-8">
                  <Link href={`/learn/${courseSlug}/${nextLessonSlug}`}>
                    {locale === 'cs' ? 'Další lekce' : 'Next Lesson'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="lg" asChild>
                <Link href={`/learn/${courseSlug}`}>
                  {locale === 'cs' ? 'Zpět na kurz' : 'Back to course'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <Confetti active={showConfetti} duration={1500} />
      <Card className={cn(shake && 'animate-heart-shake')}>
        {/* Progress header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              {t('question', {
                current: currentQuestion + 1,
                total: questions.length,
              })}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Heart
                  key={i}
                  className={cn(
                    'h-5 w-5 transition-all',
                    i < hearts
                      ? 'text-red-500 fill-red-500'
                      : 'text-gray-300 dark:text-gray-600'
                  )}
                />
              ))}
            </div>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Question */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold leading-relaxed">{questionText}</h3>
            {question.code_snippet && (
              <CodeBlock code={question.code_snippet} className="my-4" />
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {options.map((option, index) => {
              const optionText = locale === 'cs' ? option.text_cs : option.text_en
              const isSelected = selectedAnswer === index
              const isCorrect = option.is_correct

              let optionStyle = 'border-2 border-border hover:border-primary hover:bg-accent'

              if (isAnswered) {
                if (isCorrect) {
                  optionStyle = 'border-2 border-green-500 bg-green-50 dark:bg-green-900/20'
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'border-2 border-red-500 bg-red-50 dark:bg-red-900/20'
                } else {
                  optionStyle = 'border-2 border-border opacity-50'
                }
              } else if (isSelected) {
                optionStyle = 'border-2 border-primary bg-primary/5'
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={isAnswered}
                  className={cn(
                    'w-full p-4 rounded-xl text-left transition-all duration-200',
                    'flex items-center justify-between gap-4',
                    optionStyle,
                    !isAnswered && 'cursor-pointer active:scale-[0.98]',
                    isAnswered && 'cursor-default'
                  )}
                >
                  <span className="font-medium">{optionText}</span>
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {isAnswered && explanation && (
            <div className={cn(
              'p-4 rounded-xl',
              options[selectedAnswer!]?.is_correct
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
            )}>
              <p className="font-medium mb-1">{t('explanation')}:</p>
              <p className="text-muted-foreground">{explanation}</p>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            {!isAnswered ? (
              <Button
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
                size="lg"
                className="w-full text-lg h-14"
              >
                {t('checkAnswer')}
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={saving}
                size="lg"
                className={cn(
                  'w-full text-lg h-14',
                  options[selectedAnswer!]?.is_correct
                    ? 'bg-green-500 hover:bg-green-600'
                    : ''
                )}
              >
                {currentQuestion < questions.length - 1
                  ? t('nextQuestion')
                  : t('finish')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
