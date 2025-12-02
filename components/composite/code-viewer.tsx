"use client"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { cn } from "@/lib/utils"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CodeViewerProps {
  code: string
  language?: string
  className?: string
}

export function CodeViewer({
  code,
  language = "tsx",
  className,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("rounded-lg overflow-hidden border border-border", className)}>
      <div className="flex items-center justify-between bg-background px-4 py-2 border-b">
        <span className="text-xs font-medium text-foreground uppercase">
          {language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 gap-1.5"
        >
          {copied ? (
            <>
              <Check className="size-3" />
              <span className="text-xs">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span className="text-xs">Copiar</span>
            </>
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          background: "#1e1e1e",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
        showLineNumbers
        wrapLines
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

