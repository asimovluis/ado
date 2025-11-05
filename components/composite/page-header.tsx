"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string | React.ReactNode
  backButtonText?: string
  onBack?: () => void
  rightActions?: React.ReactNode
}

export function PageHeader({ 
  title, 
  backButtonText = "Proyectos",
  onBack,
  rightActions 
}: PageHeaderProps) {
  return (
    <header
      className="border-b border-border bg-background flex items-center gap-5 p-4 w-full"
    >
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="size-5" />
          <span>{backButtonText}</span>
        </Button>
      )}
      <div className="flex flex-col gap-2 grow min-w-0">
        {typeof title === "string" ? (
          <h1 className="text-base font-semibold text-foreground leading-6">
            {title}
          </h1>
        ) : (
          <div className="text-base font-semibold text-foreground leading-6">
            {title}
          </div>
        )}
      </div>
      {rightActions}
    </header>
  )
}
