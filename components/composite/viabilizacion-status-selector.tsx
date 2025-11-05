"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
  CircleSlash, 
  Check, 
  BadgeCheck, 
  ChevronDown 
} from "lucide-react"
import { cn } from "@/lib/utils"

export type ViabilizacionStatus = "pendiente" | "pre-viabilizado" | "viabilizado"

interface ViabilizacionStatusSelectorProps {
  status: ViabilizacionStatus
  onStatusChange: (status: ViabilizacionStatus) => void
  className?: string
}

const statusConfig = {
  pendiente: {
    label: "Pendiente",
    description: "Aún no está listo",
    icon: CircleSlash,
    bgClass: "bg-background border border-border",
    textClass: "text-accent-foreground",
    iconClass: "text-foreground",
  },
  "pre-viabilizado": {
    label: "Pre-viabilizado",
    description: "Se puede avanzar, pero falta detallar más información",
    icon: Check,
    bgClass: "bg-background border border-border",
    textClass: "text-[var(--teal-700)]",
    iconClass: "text-[var(--teal-700)]",
  },
  viabilizado: {
    label: "Viabilizado",
    description: "Está listo",
    icon: BadgeCheck,
    bgClass: "bg-[var(--teal-700)]",
    textClass: "text-primary-foreground",
    iconClass: "text-primary-foreground",
  },
} as const

export function ViabilizacionStatusSelector({
  status,
  onStatusChange,
  className,
}: ViabilizacionStatusSelectorProps) {
  const [open, setOpen] = useState(false)
  const config = statusConfig[status]
  const Icon = config.icon

  const handleSelect = (newStatus: ViabilizacionStatus) => {
    onStatusChange(newStatus)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={status === "viabilizado" ? "default" : "outline"}
          className={cn(
            "h-8 gap-1.5 px-3",
            status === "viabilizado" ? "bg-[var(--teal-700)] hover:bg-[var(--teal-700)]/90 border-0" : config.bgClass,
            config.textClass,
            "hover:opacity-90",
            className
          )}
        >
          <Icon className={cn("size-5", config.iconClass)} />
          <span className="text-sm font-medium">{config.label}</span>
          <ChevronDown className={cn("size-5", config.iconClass)} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1" align="start">
        <div className="flex flex-col gap-1">
          {(Object.keys(statusConfig) as ViabilizacionStatus[]).map((statusOption) => {
            const optionConfig = statusConfig[statusOption]
            const OptionIcon = optionConfig.icon
            const isSelected = status === statusOption

            return (
              <button
                key={statusOption}
                onClick={() => handleSelect(statusOption)}
                className={cn(
                  "flex items-start gap-2 rounded-md px-3 py-2 text-left transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isSelected && "bg-accent text-accent-foreground"
                )}
              >
                <OptionIcon
                  className={cn(
                    "size-5 shrink-0 mt-0.5",
                    statusOption === "pre-viabilizado"
                      ? "text-[var(--teal-700)]"
                      : statusOption === "viabilizado"
                      ? "text-[var(--teal-700)]"
                      : "text-foreground"
                  )}
                />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium">{optionConfig.label}</span>
                  <span className="text-xs text-muted-foreground leading-4">
                    {optionConfig.description}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

