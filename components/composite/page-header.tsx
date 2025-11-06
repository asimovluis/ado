"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string | React.ReactNode
  backButtonText?: string
  onBack?: () => void
  rightActions?: React.ReactNode
  federacionName?: string
  viabilizadosCount?: number
  totalBlocks?: number
}

export function PageHeader({ 
  title, 
  backButtonText = "Proyectos",
  onBack,
  rightActions,
  federacionName,
  viabilizadosCount,
  totalBlocks
}: PageHeaderProps) {
  // Calcular el porcentaje de progreso
  const progressPercentage = totalBlocks && totalBlocks > 0 
    ? ((viabilizadosCount || 0) / totalBlocks) * 100 
    : 0

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
      {/* Barra de progreso */}
      {totalBlocks !== undefined && totalBlocks > 0 && (
        <div className="flex flex-col gap-2 items-start shrink-0 w-[212px]">
          <p className="text-sm font-medium text-muted-foreground leading-5">
            Partes viabilizadas
          </p>
          <div className="flex gap-2 items-center w-full">
            <span className="text-sm font-medium text-foreground leading-5 whitespace-nowrap">
              {viabilizadosCount || 0}/{totalBlocks}
            </span>
            <div className="basis-0 bg-secondary grow h-2 overflow-clip relative rounded-full">
              <div 
                className="absolute bg-[hsl(var(--teal-700))] h-4 left-0 top-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${progressPercentage}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
      {rightActions}
    </header>
  )
}
