"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronRight, ChevronDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Proyecto, Actividad } from "@/lib/data/actividades-db"

interface AgregarGrupoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proyectos: Proyecto[]
  actividades: Actividad[]
  onSave: (nombre: string, actividadIds: string[]) => void
}

// ID especial para equipamientos
const EQUIPAMIENTOS_ID = "equipamientos"

export function AgregarGrupoDialog({
  open,
  onOpenChange,
  proyectos,
  actividades,
  onSave,
}: AgregarGrupoDialogProps) {
  const [nombreGrupo, setNombreGrupo] = React.useState("")
  const [selectedActividades, setSelectedActividades] = React.useState<Set<string>>(new Set())
  const [selectedEquipamientos, setSelectedEquipamientos] = React.useState<Set<string>>(new Set())
  const [expandedFederaciones, setExpandedFederaciones] = React.useState<Set<string>>(new Set())
  const [expandedAnos, setExpandedAnos] = React.useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = React.useState("")
  const [nombreError, setNombreError] = React.useState(false)

  // Agrupar por Federación > Año > Actividades
  const estructuraJerarquica = React.useMemo(() => {
    const federacionesMap = new Map<string, {
      federacion: string
      anos: Map<number, {
        año: number
        actividades: Actividad[]
        proyecto: Proyecto | null
      }>
    }>()

    actividades.forEach(actividad => {
      const proyecto = proyectos.find(p => p.id === actividad.proyectoId)
      if (!proyecto) return

      if (!federacionesMap.has(actividad.federacion)) {
        federacionesMap.set(actividad.federacion, {
          federacion: actividad.federacion,
          anos: new Map()
        })
      }

      const federacionData = federacionesMap.get(actividad.federacion)!
      
      if (!federacionData.anos.has(proyecto.año)) {
        federacionData.anos.set(proyecto.año, {
          año: proyecto.año,
          actividades: [],
          proyecto: proyecto
        })
      }

      federacionData.anos.get(proyecto.año)!.actividades.push(actividad)
    })

    // Convertir a array y ordenar
    return Array.from(federacionesMap.values()).map(fed => ({
      ...fed,
      anos: Array.from(fed.anos.values()).sort((a, b) => b.año - a.año)
    })).sort((a, b) => a.federacion.localeCompare(b.federacion))
  }, [proyectos, actividades])

  // Filtrar según búsqueda
  const estructuraFiltrada = React.useMemo(() => {
    if (!searchQuery.trim()) return estructuraJerarquica

    const query = searchQuery.toLowerCase()
    return estructuraJerarquica.map(fed => ({
      ...fed,
      anos: fed.anos.map(ano => ({
        ...ano,
        actividades: ano.actividades.filter(act => 
          act.nombre.toLowerCase().includes(query) ||
          fed.federacion.toLowerCase().includes(query) ||
          ano.año.toString().includes(query)
        )
      })).filter(ano => ano.actividades.length > 0)
    })).filter(fed => fed.anos.length > 0)
  }, [estructuraJerarquica, searchQuery])

  const toggleFederacion = (federacion: string) => {
    setExpandedFederaciones(prev => {
      const newSet = new Set(prev)
      if (newSet.has(federacion)) {
        newSet.delete(federacion)
      } else {
        newSet.add(federacion)
      }
      return newSet
    })
  }

  const toggleAno = (federacion: string, año: number) => {
    const key = `${federacion}-${año}`
    setExpandedAnos(prev => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  const toggleActividad = (actividadId: string) => {
    setSelectedActividades(prev => {
      const newSet = new Set(prev)
      if (newSet.has(actividadId)) {
        newSet.delete(actividadId)
      } else {
        newSet.add(actividadId)
      }
      return newSet
    })
  }

  const toggleEquipamientos = (federacion: string, año: number) => {
    const key = `${federacion}-${año}-equipamientos`
    setSelectedEquipamientos(prev => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  const toggleAnoCompleto = (federacion: string, año: number, actividadIds: string[]) => {
    const todasSeleccionadas = actividadIds.length > 0 && 
      actividadIds.every(id => selectedActividades.has(id))
    const equipamientosSeleccionados = selectedEquipamientos.has(`${federacion}-${año}-equipamientos`)
    const todoSeleccionado = todasSeleccionadas && equipamientosSeleccionados
    
    setSelectedActividades(prev => {
      const newSet = new Set(prev)
      if (todoSeleccionado) {
        actividadIds.forEach(id => newSet.delete(id))
      } else {
        actividadIds.forEach(id => newSet.add(id))
      }
      return newSet
    })
    
    setSelectedEquipamientos(prev => {
      const newSet = new Set(prev)
      if (todoSeleccionado) {
        newSet.delete(`${federacion}-${año}-equipamientos`)
      } else {
        newSet.add(`${federacion}-${año}-equipamientos`)
      }
      return newSet
    })
  }

  const handleSave = () => {
    if (!nombreGrupo.trim()) {
      setNombreError(true)
      return
    }
    
    const totalSeleccionado = selectedActividades.size + selectedEquipamientos.size
    if (totalSeleccionado > 0) {
      setNombreError(false)
      // Combinar actividades seleccionadas con equipamientos
      const todosIds = Array.from(selectedActividades)
      onSave(nombreGrupo.trim(), todosIds)
      setNombreGrupo("")
      setSelectedActividades(new Set())
      setSelectedEquipamientos(new Set())
      setExpandedFederaciones(new Set())
      setExpandedAnos(new Set())
      setSearchQuery("")
      setNombreError(false)
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setNombreGrupo("")
    setSelectedActividades(new Set())
    setSelectedEquipamientos(new Set())
    setExpandedFederaciones(new Set())
    setExpandedAnos(new Set())
    setSearchQuery("")
    setNombreError(false)
    onOpenChange(false)
  }

  // Reset cuando se cierra el dialog
  React.useEffect(() => {
    if (!open) {
      setNombreGrupo("")
      setSelectedActividades(new Set())
      setSelectedEquipamientos(new Set())
      setExpandedFederaciones(new Set())
      setExpandedAnos(new Set())
      setSearchQuery("")
      setNombreError(false)
    }
  }, [open])

  // Expandir automáticamente cuando hay búsqueda
  React.useEffect(() => {
    if (searchQuery.trim()) {
      // Expandir todas las federaciones que tienen resultados
      const federacionesConResultados = new Set<string>()
      const anosConResultados = new Set<string>()
      
      estructuraFiltrada.forEach(fed => {
        federacionesConResultados.add(fed.federacion)
        fed.anos.forEach(ano => {
          anosConResultados.add(`${fed.federacion}-${ano.año}`)
        })
      })
      
      setExpandedFederaciones(federacionesConResultados)
      setExpandedAnos(anosConResultados)
    } else {
      // Si no hay búsqueda, colapsar todo
      setExpandedFederaciones(new Set())
      setExpandedAnos(new Set())
    }
  }, [searchQuery, estructuraFiltrada])

  const totalSeleccionado = selectedActividades.size + selectedEquipamientos.size
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl h-[80vh] overflow-hidden flex flex-col"
        onEscapeKeyDown={(e) => {
          // Si el input de búsqueda tiene focus, prevenir el cierre del dialog
          if (searchInputRef.current === document.activeElement) {
            e.preventDefault()
            setSearchQuery("")
            searchInputRef.current?.blur()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Agregar un grupo</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Input de nombre del grupo */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="nombre-grupo">Nombre del grupo</Label>
            <Input
              id="nombre-grupo"
              value={nombreGrupo}
              onChange={(e) => {
                setNombreGrupo(e.target.value)
                if (nombreError) setNombreError(false)
              }}
              placeholder="Ej: Proyecto 1 AR"
              className={nombreError ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {nombreError && (
              <p className="text-sm text-destructive">El nombre del grupo es requerido</p>
            )}
          </div>

          {/* Árbol jerárquico */}
          <div className="flex flex-col gap-2 flex-1 overflow-hidden">
            <Label>Seleccionar actividades</Label>
            <div className="flex flex-col border rounded-lg flex-1 overflow-hidden">
              {/* Buscador */}
              <div className="flex flex-col gap-2 p-2  shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setSearchQuery("")
                        e.currentTarget.blur()
                        e.preventDefault()
                        e.stopPropagation()
                      }
                    }}
                    className={cn("pl-9", searchQuery && "pr-9")}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => {
                        setSearchQuery("")
                        searchInputRef.current?.focus()
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="overflow-y-auto flex-1 p-2">
              {estructuraFiltrada.map((federacionData) => {
                const isFederacionExpanded = expandedFederaciones.has(federacionData.federacion)

                return (
                  <div key={federacionData.federacion} className="flex flex-col">
                    {/* Nivel Federación */}
                    <div className="flex items-center gap-2 p-2 hover:bg-accent rounded-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFederacion(federacionData.federacion)}
                        className="shrink-0 cursor-pointer"
                        type="button"
                      >
                        {isFederacionExpanded ? (
                          <ChevronDown className="size-4" />
                        ) : (
                          <ChevronRight className="size-4" />
                        )}
                      </Button>
                      <span className="flex-1 text-sm font-medium">
                        {federacionData.federacion}
                      </span>
                    </div>

                    {isFederacionExpanded && (
                      <div className="ml-6 flex flex-col">
                        {federacionData.anos.map((anoData) => {
                          const anoKey = `${federacionData.federacion}-${anoData.año}`
                          const isAnoExpanded = expandedAnos.has(anoKey)
                          const todasActividadesSeleccionadas = anoData.actividades.length > 0 && 
                            anoData.actividades.every(a => selectedActividades.has(a.id))
                          const algunasActividadesSeleccionadas = anoData.actividades.some(a => selectedActividades.has(a.id))
                          const equipamientosSeleccionados = selectedEquipamientos.has(`${federacionData.federacion}-${anoData.año}-equipamientos`)
                          const todoSeleccionado = todasActividadesSeleccionadas && equipamientosSeleccionados
                          const algunasSeleccionadas = algunasActividadesSeleccionadas || equipamientosSeleccionados

                          return (
                            <div key={anoKey} className="flex flex-col">
                              {/* Nivel Año */}
                              <div className="flex items-center gap-2 p-2 hover:bg-accent rounded-sm">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleAno(federacionData.federacion, anoData.año)
                                  }}
                                  className="shrink-0 cursor-pointer"
                                  type="button"
                                >
                                  {isAnoExpanded ? (
                                    <ChevronDown className="size-4" />
                                  ) : (
                                    <ChevronRight className="size-4" />
                                  )}
                                </Button>
                                <div 
                                  className="flex items-center gap-2 flex-1 cursor-pointer"
                                  onClick={() => 
                                    toggleAnoCompleto(
                                      federacionData.federacion,
                                      anoData.año,
                                      anoData.actividades.map(a => a.id)
                                    )
                                  }
                                >
                                  <div className="relative">
                                    <Checkbox
                                      checked={todoSeleccionado}
                                      onCheckedChange={() => 
                                        toggleAnoCompleto(
                                          federacionData.federacion,
                                          anoData.año,
                                          anoData.actividades.map(a => a.id)
                                        )
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    {algunasSeleccionadas && !todoSeleccionado && (
                                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="size-2 bg-primary rounded-sm" />
                                      </div>
                                    )}
                                  </div>
                                  <span className="flex-1 text-sm font-medium">
                                    {anoData.año}
                                  </span>
                                </div>
                              </div>

                              {isAnoExpanded && (
                                <div className="ml-6 flex flex-col">
                                  {/* Actividades */}
                                  {anoData.actividades.map((actividad) => (
                                    <div
                                      key={actividad.id}
                                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-sm cursor-pointer"
                                      onClick={() => toggleActividad(actividad.id)}
                                    >
                                      <div className="w-4 shrink-0" />
                                      <Checkbox
                                        checked={selectedActividades.has(actividad.id)}
                                        onCheckedChange={() => toggleActividad(actividad.id)}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <span className="flex-1 text-sm">{actividad.nombre}</span>
                                    </div>
                                  ))}
                                  
                                  {/* Equipamientos */}
                                  <div 
                                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-sm cursor-pointer"
                                    onClick={() => toggleEquipamientos(federacionData.federacion, anoData.año)}
                                  >
                                    <div className="w-4 shrink-0" />
                                    <Checkbox
                                      checked={equipamientosSeleccionados}
                                      onCheckedChange={() => toggleEquipamientos(federacionData.federacion, anoData.año)}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <span className="flex-1 text-sm">Equipamientos</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
              </div>
            </div>
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

