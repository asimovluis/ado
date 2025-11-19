"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BadgeCheck, Check, XOctagon, Circle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ViabilizacionStatus } from "./viabilizacion-status-selector"

interface AnchorNavItem {
  id: string
  label: string
  anchor: string
  viabilizacionStatus?: ViabilizacionStatus
  // Para secciones con múltiples items (beneficiarios, viajes)
  progressCount?: number // Items con estado asignado
  progressTotal?: number // Total de items
  statusCounts?: {
    viabilizado?: number
    "pre-viabilizado"?: number
    "no-viabilizado"?: number
  }
}

interface AnchorNavProps {
  items: AnchorNavItem[]
  className?: string
}

export function AnchorNav({ items, className }: AnchorNavProps) {
  const [activeSection, setActiveSection] = useState<string>("")

  // Detectar la sección activa
  useEffect(() => {
    // Encontrar el contenedor de scroll (main)
    const scrollContainer = document.querySelector('main[class*="overflow-y-auto"]') as HTMLElement

    const handleScroll = () => {
      if (!scrollContainer) return

      const sections = items.map((item) => {
        const element = document.getElementById(item.anchor)
        if (element) {
          const rect = element.getBoundingClientRect()
          const containerRect = scrollContainer.getBoundingClientRect()

          // Calcular posición relativa al contenedor de scroll
          const relativeTop = rect.top - containerRect.top + scrollContainer.scrollTop
          const relativeBottom = rect.bottom - containerRect.top + scrollContainer.scrollTop

          return {
            id: item.anchor,
            top: relativeTop,
            bottom: relativeBottom,
            height: rect.height,
            elementTop: rect.top,
            elementBottom: rect.bottom,
          }
        }
        return null
      }).filter(Boolean) as Array<{
        id: string
        top: number
        bottom: number
        height: number
        elementTop: number
        elementBottom: number
      }>

      if (sections.length === 0) return

      // Obtener la posición actual del scroll
      const scrollTop = scrollContainer.scrollTop
      const viewportHeight = scrollContainer.clientHeight
      const viewportTop = scrollTop
      const viewportBottom = scrollTop + viewportHeight
      // Punto de activación: un poco más arriba de la mitad del viewport (aproximadamente 40% desde el top)
      const activationPoint = scrollTop + (viewportHeight * 0.4)

      let currentSection = ""
      let bestMatch: { id: string; score: number } | null = null

      // Evaluar cada sección
      for (const section of sections) {
        // Calcular qué tan visible está la sección
        const sectionTop = section.top
        const sectionBottom = section.bottom

        // Verificar si la sección está visible en el viewport
        const isVisible = sectionBottom > viewportTop && sectionTop < viewportBottom

        if (isVisible) {
          // Calcular un score basado en qué tan cerca está del punto de activación (40% del viewport)
          let score = 0

          // Si el punto de activación está dentro de la sección, mayor score
          if (sectionTop <= activationPoint && sectionBottom >= activationPoint) {
            // El punto de activación está dentro de la sección
            // Score máximo si está justo en el punto, disminuye según la distancia
            const distanceFromTop = activationPoint - sectionTop
            const sectionHeight = sectionBottom - sectionTop
            // Normalizar: si el punto está en el 40% de la sección desde arriba, score máximo
            const idealPosition = sectionTop + (sectionHeight * 0.4)
            const distance = Math.abs(activationPoint - idealPosition)
            score = Math.max(0, 100 - (distance / sectionHeight * 100))
          } else if (sectionTop > activationPoint && sectionTop < activationPoint + 100) {
            // La sección está justo debajo del punto de activación
            score = 100 - (sectionTop - activationPoint)
          } else if (sectionTop < activationPoint && sectionBottom > activationPoint) {
            // La sección contiene el punto de activación pero no está centrada
            score = 70
          }

          if (score > 0 && (!bestMatch || score > bestMatch.score)) {
            bestMatch = { id: section.id, score }
          }
        }
      }

      // Si encontramos una sección visible, usarla
      if (bestMatch) {
        currentSection = bestMatch.id
      } else {
        // Si no hay ninguna visible, usar la más cercana al punto de activación
        let closestSection = ""
        let minDistance = Infinity

        for (const section of sections) {
          const distance = Math.abs(section.top - activationPoint)
          if (distance < minDistance) {
            minDistance = distance
            closestSection = section.id
          }
        }

        if (closestSection) {
          currentSection = closestSection
        }
      }

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    // Throttle del scroll para mejor performance
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", throttledScroll, { passive: true })
      // Esperar un poco para que el DOM esté listo
      setTimeout(handleScroll, 100)
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", throttledScroll)
      }
    }
  }, [items])

  const handleClick = (anchor: string) => {
    const element = document.getElementById(anchor)
    const scrollContainer = document.querySelector('main[class*="overflow-y-auto"]') as HTMLElement

    if (element && scrollContainer) {
      // Calcular la posición relativa al contenedor
      const containerRect = scrollContainer.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()
      const currentScrollTop = scrollContainer.scrollTop

      // Calcular la posición del elemento relativa al contenedor
      const elementTopRelativeToContainer = elementRect.top - containerRect.top + currentScrollTop

      // Offset para dejar espacio arriba
      const offset = 20

      scrollContainer.scrollTo({
        top: Math.max(0, elementTopRelativeToContainer - offset),
        behavior: "smooth",
      })
    } else if (element) {
      // Fallback a window scroll si no hay contenedor
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      })
    }
  }

  // Componente de radial progress miniatura
  const RadialProgress = ({
    progress,
    size = 16
  }: {
    progress: number // 0-100
    size?: number
  }) => {
    const radius = (size - 4) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (progress / 100) * circumference
    const isComplete = progress >= 100
    const center = size / 2

    return (
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Círculo de fondo */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
          {/* Círculo de progreso */}
          {progress > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="text-foreground transition-all duration-300"
            />
          )}
        </svg>
      </div>
    )
  }

  const getStatusIcon = (status?: ViabilizacionStatus) => {
    if (status === "viabilizado") {
      return <BadgeCheck className="size-4 text-[var(--teal-700)] shrink-0" />
    } else if (status === "pre-viabilizado") {
      return <Check className="size-4 text-[var(--teal-700)] shrink-0" />
    } else if (status === "no-viabilizado") {
      return <XOctagon className="size-4 text-amber-600 shrink-0" />
    }
    // Icono neutral para cuando no hay estado
    return <Circle className="size-4 text-muted-foreground shrink-0" />
  }

  return (
    <nav className={cn("flex flex-col gap-1 items-start shrink-0 sticky top-4 p-4 self-start", className)}>
      {items.map((item) => {
        const isActive = activeSection === item.anchor

        return (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={cn(
              "h-auto justify-start px-3 py-2 w-auto text-left transition-colors",
              isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleClick(item.anchor)}
          >
            <span className={cn("text-sm whitespace-nowrap", isActive && "font-medium")}>
              {item.label}
            </span>
          </Button>
        )
      })}
    </nav>
  )
}

