'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  showLineNumbers?: boolean
  className?: string
}

export function CodeBlock({
  code,
  language = 'javascript',
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.trim().split('\n')

  return (
    <div
      className={cn(
        'relative rounded-lg bg-zinc-950 text-zinc-50 overflow-hidden',
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
        <span className="text-xs text-zinc-400 uppercase">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="table-row">
                {showLineNumbers && (
                  <span className="table-cell pr-4 text-right text-zinc-600 select-none">
                    {i + 1}
                  </span>
                )}
                <span className="table-cell">{line || ' '}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}
