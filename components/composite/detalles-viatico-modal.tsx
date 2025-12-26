"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BeneficiarioViatico, GastoViatico, Viatico } from "@/lib/data/viaticos-db"

interface DetallesViaticoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  viatico: Viatico | null
  beneficiariosDisponibles: BeneficiarioViatico[]
}

export function DetallesViaticoModal({
  open,
  onOpenChange,
  viatico,
  beneficiariosDisponibles,
}: DetallesViaticoModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (!viatico) return null

  // Obtener los beneficiarios completos a partir de los IDs
  const beneficiarios = viatico.beneficiarios
    .map(id => beneficiariosDisponibles.find(b => b.id === id))
    .filter((b): b is BeneficiarioViatico => b !== undefined)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{viatico.nombre}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Sección de Gastos */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-semibold">Gastos</h3>
              <p className="text-sm text-muted-foreground">
                {viatico.gastos.length} {viatico.gastos.length === 1 ? "gasto" : "gastos"} incluidos
              </p>
            </div>

            <div className="flex flex-col border rounded-lg">
              {viatico.gastos.map((gasto, index) => (
                <div
                  key={gasto.gastoId}
                  className={cn(
                    "flex items-center gap-4 p-4",
                    index < viatico.gastos.length - 1 && "border-b"
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
          </div>

          {/* Sección de Beneficiarios */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-semibold">Beneficiarios</h3>
              <p className="text-sm text-muted-foreground">
                {beneficiarios.length} {beneficiarios.length === 1 ? "beneficiario" : "beneficiarios"} asociados
              </p>
            </div>

            <div className="flex flex-col border rounded-lg">
              {beneficiarios.map((beneficiario, index) => (
                <div
                  key={beneficiario.id}
                  className={cn(
                    "flex items-center gap-4 p-4",
                    index < beneficiarios.length - 1 && "border-b"
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

          {/* Resumen del costo total */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <p className="text-base font-semibold">Costo total del viático</p>
            <p className="text-lg font-semibold">{formatCurrency(viatico.costoTotal)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

