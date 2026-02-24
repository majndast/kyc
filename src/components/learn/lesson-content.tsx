'use client'

import { useMemo } from 'react'
import { CodeBlock } from './code-block'

interface LessonContentProps {
  content: string
}

export function LessonContent({ content }: LessonContentProps) {
  const renderedContent = useMemo(() => {
    // Simple markdown-like parsing
    const parts: React.ReactNode[] = []
    const lines = content.split('\n')
    let i = 0
    let key = 0

    while (i < lines.length) {
      const line = lines[i]

      // Code block
      if (line.startsWith('```')) {
        const language = line.slice(3).trim() || 'javascript'
        const codeLines: string[] = []
        i++
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i])
          i++
        }
        parts.push(
          <CodeBlock
            key={key++}
            code={codeLines.join('\n')}
            language={language}
            className="my-4"
          />
        )
        i++
        continue
      }

      // Heading 2
      if (line.startsWith('## ')) {
        parts.push(
          <h2 key={key++} className="text-2xl font-bold mt-8 mb-4">
            {line.slice(3)}
          </h2>
        )
        i++
        continue
      }

      // Heading 3
      if (line.startsWith('### ')) {
        parts.push(
          <h3 key={key++} className="text-xl font-semibold mt-6 mb-3">
            {line.slice(4)}
          </h3>
        )
        i++
        continue
      }

      // Unordered list
      if (line.startsWith('- ')) {
        const listItems: string[] = []
        while (i < lines.length && lines[i].startsWith('- ')) {
          listItems.push(lines[i].slice(2))
          i++
        }
        parts.push(
          <ul key={key++} className="list-disc list-inside my-4 space-y-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-muted-foreground">
                {parseInlineStyles(item)}
              </li>
            ))}
          </ul>
        )
        continue
      }

      // Ordered list
      if (/^\d+\. /.test(line)) {
        const listItems: string[] = []
        while (i < lines.length && /^\d+\. /.test(lines[i])) {
          listItems.push(lines[i].replace(/^\d+\. /, ''))
          i++
        }
        parts.push(
          <ol key={key++} className="list-decimal list-inside my-4 space-y-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-muted-foreground">
                {parseInlineStyles(item)}
              </li>
            ))}
          </ol>
        )
        continue
      }

      // Blockquote
      if (line.startsWith('> ')) {
        parts.push(
          <blockquote
            key={key++}
            className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground"
          >
            {parseInlineStyles(line.slice(2))}
          </blockquote>
        )
        i++
        continue
      }

      // Empty line
      if (line.trim() === '') {
        i++
        continue
      }

      // Regular paragraph
      parts.push(
        <p key={key++} className="my-4 leading-relaxed text-muted-foreground">
          {parseInlineStyles(line)}
        </p>
      )
      i++
    }

    return parts
  }, [content])

  return <div className="prose-custom">{renderedContent}</div>
}

function parseInlineStyles(text: string): React.ReactNode {
  // Parse inline code, bold, and italic
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Inline code
    const codeMatch = remaining.match(/`([^`]+)`/)
    // Bold
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)
    // Italic
    const italicMatch = remaining.match(/\*([^*]+)\*/)

    // Find the earliest match
    const matches = [
      { match: codeMatch, type: 'code' },
      { match: boldMatch, type: 'bold' },
      { match: italicMatch, type: 'italic' },
    ]
      .filter((m) => m.match)
      .sort((a, b) => a.match!.index! - b.match!.index!)

    if (matches.length === 0) {
      parts.push(remaining)
      break
    }

    const earliest = matches[0]
    const match = earliest.match!
    const index = match.index!

    // Add text before match
    if (index > 0) {
      parts.push(remaining.slice(0, index))
    }

    // Add styled element
    if (earliest.type === 'code') {
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-sm"
        >
          {match[1]}
        </code>
      )
    } else if (earliest.type === 'bold') {
      parts.push(
        <strong key={key++} className="font-semibold text-foreground">
          {match[1]}
        </strong>
      )
    } else if (earliest.type === 'italic') {
      parts.push(<em key={key++}>{match[1]}</em>)
    }

    remaining = remaining.slice(index + match[0].length)
  }

  return parts
}
