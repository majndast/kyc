'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { CodeBlock } from './code-block'
import { QuizQuestion, QuizOption } from '@/lib/supabase/types'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, ArrowRight, Trophy, Zap } from 'lucide-react'
import { useGamificationStore } from '@/lib/stores/gamification-store'
import { calculateXpForQuiz } from '@/lib/gamification/xp-config'

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

  const addXp = useGamificationStore((state) => state.addXp)

  const question = questions[currentQuestion]
  const options = question.options as QuizOption[]
  const questionText = locale === 'cs' ? question.question_cs : question.question_en
  const explanation =
    locale === 'cs' ? question.explanation_cs : question.explanation_en

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = options[selectedAnswer].is_correct
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1)
    }
    setIsAnswered(true)
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

      // Calculate XP earned
      const earnedXp = calculateXpForQuiz(score)
      setXpEarned(earnedXp)

      // Save progress if logged in
      if (isLoggedIn) {
        setSaving(true)
        try {
          // Save progress
          await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lessonId, quizScore: score }),
          })

          // Earn XP
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
            // Update local store with total XP gained (including streak bonus)
            addXp(xpData.data.totalXpGained, xpData.data.xpGained === earnedXp ? 'quiz' : 'quiz_with_streak')
          }
        } catch (error) {
          console.error('Failed to save progress:', error)
        }
        setSaving(false)
      } else {
        // Still show XP animation for non-logged users (local only)
        addXp(earnedXp, 'quiz')
      }
    }
  }

  if (isCompleted && finalScore !== null) {
    return (
      <Card>
        <CardHeader className="text-center">
          <Trophy className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
          <CardTitle>{t('results.title')}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold">
            {t('results.score', { score: finalScore })}
          </div>
          <p className="text-muted-foreground">
            {finalScore === 100
              ? t('results.perfect')
              : finalScore >= 70
              ? t('results.good')
              : t('results.needsWork')}
          </p>

          {xpEarned !== null && (
            <div className="flex items-center justify-center gap-2 py-2">
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold text-lg">
                <Zap className="h-5 w-5 fill-current" />
                <span>+{xpEarned} XP</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            {nextLessonSlug && (
              <Button asChild>
                <Link href={`/learn/${courseSlug}/${nextLessonSlug}`}>
                  {t('nextQuestion')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={`/learn/${courseSlug}`}>
                {locale === 'cs' ? 'Zpět na kurz' : 'Back to course'}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle>{t('title')}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {t('question', {
              current: currentQuestion + 1,
              total: questions.length,
            })}
          </span>
        </div>
        <Progress
          value={((currentQuestion + 1) / questions.length) * 100}
          className="h-2"
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-lg font-medium">{questionText}</p>

          {question.code_snippet && (
            <CodeBlock code={question.code_snippet} className="my-4" />
          )}
        </div>

        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => setSelectedAnswer(parseInt(value))}
          disabled={isAnswered}
          className="space-y-3"
        >
          {options.map((option, index) => {
            const optionText = locale === 'cs' ? option.text_cs : option.text_en
            const isSelected = selectedAnswer === index
            const isCorrect = option.is_correct

            let borderClass = ''
            if (isAnswered) {
              if (isCorrect) {
                borderClass = 'border-green-500 bg-green-50 dark:bg-green-900/20'
              } else if (isSelected && !isCorrect) {
                borderClass = 'border-red-500 bg-red-50 dark:bg-red-900/20'
              }
            }

            return (
              <div
                key={index}
                className={cn(
                  'flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors',
                  !isAnswered && 'hover:bg-accent',
                  isSelected && !isAnswered && 'border-primary',
                  borderClass
                )}
                onClick={() => !isAnswered && setSelectedAnswer(index)}
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer"
                >
                  {optionText}
                </Label>
                {isAnswered && isCorrect && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            )
          })}
        </RadioGroup>

        {isAnswered && explanation && (
          <div className="p-4 rounded-lg bg-muted">
            <p className="font-medium mb-1">{t('explanation')}:</p>
            <p className="text-muted-foreground">{explanation}</p>
          </div>
        )}

        <div className="flex justify-end">
          {!isAnswered ? (
            <Button onClick={handleCheckAnswer} disabled={selectedAnswer === null}>
              {t('checkAnswer')}
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} disabled={saving}>
              {currentQuestion < questions.length - 1
                ? t('nextQuestion')
                : t('finish')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
