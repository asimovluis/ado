"use client"

import { useState } from "react"
import { CenterPeekModal } from "@/components/composite/center-peek-modal"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertTriangle, RotateCw, Download, MoreVertical, Upload, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Validacion {
  id: string
  nombre: string
  cumplida: boolean
}

interface RequisitoDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nombre: string
  documentoSubido?: boolean
  tieneAdvertencia?: boolean
  validaciones?: Validacion[]
  documentoUrl?: string
  nombreArchivo?: string
  fechaCarga?: string
  mostrarAnalisis?: boolean
  onUpload?: (file: File) => void
  onSave?: () => void
}

export function RequisitoDocumentModal({
  open,
  onOpenChange,
  nombre,
  documentoSubido = false,
  tieneAdvertencia = false,
  validaciones = [],
  documentoUrl,
  nombreArchivo,
  fechaCarga,
  mostrarAnalisis = true,
  onUpload,
  onSave,
}: RequisitoDocumentModalProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0] && onUpload) {
      onUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUpload) {
      onUpload(e.target.files[0])
    }
  }

  const estado = documentoSubido
    ? tieneAdvertencia
      ? "con-alertas"
      : "listo"
    : "sin-documento"

  return (
    <CenterPeekModal open={open} onOpenChange={onOpenChange}>
      {/* Header */}
      <CenterPeekModal.Header onClose={() => onOpenChange(false)} />

      {/* Content */}
      <CenterPeekModal.Content>
        <div className={cn(
          "flex gap-4 px-6 pb-3 h-full overflow-hidden",
          !mostrarAnalisis && "justify-center"
        )}>
          {/* Panel izquierdo: Visualizador de documento o Upload zone */}
          <div className={cn(
            "border border-border rounded-lg overflow-hidden flex flex-col min-h-0",
            mostrarAnalisis ? "flex-1" : "flex-1 max-w-4xl"
          )}>
            {documentoSubido && documentoUrl ? (
              <>
                {/* Header del documento */}
                <div className="flex items-center justify-between p-2 border-b bg-muted/30">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium text-foreground">
                      {nombreArchivo || "documento.pdf"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {fechaCarga || "Cargado el 15 ago 2025"}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <RotateCw className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Download className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <MoreVertical className="size-4" />
                    </Button>
                  </div>
                </div>
                {/* Visualizador del documento */}
                <div className="flex-1 bg-black/80 flex items-center justify-center overflow-auto p-4">
                  <img
                    src={documentoUrl}
                    alt={nombreArchivo || "Documento"}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </>
            ) : (
              /* Upload zone */
              <div
                className="flex-1 flex flex-col items-center justify-center p-8 gap-4"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div
                  className={cn(
                    "flex flex-col items-center justify-center gap-4 w-full h-full border-2 border-dashed rounded-lg transition-colors",
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/30"
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="size-10 text-muted-foreground" />
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-sm font-medium text-foreground">
                        Arrastra un archivo aquí o haz clic para seleccionar
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, JPG, PNG hasta 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileInput}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      Seleccionar archivo
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Panel derecho: Análisis del documento */}
          {mostrarAnalisis && documentoSubido && (
            <div
              className={cn(
                "flex-1 max-w-[380px] flex flex-col gap-2 p-3 rounded-lg",
                estado === "listo"
                  ? "bg-green-50 dark:bg-green-950/20"
                  : "bg-amber-50 dark:bg-amber-950/20"
              )}
            >
              <div className="flex flex-col items-center gap-1">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    estado === "listo"
                      ? "text-green-800 dark:text-green-200"
                      : "text-amber-800 dark:text-amber-200"
                  )}
                >
                  {estado === "listo" ? "Requisito listo" : "Requisito con alertas"}
                </p>
              </div>

              <div className="flex-1 bg-background rounded-lg p-4 flex flex-col gap-4">
                {/* Icono y título */}
                <div className="flex flex-col items-center gap-1">
                  {estado === "listo" ? (
                    <CheckCircle2 className="size-8 text-green-700 dark:text-green-400" />
                  ) : (
                    <AlertTriangle className="size-8 text-amber-700 dark:text-amber-400" />
                  )}
                  <h3 className="text-lg font-semibold text-center">{nombre}</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {estado === "listo"
                      ? "El documento cumple los criterios de aceptación internos"
                      : "El documento requiere revisión"}
                  </p>
                </div>

                {/* Checklist de validaciones */}
                {validaciones.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {validaciones.map((validacion) => (
                      <div
                        key={validacion.id}
                        className="flex gap-1 items-start py-2"
                      >
                        {validacion.cumplida ? (
                          <Check className="size-5 text-green-700 dark:text-green-400 shrink-0 mt-0.5" />
                        ) : (
                          <div className="size-5 shrink-0 mt-0.5" />
                        )}
                        <p
                          className={cn(
                            "text-sm font-medium flex-1",
                            validacion.cumplida
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {validacion.nombre}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CenterPeekModal.Content>

      {/* Footer */}
      <CenterPeekModal.Footer>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        {documentoSubido && (
          <Button onClick={onSave}>Guardar</Button>
        )}
      </CenterPeekModal.Footer>
    </CenterPeekModal>
  )
}

