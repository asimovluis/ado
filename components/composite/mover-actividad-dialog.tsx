"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Grupo {
  id: string
  nombre: string
}

interface MoverActividadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  grupos: Grupo[]
  actividadNombre: string
  grupoActualId: string
  onMover: (grupoDestinoId: string) => void
}

export function MoverActividadDialog({
  open,
  onOpenChange,
  grupos,
  actividadNombre,
  grupoActualId,
  onMover,
}: MoverActividadDialogProps) {
  const [selectedGrupoId, setSelectedGrupoId] = React.useState<string>("")

  const gruposDisponibles = React.useMemo(() => {
    return grupos.filter(g => g.id !== grupoActualId)
  }, [grupos, grupoActualId])

  const handleMover = () => {
    if (selectedGrupoId) {
      onMover(selectedGrupoId)
      setSelectedGrupoId("")
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setSelectedGrupoId("")
    onOpenChange(false)
  }

  // Reset cuando se cierra el dialog
  React.useEffect(() => {
    if (!open) {
      setSelectedGrupoId("")
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mover actividad a otro grupo</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            Selecciona el grupo al que deseas mover la actividad:
            <span className="font-medium text-foreground ml-1">{actividadNombre}</span>
          </p>

          {gruposDisponibles.length > 0 ? (
            <RadioGroup value={selectedGrupoId} onValueChange={setSelectedGrupoId}>
              {gruposDisponibles.map((grupo) => (
                <div key={grupo.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={grupo.id} id={grupo.id} />
                  <Label htmlFor={grupo.id} className="cursor-pointer flex-1">
                    {grupo.nombre}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay otros grupos disponibles
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleMover}
            disabled={!selectedGrupoId || gruposDisponibles.length === 0}
          >
            Mover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

