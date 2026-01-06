"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare, MoreVertical, Info, History } from "lucide-react"
import { cn } from "@/lib/utils"
import { ViabilizacionSummaryDialog } from "@/components/composite/viabilizacion-summary-dialog"
import { VersionHistorySheet } from "@/components/composite/version-history-sheet"

interface PageHeaderProps {
  title: string | React.ReactNode
  backButtonText?: string
  onBack?: () => void
  rightActions?: React.ReactNode
  federacionName?: string
  currentVersion?: string
  versionHistory?: Array<{
    version: string
    fechaCreacion: string
    fechaRespuesta?: string
    viabilizacionResponse: "viabilizado" | "viabilizado-con-indicaciones" | "no-viabilizado" | null
    isCurrent: boolean
  }>
}

export function PageHeader({ 
  title, 
  backButtonText = "Proyectos",
  onBack,
  rightActions,
  federacionName,
  currentVersion,
  versionHistory = []
}: PageHeaderProps) {
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false)
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false)

  return (
    <header
      className="border-b border-border bg-background flex items-center gap-5 p-4 w-full"
    >
      {onBack && (
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="size-5" />
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
      {currentVersion && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVersionHistoryOpen(true)}
          className="gap-1.5"
        >
          <History className="size-4" />
          <span>{currentVersion}</span>
        </Button>
      )}
      {rightActions}
      <ViabilizacionSummaryDialog
        open={isSummaryDialogOpen}
        onOpenChange={setIsSummaryDialogOpen}
      />
      <VersionHistorySheet
        open={isVersionHistoryOpen}
        onOpenChange={setIsVersionHistoryOpen}
        currentVersion={currentVersion}
        versions={versionHistory}
      />
    </header>
  )
}
