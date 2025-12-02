"use client"

import { useState, useEffect } from "react"
import { CenterPeekModal } from "@/components/composite/center-peek-modal"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface AclaracionesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contenido?: string
  onSave?: (contenido: string) => void
}

export function AclaracionesModal({
  open,
  onOpenChange,
  contenido = "",
  onSave,
}: AclaracionesModalProps) {
  const [texto, setTexto] = useState(contenido)

  // Sincronizar el contenido cuando cambia la prop o se abre el modal
  useEffect(() => {
    if (open) {
      setTexto(contenido)
    }
  }, [contenido, open])

  const handleSave = () => {
    if (onSave) {
      onSave(texto)
    }
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTexto(contenido) // Resetear al contenido original
    onOpenChange(false)
  }

  return (
    <CenterPeekModal 
      open={open} 
      onOpenChange={onOpenChange}
      className="w-full max-w-[700px]"
    >
      {/* Header */}
      <CenterPeekModal.Header onClose={handleCancel}>
        <div className="flex-1 flex flex-col gap-1">
          <h2 className="text-base font-semibold">Aclaraciones para la revisión</h2>
        </div>
      </CenterPeekModal.Header>

      {/* Content */}
      <CenterPeekModal.Content>
        <div className="flex flex-col gap-3 px-6 pb-3 h-full overflow-auto">
          <p className="text-sm text-muted-foreground">
            Explica cualquier detalle que consideres relevante, de esta forma puedes evitar observaciones y objeciones en la revisión
          </p>
          <div className="flex-1 flex flex-col gap-1 min-h-[200px]">
            <Textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe tus aclaraciones aquí..."
              className={cn(
                "min-h-[200px] resize-y",
                "focus-visible:ring-2 focus-visible:ring-ring"
              )}
            />
          </div>
        </div>
      </CenterPeekModal.Content>

      {/* Footer */}
      <CenterPeekModal.Footer>
        <Button variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>Guardar</Button>
      </CenterPeekModal.Footer>
    </CenterPeekModal>
  )
}

