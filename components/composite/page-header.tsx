"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare, MoreVertical, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { ViabilizacionSummaryDialog } from "@/components/composite/viabilizacion-summary-dialog"

interface PageHeaderProps {
  title: string | React.ReactNode
  backButtonText?: string
  onBack?: () => void
  rightActions?: React.ReactNode
  federacionName?: string
}

export function PageHeader({ 
  title, 
  backButtonText = "Proyectos",
  onBack,
  rightActions,
  federacionName = "Atletismo"
}: PageHeaderProps) {
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false)

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
      <div className="flex flex-col gap-0 grow min-w-0">
        {federacionName && (
          <p className="text-sm font-medium text-foreground leading-5">
            {federacionName}
          </p>
        )}
        <div className="flex items-center gap-2">
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
      </div>
      {rightActions}
      <ViabilizacionSummaryDialog
        open={isSummaryDialogOpen}
        onOpenChange={setIsSummaryDialogOpen}
      />
    </header>
  )
}
