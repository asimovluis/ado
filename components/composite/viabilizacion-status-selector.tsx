"use client"

import { Button } from "@/components/ui/button"
import { 
  Check, 
  BadgeCheck,
  XOctagon
} from "lucide-react"
import { cn } from "@/lib/utils"

export type ViabilizacionStatus = "pre-viabilizado" | "viabilizado" | "no-viabilizado" | null

interface ViabilizacionStatusSelectorProps {
  status: ViabilizacionStatus
  onStatusChange: (status: ViabilizacionStatus) => void
  className?: string
  hidePreViabilizado?: boolean
  hideLabels?: boolean
}

const statusConfig = {
  viabilizado: {
    label: "Viabilizar",
    labelSelected: "Viabilizado",
    icon: BadgeCheck,
    selectedClass: "bg-[var(--teal-700)] border-[var(--teal-700)] text-primary-foreground",
    unselectedClass: "bg-background border-border text-foreground hover:bg-accent",
    iconClass: "text-primary-foreground",
  },
  "pre-viabilizado": {
    label: "Pre viabilizar",
    labelSelected: "Pre viabilizado",
    icon: Check,
    selectedClass: "bg-teal-100 border-[var(--teal-700)] text-foreground",
    unselectedClass: "bg-background border-border text-foreground hover:bg-accent",
    iconClass: "text-[var(--teal-700)]",
  },
  "no-viabilizado": {
    label: "No viabilizar",
    labelSelected: "No viabilizado",
    icon: XOctagon,
    selectedClass: "bg-amber-50 border-amber-500 text-foreground",
    unselectedClass: "bg-background border-border text-foreground hover:bg-accent",
    iconClass: "text-amber-600",
  },
} as const

export function ViabilizacionStatusSelector({
  status,
  onStatusChange,
  className,
  hidePreViabilizado = false,
  hideLabels = false,
}: ViabilizacionStatusSelectorProps) {
  const handleToggle = (statusOption: "pre-viabilizado" | "viabilizado" | "no-viabilizado") => {
    // Si el botón ya está seleccionado, deseleccionarlo (volver a null)
    if (status === statusOption) {
      onStatusChange(null)
    } else {
      // Si no está seleccionado, seleccionarlo
      onStatusChange(statusOption)
    }
  }

  const statusOptions: Array<"pre-viabilizado" | "viabilizado" | "no-viabilizado"> = 
    hidePreViabilizado 
      ? ["viabilizado", "no-viabilizado"]
      : ["viabilizado", "pre-viabilizado", "no-viabilizado"]

  return (
    <div className={cn("flex gap-1", className)}>
      {statusOptions.map((statusOption) => {
        const config = statusConfig[statusOption]
        const Icon = config.icon
        const isSelected = status === statusOption
        const displayLabel = isSelected ? config.labelSelected : config.label

        return (
          <Button
            key={statusOption}
            type="button"
            variant="outline"
            onClick={() => handleToggle(statusOption)}
            className={cn(
              "h-8 border-2 transition-colors",
              hideLabels ? "gap-0 px-2 w-8" : "gap-1.5 px-3 w-[140px]",
              isSelected ? config.selectedClass : config.unselectedClass,
              "hover:opacity-90"
            )}
          >
            <Icon className={cn("size-4", isSelected ? config.iconClass : "text-foreground")} />
            {!hideLabels && (
              <span className="text-sm font-medium">{displayLabel}</span>
            )}
          </Button>
        )
      })}
    </div>
  )
}

