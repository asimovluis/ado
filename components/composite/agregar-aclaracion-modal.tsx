"use client"

import { useState, useEffect } from "react"
import { CenterPeekModal } from "@/components/composite/center-peek-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface AgregarAclaracionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  titulo?: string
  contenido?: string
  onSave?: (titulo: string, contenido: string) => void
}

export function AgregarAclaracionModal({
  open,
  onOpenChange,
  titulo = "",
  contenido = "",
  onSave,
}: AgregarAclaracionModalProps) {
  const [tituloValue, setTituloValue] = useState(titulo)
  const [texto, setTexto] = useState(contenido)

  // Sincronizar el contenido cuando cambia la prop o se abre el modal
  useEffect(() => {
    if (open) {
      setTituloValue(titulo)
      setTexto(contenido)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleSave = () => {
    if (onSave && tituloValue.trim() && texto.trim()) {
      onSave(tituloValue.trim(), texto.trim())
      setTituloValue("")
      setTexto("")
    }
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTituloValue(titulo)
    setTexto(contenido)
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
          <h2 className="text-base font-semibold">Agregar aclaración</h2>
        </div>
      </CenterPeekModal.Header>

      {/* Content */}
      <CenterPeekModal.Content>
        <div className="flex flex-col gap-4 px-6 pb-3 h-full overflow-auto">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Título</label>
            <Input
              value={tituloValue}
              onChange={(e) => setTituloValue(e.target.value)}
              placeholder="Ingresa un título para la aclaración"
              className="w-full"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2 min-h-[200px]">
            <label className="text-sm font-medium">Aclaración</label>
            <Textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe tus aclaraciones aquí..."
              className={cn(
                "min-h-[200px] resize-y flex-1",
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
        <Button onClick={handleSave} disabled={!tituloValue.trim() || !texto.trim()}>
          Guardar
        </Button>
      </CenterPeekModal.Footer>
    </CenterPeekModal>
  )
}

