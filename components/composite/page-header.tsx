"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAllBlocksFromStorage } from "@/prototype-logic/use-blocks"
import type { ContentBlock } from "@/prototype-logic/types"

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
  // Obtener todos los bloques de todas las páginas para calcular el progreso global
  const [allBlocks, setAllBlocks] = useState<ContentBlock[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Marcar como montado para evitar errores de hidratación
    setIsMounted(true)
    
    // Función para obtener y actualizar todos los bloques
    const updateAllBlocks = () => {
      const blocks = getAllBlocksFromStorage()
      setAllBlocks(blocks)
    }

    // Obtener bloques iniciales
    updateAllBlocks()

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      updateAllBlocks()
    }

    // Escuchar el evento storage (cuando cambia localStorage)
    window.addEventListener('storage', handleStorageChange)
    
    // También escuchar cambios personalizados (para cambios en la misma ventana)
    window.addEventListener('blocksUpdated', handleStorageChange)

    // Polling como fallback (cada 500ms)
    const interval = setInterval(updateAllBlocks, 500)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('blocksUpdated', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Calcular progreso global
  const viabilizadosCount = allBlocks.filter(
    (block) => block.viabilizacionStatus === "viabilizado"
  ).length
  const totalBlocks = allBlocks.length
  const progressPercentage = totalBlocks > 0 
    ? (viabilizadosCount / totalBlocks) * 100 
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
      {isMounted && totalBlocks > 0 && (
        <div className="flex flex-col gap-2 items-start shrink-0 w-[212px]">
          <p className="text-sm font-medium text-muted-foreground leading-5">
            Partes viabilizadas
          </p>
          <div className="flex gap-2 items-center w-full">
            <span className="text-sm font-medium text-foreground leading-5 whitespace-nowrap">
              {viabilizadosCount || 0}/{totalBlocks}
            </span>
            <div className="basis-0 bg-secondary grow h-2 overflow-hidden relative rounded-full">
              <div 
                className="absolute bg-[hsl(var(--teal-700))] h-full left-0 top-0 rounded-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${Math.max(0, Math.min(100, progressPercentage))}%`,
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
