"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BadgeCheck, Check, CircleSlash } from "lucide-react"
import { getAllBlocksFromStorage } from "@/prototype-logic/use-blocks"
import { getBlockRoute } from "@/prototype-logic/block-navigation"
import type { ContentBlock } from "@/prototype-logic/types"
import { cn } from "@/lib/utils"

interface ViabilizacionSummaryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViabilizacionSummaryDialog({
  open,
  onOpenChange,
}: ViabilizacionSummaryDialogProps) {
  const router = useRouter()
  const [allBlocks, setAllBlocks] = useState<ContentBlock[]>([])

  useEffect(() => {
    if (!open) return

    const updateAllBlocks = () => {
      const blocks = getAllBlocksFromStorage()
      setAllBlocks(blocks)
    }

    updateAllBlocks()

    const handleStorageChange = () => {
      updateAllBlocks()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('blocksUpdated', handleStorageChange)
    const interval = setInterval(updateAllBlocks, 500)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('blocksUpdated', handleStorageChange)
      clearInterval(interval)
    }
  }, [open])

  // Calcular progreso
  const viabilizadosCount = allBlocks.filter(
    (block) => block.viabilizacionStatus === "viabilizado"
  ).length
  const totalBlocks = allBlocks.length
  const progressPercentage = totalBlocks > 0 
    ? (viabilizadosCount / totalBlocks) * 100 
    : 0

  const handleBlockClick = (blockId: string) => {
    const route = getBlockRoute(blockId)
    onOpenChange(false)
    router.push(route)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Partes viabilizadas</DialogTitle>
          {/* Barra de progreso */}
          {totalBlocks > 0 && (
            <div className="flex gap-2 items-center pt-2 w-full">
              <span className="text-sm font-medium text-foreground leading-5 whitespace-nowrap">
                {viabilizadosCount}/{totalBlocks}
              </span>
              <div className="basis-0 bg-secondary grow h-2 overflow-hidden relative rounded-full">
                <div 
                  className="absolute bg-[var(--teal-700)] h-full left-0 top-0 rounded-full transition-all duration-300 ease-out"
                  style={{ 
                    width: `${Math.max(0, Math.min(100, progressPercentage))}%`,
                  }}
                />
              </div>
            </div>
          )}
        </DialogHeader>

        {/* Lista de bloques */}
        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
          {allBlocks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay bloques disponibles
            </p>
          ) : (
            allBlocks.map((block) => {
              const status = block.viabilizacionStatus
              
              // Determinar el icono y color según el estado
              let IconComponent
              let iconClassName
              
              if (status === "viabilizado") {
                IconComponent = BadgeCheck
                iconClassName = "text-[var(--teal-700)]"
              } else if (status === "pre-viabilizado") {
                IconComponent = Check
                iconClassName = "text-[var(--teal-700)]"
              } else {
                IconComponent = CircleSlash
                iconClassName = "text-muted-foreground"
              }
              
              return (
                <button
                  key={block.id}
                  onClick={() => handleBlockClick(block.id)}
                  className={cn(
                    "flex gap-3 items-start text-left transition-colors rounded-md p-2",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <IconComponent className={cn("size-6 shrink-0 mt-0.5", iconClassName)} />
                  <span className="text-base font-medium text-foreground leading-6">
                    {block.title}
                  </span>
                </button>
              )
            })
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

