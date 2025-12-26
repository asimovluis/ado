"use client"

import { CenterPeekModal } from "@/components/composite/center-peek-modal"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface InformeCierreModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nombreArchivo?: string
  pdfUrl?: string
}

export function InformeCierreModal({
  open,
  onOpenChange,
  nombreArchivo = "informe-cierre.pdf",
  pdfUrl = "http://localhost:3845/assets/075f59aeb7f1e24458d70e299802f5aa2618a799.png",
}: InformeCierreModalProps) {
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
                  <Download className="size-4" />
                </Button>
              </div>
            </div>
            {/* Visualizador del PDF */}
            <div className="flex-1 bg-black/80 flex items-center justify-center overflow-auto p-4">
              {pdfUrl ? (
                <img
                  src={pdfUrl}
                  alt="Informe de cierre"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-muted-foreground text-sm">
                  No hay documento para mostrar
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

