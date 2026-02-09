"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { FullPageModal, FullPageModalContent } from "@/components/ui/full-page-modal"
import { DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X, Plus, Minus, Trash2, Check, Search, ChevronRight, ChevronLeft, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BeneficiarioViatico, GastoViatico, Viatico, CategoriaGastoAR, GastoAR } from "@/lib/data/viaticos-db"

interface Gasto {
  id: string
  tipoGasto: string
  descripcion: string
  actividad: string
  federacion: string
  costoUnitario: number
  cantidad: number
  costoTotal: number
}

interface CrearViaticoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gastosDisponibles: Gasto[]
  beneficiariosDisponibles: BeneficiarioViatico[]
  onGuardar: (gastoAR: Omit<GastoAR, "id" | "fechaCreacion">) => void
  actividadOrigen?: string // Actividad de la que provienen los gastos
}

export function CrearViaticoModal({
  open,
  onOpenChange,
  gastosDisponibles,
  beneficiariosDisponibles,
  onGuardar,
  actividadOrigen,
}: CrearViaticoModalProps) {
  const [actividadSeleccionada, setActividadSeleccionada] = React.useState<string>(actividadOrigen || "")
  const [categoria, setCategoria] = React.useState<CategoriaGastoAR | "">("")
  const [nombreViatico, setNombreViatico] = React.useState("")
  const [gastosSeleccionados, setGastosSeleccionados] = React.useState<Map<string, GastoViatico>>(new Map())
  const [beneficiariosSeleccionados, setBeneficiariosSeleccionados] = React.useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = React.useState("")
  const [actividadSearchQuery, setActividadSearchQuery] = React.useState("")
  const [isActividadPopoverOpen, setIsActividadPopoverOpen] = React.useState(false)
  const [pasoActual, setPasoActual] = React.useState<0 | 1 | 2 | 3>(0)
  const [nombreError, setNombreError] = React.useState(false)
  const contenidoScrollRef = React.useRef<HTMLDivElement>(null)
  
  // Obtener actividades agrupadas por federación (filtradas por búsqueda)
  const actividadesPorFederacion = React.useMemo(() => {
    const agrupadas: Record<string, string[]> = {}
    
    gastosDisponibles.forEach(gasto => {
      // Filtrar por búsqueda si existe
      if (actividadSearchQuery.trim()) {
        const query = actividadSearchQuery.toLowerCase()
        const matchActividad = gasto.actividad.toLowerCase().includes(query)
        const matchFederacion = gasto.federacion.toLowerCase().includes(query)
        if (!matchActividad && !matchFederacion) return
      }
      
      if (!agrupadas[gasto.federacion]) {
        agrupadas[gasto.federacion] = []
      }
      if (!agrupadas[gasto.federacion].includes(gasto.actividad)) {
        agrupadas[gasto.federacion].push(gasto.actividad)
      }
    })
    
    // Ordenar federaciones y actividades dentro de cada federación
    Object.keys(agrupadas).forEach(federacion => {
      agrupadas[federacion].sort()
    })
    
    return agrupadas
  }, [gastosDisponibles, actividadSearchQuery])
  
  // Obtener todas las actividades únicas (para compatibilidad)
  const actividadesDisponibles = React.useMemo(() => {
    const actividades = new Set(gastosDisponibles.map(g => g.actividad))
    return Array.from(actividades).sort()
  }, [gastosDisponibles])
  
  // Filtrar gastos por actividad seleccionada
  const gastosFiltradosPorActividad = React.useMemo(() => {
    if (!actividadSeleccionada) return gastosDisponibles
    return gastosDisponibles.filter(g => g.actividad === actividadSeleccionada)
  }, [gastosDisponibles, actividadSeleccionada])
  
  const handleAgregarGasto = (gasto: Gasto) => {
    const nuevoGastoViatico: GastoViatico = {
      gastoId: gasto.id,
      tipoGasto: gasto.tipoGasto,
      descripcion: gasto.descripcion,
      actividad: gasto.actividad,
      federacion: gasto.federacion,
      cantidadSeleccionada: gasto.cantidad,
      cantidadMaxima: gasto.cantidad,
      costoUnitario: gasto.costoUnitario,
      costoTotal: gasto.costoUnitario * gasto.cantidad,
    }

    setGastosSeleccionados(prev => {
      const newMap = new Map(prev)
      newMap.set(gasto.id, nuevoGastoViatico)
      return newMap
    })
  }

  const handleEliminarGasto = (gastoId: string) => {
    setGastosSeleccionados(prev => {
      const newMap = new Map(prev)
      newMap.delete(gastoId)
      return newMap
    })
  }

  const handleCambiarCantidad = (gastoId: string, nuevaCantidad: number) => {
    setGastosSeleccionados(prev => {
      const newMap = new Map(prev)
      const gasto = newMap.get(gastoId)
      if (gasto && nuevaCantidad > 0 && nuevaCantidad <= gasto.cantidadMaxima) {
        newMap.set(gastoId, {
          ...gasto,
          cantidadSeleccionada: nuevaCantidad,
          costoTotal: gasto.costoUnitario * nuevaCantidad,
        })
      }
      return newMap
    })
  }

  const toggleBeneficiario = (beneficiarioId: string) => {
    setBeneficiariosSeleccionados(prev => {
      const newSet = new Set(prev)
      if (newSet.has(beneficiarioId)) {
        newSet.delete(beneficiarioId)
      } else {
        newSet.add(beneficiarioId)
      }
      return newSet
    })
  }

  const costoTotalViatico = React.useMemo(() => {
    return Array.from(gastosSeleccionados.values()).reduce(
      (total, gasto) => total + gasto.costoTotal,
      0
    )
  }, [gastosSeleccionados])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleGuardar = () => {
    // Validar que todos los campos requeridos estén completos
    if (!categoria || !actividadSeleccionada) {
      // Si no hay categoría o actividad, volver al inicio
      setPasoActual(0)
      setTimeout(() => {
        contenidoScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }, 0)
      return
    }
    
    if (gastosSeleccionados.size === 0) {
      setPasoActual(1)
      setTimeout(() => {
        contenidoScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }, 0)
      return
    }
    
    if (beneficiariosSeleccionados.size === 0) {
      setPasoActual(2)
      setTimeout(() => {
        contenidoScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }, 0)
      return
    }
    
    if (!nombreViatico.trim()) {
      setNombreError(true)
      setPasoActual(3) // Ir al paso 3 donde está el input
      // Hacer scroll al top después de que se actualice el estado
      setTimeout(() => {
        contenidoScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }, 0)
      return
    }
    
    // Si todo está válido, guardar
    setNombreError(false)
    onGuardar({
      categoria: categoria as CategoriaGastoAR,
      nombre: nombreViatico.trim(),
      gastos: Array.from(gastosSeleccionados.values()),
      beneficiarios: Array.from(beneficiariosSeleccionados),
      costoTotal: costoTotalViatico,
      actividadOrigen: actividadSeleccionada,
    })
    handleReset()
    onOpenChange(false)
  }

  const handleReset = () => {
    setActividadSeleccionada(actividadOrigen || "")
    setCategoria("")
    setNombreViatico("")
    setGastosSeleccionados(new Map())
    setBeneficiariosSeleccionados(new Set())
    setSearchQuery("")
    setActividadSearchQuery("")
    setIsActividadPopoverOpen(false)
    setPasoActual(0)
    setNombreError(false)
  }
  
  React.useEffect(() => {
    if (actividadOrigen) {
      setActividadSeleccionada(actividadOrigen)
    }
  }, [actividadOrigen])

  // Filtrar gastos según búsqueda
  const gastosFiltrados = React.useMemo(() => {
    if (!searchQuery.trim()) return gastosDisponibles
    
    const query = searchQuery.toLowerCase()
    return gastosDisponibles.filter(gasto =>
      gasto.tipoGasto.toLowerCase().includes(query) ||
      gasto.descripcion.toLowerCase().includes(query) ||
      gasto.actividad.toLowerCase().includes(query) ||
      gasto.federacion.toLowerCase().includes(query)
    )
  }, [gastosDisponibles, searchQuery])

  // Agrupar gastos por federación y luego por actividad (usando gastos filtrados por actividad seleccionada)
  const gastosPorFederacion = React.useMemo(() => {
    // Filtrar gastos por búsqueda
    const gastosFiltrados = gastosFiltradosPorActividad.filter(gasto => {
      if (!searchQuery.trim()) return true
      const query = searchQuery.toLowerCase()
      return (
        gasto.tipoGasto.toLowerCase().includes(query) ||
        gasto.descripcion.toLowerCase().includes(query) ||
        gasto.actividad.toLowerCase().includes(query) ||
        gasto.federacion.toLowerCase().includes(query)
      )
    })
    
    return gastosFiltrados.reduce((acc, gasto) => {
      if (!acc[gasto.federacion]) {
        acc[gasto.federacion] = {}
      }
      if (!acc[gasto.federacion][gasto.actividad]) {
        acc[gasto.federacion][gasto.actividad] = []
      }
      acc[gasto.federacion][gasto.actividad].push(gasto)
      return acc
    }, {} as Record<string, Record<string, typeof gastosFiltradosPorActividad>>)
  }, [gastosFiltradosPorActividad, searchQuery])

  // Filtrar beneficiarios según búsqueda
  const beneficiariosFiltrados = React.useMemo(() => {
    if (!searchQuery.trim()) return beneficiariosDisponibles
    
    const query = searchQuery.toLowerCase()
    return beneficiariosDisponibles.filter(beneficiario =>
      beneficiario.nombre.toLowerCase().includes(query) ||
      beneficiario.rol.toLowerCase().includes(query) ||
      beneficiario.documento.toLowerCase().includes(query) ||
      beneficiario.tipoDocumento.toLowerCase().includes(query)
    )
  }, [beneficiariosDisponibles, searchQuery])

  React.useEffect(() => {
    if (!open) {
      handleReset()
    }
  }, [open])

  // Scroll al top cuando cambia el paso
  React.useEffect(() => {
    contenidoScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pasoActual])

  // Obtener beneficiarios completos para el resumen
  const beneficiariosCompletos = React.useMemo(() => {
    return Array.from(beneficiariosSeleccionados)
      .map(id => beneficiariosDisponibles.find(b => b.id === id))
      .filter((b): b is BeneficiarioViatico => b !== undefined)
  }, [beneficiariosSeleccionados, beneficiariosDisponibles])

  const puedeAvanzar = () => {
    if (pasoActual === 0) return actividadSeleccionada !== "" && categoria !== ""
    if (pasoActual === 1) return gastosSeleccionados.size > 0
    if (pasoActual === 2) return beneficiariosSeleccionados.size > 0
    return false
  }

  const puedeGuardar = nombreViatico.trim() && gastosSeleccionados.size > 0 && beneficiariosSeleccionados.size > 0 && actividadSeleccionada !== "" && categoria !== ""

  return (
    <FullPageModal open={open} onOpenChange={onOpenChange}>
      <FullPageModalContent className="p-0 gap-0" showCloseButton={false}>
        <DialogTitle className="sr-only">Nuevo gasto de AR para rendir</DialogTitle>
        
        {/* Header fijo con stepper */}
        <div className="bg-background shrink-0">
          <div className="flex items-center justify-between p-4 relative">
            <h2 className="text-base font-semibold">Nuevo gasto de AR para rendir</h2>
            
            {/* Stepper centrado absolutamente */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPasoActual(0)}
                  className={cn(
                    "flex items-center gap-2 transition-colors",
                    pasoActual >= 0 && "text-foreground",
                    "hover:opacity-80"
                  )}
                >
                  <div className={cn(
                    "size-6 rounded-full flex items-center justify-center text-xs font-medium border",
                    pasoActual >= 0 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-background text-muted-foreground border-border"
                  )}>
                    {pasoActual > 0 ? <Check className="size-4" /> : "1"}
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    pasoActual >= 0 ? "text-foreground" : "text-muted-foreground"
                  )}>
                    Actividad y tipo
                  </span>
                </button>
                
                <ChevronRight className="size-4 text-muted-foreground" />
                
                <button
                  onClick={() => pasoActual > 0 && setPasoActual(1)}
                  className={cn(
                    "flex items-center gap-2 transition-colors",
                    pasoActual >= 1 && "text-foreground",
                    "hover:opacity-80"
                  )}
                >
                  <div className={cn(
                    "size-6 rounded-full flex items-center justify-center text-xs font-medium border",
                    pasoActual >= 1 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-background text-muted-foreground border-border"
                  )}>
                    {pasoActual > 1 ? <Check className="size-4" /> : "2"}
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    pasoActual >= 1 ? "text-foreground" : "text-muted-foreground"
                  )}>
                    Gastos
                  </span>
                </button>
                
                <ChevronRight className="size-4 text-muted-foreground" />
                
                <button
                  onClick={() => pasoActual > 1 && setPasoActual(2)}
                  className={cn(
                    "flex items-center gap-2 transition-colors",
                    pasoActual >= 2 && "text-foreground",
                    "hover:opacity-80"
                  )}
                >
                  <div className={cn(
                    "size-6 rounded-full flex items-center justify-center text-xs font-medium border",
                    pasoActual >= 2 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-background text-muted-foreground border-border"
                  )}>
                    {pasoActual > 2 ? <Check className="size-4" /> : "3"}
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    pasoActual >= 2 ? "text-foreground" : "text-muted-foreground"
                  )}>
                    Beneficiarios
                  </span>
                </button>
                
                <ChevronRight className="size-4 text-muted-foreground" />
                
                <button
                  onClick={() => pasoActual > 2 && setPasoActual(3)}
                  className={cn(
                    "flex items-center gap-2 transition-colors",
                    pasoActual >= 3 && "text-foreground",
                    "hover:opacity-80"
                  )}
                >
                  <div className={cn(
                    "size-6 rounded-full flex items-center justify-center text-xs font-medium border",
                    pasoActual >= 3 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-background text-muted-foreground border-border"
                  )}>
                    4
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    pasoActual >= 3 ? "text-foreground" : "text-muted-foreground"
                  )}>
                    Resumen
                  </span>
                </button>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => onOpenChange(false)}>
              <X className="size-5" />
            </Button>
          </div>

          {/* Títulos y buscador fijo según el paso */}
          {pasoActual === 0 && (
            <div className="flex flex-col gap-4 px-4 pb-4">
              <div className="flex justify-center">
                <h3 className="text-lg font-semibold">Selecciona la actividad y el tipo de gasto</h3>
              </div>
            </div>
          )}
          {pasoActual === 1 && (
            <div className="flex flex-col gap-4 px-4 pb-4">
              <div className="flex justify-center">
                <h3 className="text-lg font-semibold">Agrega los gastos del gasto de AR</h3>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-[400px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar gastos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setSearchQuery("")
                          e.currentTarget.blur()
                        }
                      }}
                      className={cn("pl-9", searchQuery && "pr-9")}
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {pasoActual === 2 && (
            <div className="flex flex-col gap-4 px-4 pb-4">
              <div className="flex justify-center">
                <h3 className="text-lg font-semibold">Selecciona los beneficiarios</h3>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-[400px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar beneficiarios..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setSearchQuery("")
                          e.currentTarget.blur()
                        }
                      }}
                      className={cn("pl-9", searchQuery && "pr-9")}
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contenido principal con scroll */}
        <div ref={contenidoScrollRef} className="flex-1 overflow-y-auto">
          <div className="flex justify-center">
            <div className="w-full max-w-[800px]">
              {/* Paso 0: Actividad y tipo */}
              {pasoActual === 0 && (
                <div className="p-6">
                  <div className="flex flex-col gap-6 max-w-[500px] mx-auto">
                    {/* Selector de actividad */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="actividad">Actividad</Label>
                      <Popover open={isActividadPopoverOpen} onOpenChange={setIsActividadPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between h-10"
                          >
                            <span className="truncate">
                              {actividadSeleccionada || "Selecciona una actividad"}
                            </span>
                            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                          <div className="flex flex-col">
                            {/* Buscador */}
                            <div className="p-2 border-b">
                              <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                  type="text"
                                  placeholder="Buscar actividad o federación..."
                                  value={actividadSearchQuery}
                                  onChange={(e) => setActividadSearchQuery(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                      setActividadSearchQuery("")
                                      e.currentTarget.blur()
                                      setIsActividadPopoverOpen(false)
                                    }
                                  }}
                                  className="pl-8 h-9"
                                  autoFocus
                                />
                                {actividadSearchQuery && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                    onClick={() => setActividadSearchQuery("")}
                                  >
                                    <X className="size-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            {/* Lista de actividades */}
                            <div className="flex flex-col max-h-[300px] overflow-y-auto">
                              {Object.keys(actividadesPorFederacion).length === 0 ? (
                                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                                  No se encontraron actividades
                                </div>
                              ) : (
                                Object.entries(actividadesPorFederacion)
                                  .sort(([a], [b]) => a.localeCompare(b))
                                  .map(([federacion, actividades]) => (
                                    <div key={federacion} className="flex flex-col">
                                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground sticky top-0 bg-background border-b">
                                        {federacion}
                                      </div>
                                      {actividades.map((actividad) => (
                                        <button
                                          key={actividad}
                                          onClick={() => {
                                            setActividadSeleccionada(actividad)
                                            setIsActividadPopoverOpen(false)
                                            setActividadSearchQuery("")
                                          }}
                                          className={cn(
                                            "flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left w-full",
                                            actividadSeleccionada === actividad && "bg-accent"
                                          )}
                                        >
                                          <span className="font-medium text-foreground">{actividad}</span>
                                          {actividadSeleccionada === actividad && (
                                            <Check className="size-4 text-foreground shrink-0" />
                                          )}
                                        </button>
                                      ))}
                                    </div>
                                  ))
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* Selector de tipo de gasto */}
                    <div className="flex flex-col gap-2">
                      <Label>Tipo de gasto</Label>
                      <RadioGroup value={categoria} onValueChange={(value) => setCategoria(value as CategoriaGastoAR)}>
                        <div className="flex flex-col gap-3">
                          <div 
                            className={cn(
                              "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                              categoria === "Viático" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            )}
                            onClick={() => setCategoria("Viático")}
                          >
                            <RadioGroupItem value="Viático" id="cat-viatico" />
                            <Label htmlFor="cat-viatico" className="flex-1 cursor-pointer">
                              <div className="flex flex-col gap-1">
                                <p className="font-medium">Viático</p>
                                <p className="text-sm text-muted-foreground">Gastos de alimentación y subsistencia diaria</p>
                              </div>
                            </Label>
                          </div>
                          
                          <div 
                            className={cn(
                              "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                              categoria === "Honorarios" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            )}
                            onClick={() => setCategoria("Honorarios")}
                          >
                            <RadioGroupItem value="Honorarios" id="cat-honorarios" />
                            <Label htmlFor="cat-honorarios" className="flex-1 cursor-pointer">
                              <div className="flex flex-col gap-1">
                                <p className="font-medium">Honorarios</p>
                                <p className="text-sm text-muted-foreground">Pagos por servicios profesionales</p>
                              </div>
                            </Label>
                          </div>
                          
                          <div 
                            className={cn(
                              "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                              categoria === "Alimentación y alojamiento" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            )}
                            onClick={() => setCategoria("Alimentación y alojamiento")}
                          >
                            <RadioGroupItem value="Alimentación y alojamiento" id="cat-alimentacion" />
                            <Label htmlFor="cat-alimentacion" className="flex-1 cursor-pointer">
                              <div className="flex flex-col gap-1">
                                <p className="font-medium">Alimentación y alojamiento</p>
                                <p className="text-sm text-muted-foreground">Gastos de comida y hospedaje</p>
                              </div>
                            </Label>
                          </div>
                          
                          <div 
                            className={cn(
                              "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                              categoria === "Pasajes/Traslados/peajes" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            )}
                            onClick={() => setCategoria("Pasajes/Traslados/peajes")}
                          >
                            <RadioGroupItem value="Pasajes/Traslados/peajes" id="cat-pasajes" />
                            <Label htmlFor="cat-pasajes" className="flex-1 cursor-pointer">
                              <div className="flex flex-col gap-1">
                                <p className="font-medium">Pasajes/Traslados/peajes</p>
                                <p className="text-sm text-muted-foreground">Gastos de transporte y movilización</p>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 1: Gastos */}
              {pasoActual === 1 && (
                <div className="p-6">
            

              <div className="flex flex-col gap-6 -mx-6">
                {Object.entries(gastosPorFederacion).map(([federacion, actividades]) => (
                  <div key={federacion} className="flex flex-col gap-12">
                    {/* Título de Federación sticky */}
                    <div className="sticky top-0 z-20 bg-background pb-0 px-6 pt-3">
                      <h2 className="text-xl font-semibold">{federacion}</h2>
                    </div>
                    
                    {Object.entries(actividades).map(([actividad, gastos]) => (
                      <div key={actividad} className="flex flex-col gap-8">
                        {/* Título de Actividad sticky - debajo del de federación */}
                        <div className="sticky top-[40px] z-10 bg-background pb-0 px-6 pt-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground">{actividad}</h3>
                            <span className="text-xs font-semibold text-muted-foreground">
                              {gastos.length} {gastos.length === 1 ? "gasto" : "gastos"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col border-t px-6">
                          {gastos.map((gasto) => {
                            const gastoSeleccionado = gastosSeleccionados.get(gasto.id)
                            const isSelected = !!gastoSeleccionado

                            return (
                              <div key={gasto.id} className="flex items-center gap-4 p-3 border-b">
                                <div className="flex-1 flex flex-col gap-2">
                                  <p className="text-base font-semibold">{gasto.tipoGasto}</p>
                                  <p className="text-base">{gasto.descripcion}</p>
                                  <div className="text-base text-muted-foreground">
                                    <p>{gasto.cantidad} unidades</p>
                                    <p>{formatCurrency(gasto.costoUnitario)} c/u</p>
                                  </div>
                                  <p className="text-base font-medium">{formatCurrency(gasto.costoTotal)}</p>
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                  {isSelected ? (
                                    <>
                                      <div className="flex flex-col items-start gap-1">
                                        <p className="text-sm font-medium text-foreground">unidades</p>
                                        <div className="flex items-center gap-2">
                                          <div className="border border-input rounded-lg flex items-center overflow-hidden">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-10 w-10 rounded-none"
                                              onClick={() => handleCambiarCantidad(gasto.id, gastoSeleccionado.cantidadSeleccionada - 1)}
                                              disabled={gastoSeleccionado.cantidadSeleccionada <= 1}
                                            >
                                              <Minus className="size-4" />
                                            </Button>
                                            <input
                                              type="number"
                                              value={gastoSeleccionado.cantidadSeleccionada}
                                              onChange={(e) => {
                                                const value = parseInt(e.target.value)
                                                if (!isNaN(value)) {
                                                  handleCambiarCantidad(gasto.id, value)
                                                }
                                              }}
                                              className="w-16 h-10 text-center border-x border-input text-sm"
                                              min="1"
                                              max={gastoSeleccionado.cantidadMaxima}
                                            />
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-10 w-10 rounded-none"
                                              onClick={() => handleCambiarCantidad(gasto.id, gastoSeleccionado.cantidadSeleccionada + 1)}
                                              disabled={gastoSeleccionado.cantidadSeleccionada >= gastoSeleccionado.cantidadMaxima}
                                            >
                                              <Plus className="size-4" />
                                            </Button>
                                          </div>
                                          <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10"
                                            onClick={() => handleEliminarGasto(gasto.id)}
                                          >
                                            <Trash2 className="size-4" />
                                          </Button>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between w-full">
                                        <p className="text-sm text-muted-foreground">{formatCurrency(gastoSeleccionado.costoUnitario)} c/u</p>
                                        <p className="text-lg font-medium">{formatCurrency(gastoSeleccionado.costoTotal)}</p>
                                      </div>
                                    </>
                                  ) : (
                                    <Button
                                      size="icon"
                                      className="h-9 w-9"
                                      onClick={() => handleAgregarGasto(gasto)}
                                    >
                                      <Plus className="size-5" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paso 2: Beneficiarios */}
          {pasoActual === 2 && (
            <div className="p-6">

              <div className="flex flex-col border-t">
                {beneficiariosFiltrados.map((beneficiario) => {
                  const isSelected = beneficiariosSeleccionados.has(beneficiario.id)

                  return (
                    <div
                      key={beneficiario.id}
                      className={cn(
                        "flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-accent",
                        isSelected && "bg-accent"
                      )}
                      onClick={() => toggleBeneficiario(beneficiario.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleBeneficiario(beneficiario.id)}
                      />
                      <div className="flex-1 flex flex-col">
                        <p className="text-sm font-medium">{beneficiario.nombre}</p>
                        <p className="text-sm text-muted-foreground">{beneficiario.rol}</p>
                      </div>
                      <div className="flex flex-col items-end text-sm">
                        <p className="font-medium">{beneficiario.documento}</p>
                        <p className="text-muted-foreground">{beneficiario.tipoDocumento}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Paso 3: Nombre/código */}
          {pasoActual === 3 && (
            <div className="p-6 pt-20">
              <div className="flex flex-col gap-20">
                {/* Input de nombre */}
                <div className="flex justify-center">
                  <div className="flex flex-col gap-2 max-w-[400px] w-full">
                    <Label htmlFor="nombre-viatico">Descripción del gasto</Label>
                    <Input
                      id="nombre-viatico"
                      value={nombreViatico}
                      onChange={(e) => {
                        setNombreViatico(e.target.value)
                        if (nombreError) setNombreError(false)
                      }}
                      placeholder="Ejemplo: alimentación para entrenadores"
                      className={nombreError ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {nombreError && (
                      <p className="text-sm text-destructive">La descripción o nombre del gasto es requerida</p>
                    )}
                  </div>
                </div>

                {/* Resumen del viático */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-lg font-semibold">Resumen del viático</h3>
                  {/* Sección de Gastos */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">Gastos</h3>
                      <p className="text-sm text-muted-foreground">
                        {gastosSeleccionados.size} {gastosSeleccionados.size === 1 ? "gasto" : "gastos"} incluidos
                      </p>
                    </div>

                    <div className="flex flex-col border rounded-lg">
                      {Array.from(gastosSeleccionados.values()).map((gasto, index) => (
                        <div
                          key={gasto.gastoId}
                          className={cn(
                            "flex items-center gap-4 p-4",
                            index < gastosSeleccionados.size - 1 && "border-b"
                          )}
                        >
                          <div className="flex-1 flex flex-col gap-2">
                            <p className="text-sm text-muted-foreground">{gasto.actividad}</p>
                            <p className="text-base font-semibold">{gasto.tipoGasto}</p>
                            <p className="text-base">{gasto.descripcion}</p>
                            <div className="text-sm text-muted-foreground">
                              <p>{gasto.cantidadSeleccionada} de {gasto.cantidadMaxima} unidades</p>
                              <p>{formatCurrency(gasto.costoUnitario)} c/u</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-end min-w-[120px]">
                            <p className="text-base font-medium">{formatCurrency(gasto.costoTotal)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Resumen del costo total */}
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <p className="text-base font-semibold">Costo total del viático</p>
                      <p className="text-lg font-semibold">{formatCurrency(costoTotalViatico)}</p>
                    </div>
                  </div>

                  {/* Sección de Beneficiarios */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">Beneficiarios</h3>
                      <p className="text-sm text-muted-foreground">
                        {beneficiariosCompletos.length} {beneficiariosCompletos.length === 1 ? "beneficiario" : "beneficiarios"} asociados
                      </p>
                    </div>

                    <div className="flex flex-col border rounded-lg">
                      {beneficiariosCompletos.map((beneficiario, index) => (
                        <div
                          key={beneficiario.id}
                          className={cn(
                            "flex items-center gap-4 p-4",
                            index < beneficiariosCompletos.length - 1 && "border-b"
                          )}
                        >
                          <div className="flex-1 flex flex-col gap-1">
                            <p className="text-base font-semibold">{beneficiario.nombre}</p>
                            <p className="text-sm text-muted-foreground">{beneficiario.rol}</p>
                          </div>
                          <div className="flex flex-col items-end text-sm text-muted-foreground">
                            <p>{beneficiario.documento}</p>
                            <p>{beneficiario.tipoDocumento}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

            </div>
          </div>
        </div>

        {/* Barra de botones de navegación */}
        <div className="bg-background border-t border-border shrink-0">
          <div className="flex justify-center">
            <div className="w-full max-w-[800px] p-4">
              <div className="flex items-center justify-between">
                {/* Botón Cancelar siempre a la izquierda */}
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                
                {/* Botones de navegación a la derecha */}
                <div className="flex gap-2">
                  {pasoActual > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setPasoActual((prev) => (prev - 1) as 0 | 1 | 2 | 3)}
                    >
                      <ChevronLeft className="size-4 mr-2" />
                      Anterior
                    </Button>
                  )}
                  {pasoActual < 3 ? (
                    <Button
                      onClick={() => {
                        if (puedeAvanzar()) {
                          setPasoActual((prev) => (prev + 1) as 0 | 1 | 2 | 3)
                        }
                      }}
                      disabled={!puedeAvanzar()}
                    >
                      Siguiente
                      <ChevronRight className="size-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleGuardar}
                    >
                      <Check className="size-5 mr-2" />
                      Guardar gasto
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </FullPageModalContent>
    </FullPageModal>
  )
}