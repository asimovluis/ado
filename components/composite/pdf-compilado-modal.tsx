"use client"

import { CenterPeekModal } from "@/components/composite/center-peek-modal"
import { Button } from "@/components/ui/button"
import { RotateCw, Download, MoreVertical } from "lucide-react"

interface Aclaracion {
  id: string
  titulo: string
  contenido: string
}

interface PdfCompiladoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nombreArchivo?: string
  documentosUrls?: string[]
  aclaraciones?: Aclaracion[]
}

export function PdfCompiladoModal({
  open,
  onOpenChange,
  nombreArchivo = "alojamiento-concentrado-españa-1.pdf",
  documentosUrls = [],
  aclaraciones,
}: PdfCompiladoModalProps) {
  return (
    <CenterPeekModal open={open} onOpenChange={onOpenChange}>
      {/* Header */}
      <CenterPeekModal.Header onClose={() => onOpenChange(false)} />

      {/* Content */}
      <CenterPeekModal.Content>
        <div className="flex gap-4 px-6 pb-3 h-full overflow-hidden">
          {/* Visualizador de documento */}
          <div className="flex-1 border border-border rounded-lg overflow-hidden flex flex-col min-h-0">
            {/* Header del documento */}
            <div className="flex items-center justify-between p-2 border-b bg-muted/30">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-foreground">
                  {nombreArchivo}
                </p>
                <p className="text-xs text-muted-foreground">
                  1.3 mb · PDF
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
            {/* Visualizador del PDF compilado */}
            <div className="flex-1 bg-black/80 flex flex-col items-center justify-center overflow-auto p-4 gap-4">
              {documentosUrls.length > 0 ? (
                <>
                  {documentosUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Página ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  ))}
                  {aclaraciones && aclaraciones.length > 0 && (
                    <div className="bg-background rounded-lg p-6 max-w-full w-full space-y-4">
                      <h3 className="text-lg font-semibold mb-3">Aclaraciones para la revisión</h3>
                      {aclaraciones.map((aclaracion) => (
                        <div key={aclaracion.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                          <h4 className="text-base font-semibold mb-2">{aclaracion.titulo}</h4>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-sm text-foreground whitespace-pre-wrap">
                              {aclaracion.contenido}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground text-sm">
                  No hay documentos para mostrar
                </div>
              )}
            </div>
          </div>
        </div>
      </CenterPeekModal.Content>

      {/* Footer */}
      <CenterPeekModal.Footer>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cerrar
        </Button>
      </CenterPeekModal.Footer>
    </CenterPeekModal>
  )
}

