"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Proyecto, Actividad } from "@/lib/data/actividades-db"

interface AgregarGrupoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proyectos: Proyecto[]
  actividades: Actividad[]
  onSave: (nombre: string, actividadIds: string[]) => void
}

export function AgregarGrupoDialog({
  open,
  onOpenChange,
  proyectos,
  actividades,
  onSave,
}: AgregarGrupoDialogProps) {
  const [nombreGrupo, setNombreGrupo] = React.useState("")
  const [selectedActividades, setSelectedActividades] = React.useState<Set<string>>(new Set())
  const [expandedProyectos, setExpandedProyectos] = React.useState<Set<string>>(new Set())

  const actividadesPorProyecto = React.useMemo(() => {
    return proyectos.map(proyecto => ({
      proyecto,
      actividades: actividades.filter(a => a.proyectoId === proyecto.id)
    }))
  }, [proyectos, actividades])

  const toggleProyecto = (proyectoId: string) => {
    setExpandedProyectos(prev => {
      const newSet = new Set(prev)
      if (newSet.has(proyectoId)) {
        newSet.delete(proyectoId)
      } else {
        newSet.add(proyectoId)
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

  const toggleProyectoCompleto = (proyectoId: string, actividadIds: string[]) => {
    const todasSeleccionadas = actividadIds.length > 0 && 
      actividadIds.every(id => selectedActividades.has(id))
    
    setSelectedActividades(prev => {
      const newSet = new Set(prev)
      if (todasSeleccionadas) {
        // Deseleccionar todas
        actividadIds.forEach(id => newSet.delete(id))
      } else {
        // Seleccionar todas
        actividadIds.forEach(id => newSet.add(id))
      }
      return newSet
    })
  }

  const handleSave = () => {
    if (nombreGrupo.trim() && selectedActividades.size > 0) {
      onSave(nombreGrupo.trim(), Array.from(selectedActividades))
      setNombreGrupo("")
      setSelectedActividades(new Set())
      setExpandedProyectos(new Set())
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setNombreGrupo("")
    setSelectedActividades(new Set())
    setExpandedProyectos(new Set())
    onOpenChange(false)
  }

  // Reset cuando se cierra el dialog
  React.useEffect(() => {
    if (!open) {
      setNombreGrupo("")
      setSelectedActividades(new Set())
      setExpandedProyectos(new Set())
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Agregar un grupo</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nombre-grupo">Nombre del grupo</Label>
            <Input
              id="nombre-grupo"
              value={nombreGrupo}
              onChange={(e) => setNombreGrupo(e.target.value)}
              placeholder="Ej: Proyecto 1 AR"
            />
          </div>

          <div className="flex flex-col gap-2 flex-1 overflow-hidden">
            <Label>Seleccionar actividades</Label>
            <div className="border rounded-lg overflow-y-auto flex-1 p-2">
              {actividadesPorProyecto.map(({ proyecto, actividades: proyectoActividades }) => {
                const todasSeleccionadas = proyectoActividades.length > 0 && 
                  proyectoActividades.every(a => selectedActividades.has(a.id))
                const algunasSeleccionadas = proyectoActividades.some(a => selectedActividades.has(a.id))
                const isExpanded = expandedProyectos.has(proyecto.id)

                return (
                  <div key={proyecto.id} className="flex flex-col">
                    <div className="flex items-center gap-2 p-2 hover:bg-accent rounded-sm">
                      <button
                        onClick={() => toggleProyecto(proyecto.id)}
                        className="shrink-0"
                        type="button"
                      >
                        {isExpanded ? (
                          <ChevronDown className="size-4" />
                        ) : (
                          <ChevronRight className="size-4" />
                        )}
                      </button>
                      <div className="relative">
                        <Checkbox
                          checked={todasSeleccionadas}
                          onCheckedChange={() => 
                            toggleProyectoCompleto(proyecto.id, proyectoActividades.map(a => a.id))
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                        {algunasSeleccionadas && !todasSeleccionadas && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="size-2 bg-primary rounded-sm" />
                          </div>
                        )}
                      </div>
                      <span className="flex-1 text-sm font-medium">
                        {proyecto.nombre}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {proyectoActividades.length} actividades
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="ml-6 flex flex-col">
                        {proyectoActividades.map((actividad) => (
                          <div
                            key={actividad.id}
                            className="flex items-center gap-2 p-2 hover:bg-accent rounded-sm"
                          >
                            <div className="w-4 shrink-0" /> {/* Spacer para alineación */}
                            <Checkbox
                              checked={selectedActividades.has(actividad.id)}
                              onCheckedChange={() => toggleActividad(actividad.id)}
                            />
                            <span className="flex-1 text-sm">{actividad.nombre}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!nombreGrupo.trim() || selectedActividades.size === 0}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

