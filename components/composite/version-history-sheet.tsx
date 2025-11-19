"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Check, BadgeCheck, XOctagon } from "lucide-react"

export type ViabilizacionResponse = "viabilizado" | "viabilizado-con-indicaciones" | "no-viabilizado" | null

export interface VersionHistoryItem {
  version: string
  fechaCreacion: string
  fechaRespuesta?: string
  viabilizacionResponse: ViabilizacionResponse
  isCurrent: boolean
}

interface VersionHistorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentVersion: string
  versions: VersionHistoryItem[]
}

export function VersionHistorySheet({
  open,
  onOpenChange,
  currentVersion,
  versions,
}: VersionHistorySheetProps) {
  const getViabilizacionLabel = (response: ViabilizacionResponse): string => {
    switch (response) {
      case "viabilizado":
        return "Sí se viabiliza técnicamente"
      case "viabilizado-con-indicaciones":
        return "Se viabiliza con indicaciones"
      case "no-viabilizado":
        return "No se viabiliza técnicamente"
      default:
        return "Sin respuesta"
    }
  }

  const getViabilizacionIcon = (response: ViabilizacionResponse) => {
    switch (response) {
      case "viabilizado":
        return <BadgeCheck className="size-5 text-[var(--teal-700)]" />
      case "viabilizado-con-indicaciones":
        return <BadgeCheck className="size-5 text-blue-700" />
      case "no-viabilizado":
        return <XOctagon className="size-5 text-destructive" />
      default:
        return null
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-4 w-[300px] sm:w-[440px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Historial de versiones</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 mt-6">
          {versions.map((version, index) => (
            <div
              key={version.version}
              className={cn(
                "flex flex-col gap-2 p-4 rounded-lg border cursor-pointer transition-colors",
                version.isCurrent
                  ? "border-primary bg-accent"
                  : "border-border bg-background hover:bg-accent/50"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-foreground">
                    {version.version}
                  </span>
                  {version.isCurrent && (
                    <Badge variant="secondary" className="text-xs">
                      Actual
                    </Badge>
                  )}
                </div>
                {version.isCurrent && (
                  <div className="size-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="size-3 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">
                  Creada el {version.fechaCreacion}
                </p>
                {version.fechaRespuesta && (
                  <p className="text-sm text-muted-foreground">
                    Respondida el {version.fechaRespuesta}
                  </p>
                )}
                {version.viabilizacionResponse && (
                  <div className="flex items-center gap-2">
                    {getViabilizacionIcon(version.viabilizacionResponse)}
                    <span className="text-sm font-medium text-foreground">
                      {getViabilizacionLabel(version.viabilizacionResponse)}
                    </span>
                  </div>
                )}
                {!version.viabilizacionResponse && (
                  <p className="text-sm text-muted-foreground">
                    Sin respuesta de viabilización
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

