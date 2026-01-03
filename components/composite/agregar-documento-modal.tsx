"use client"

import { useState, useEffect, useRef } from "react"
import { CenterPeekModal } from "@/components/composite/center-peek-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface AgregarDocumentoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  titulo?: string
  archivo?: File
  onSave?: (titulo: string, archivo: File) => void
}

export function AgregarDocumentoModal({
  open,
  onOpenChange,
  titulo = "",
  archivo,
  onSave,
}: AgregarDocumentoModalProps) {
  const [tituloValue, setTituloValue] = useState(titulo)
  const [file, setFile] = useState<File | null>(archivo || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sincronizar el contenido cuando cambia la prop o se abre el modal
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open) {
      setTituloValue(titulo)
      setFile(archivo || null)
    }
  }, [open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      setFile(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleSave = () => {
    if (onSave && tituloValue.trim() && file) {
      onSave(tituloValue.trim(), file)
      setTituloValue("")
      setFile(null)
    }
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTituloValue(titulo)
    setFile(archivo || null)
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
          <h2 className="text-base font-semibold">Agregar documento</h2>
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
              placeholder="Ingresa un título para el documento"
              className="w-full"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2 min-h-[200px]">
            <label className="text-sm font-medium">Documento</label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={cn(
                "flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-lg",
                "hover:border-primary transition-colors cursor-pointer",
                file ? "border-primary bg-primary/5" : "border-border"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {file ? (
                <>
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="size-8 text-primary" />
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                    }}
                  >
                    Cambiar archivo
                  </Button>
                </>
              ) : (
                <>
                  <Upload className="size-12 text-muted-foreground" />
                  <div className="flex flex-col items-center gap-1 text-center">
                    <p className="text-sm font-medium text-foreground">
                      Arrastra un archivo aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CenterPeekModal.Content>

      {/* Footer */}
      <CenterPeekModal.Footer>
        <Button variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={!tituloValue.trim() || !file}>
          Guardar
        </Button>
      </CenterPeekModal.Footer>
    </CenterPeekModal>
  )
}

