"use client"

import * as React from "react"
import { FullPageModal, FullPageModalContent } from "@/components/ui/full-page-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus, Minus, Trash2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BeneficiarioViatico, GastoViatico, Viatico } from "@/lib/data/viaticos-db"

interface Gasto {
  id: string
  tipoGasto: string
  descripcion: string
  actividad: string
  costoUnitario: number
  cantidad: number
  costoTotal: number
}

interface CrearViaticoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gastosDisponibles: Gasto[]
  beneficiariosDisponibles: BeneficiarioViatico[]
  onGuardar: (viatico: Omit<Viatico, "id" | "fechaCreacion">) => void
}

type SeccionActiva = "gastos" | "beneficiarios"

export function CrearViaticoModal({
  open,
  onOpenChange,
  gastosDisponibles,
  beneficiariosDisponibles,
  onGuardar,
}: CrearViaticoModalProps) {
  const [nombreViatico, setNombreViatico] = React.useState("")
  const [gastosSeleccionados, setGastosSeleccionados] = React.useState<Map<string, GastoViatico>>(new Map())
  const [beneficiariosSeleccionados, setBeneficiariosSeleccionados] = React.useState<Set<string>>(new Set())
  const [seccionActiva, setSeccionActiva] = React.useState<SeccionActiva>("gastos")

  const handleAgregarGasto = (gasto: Gasto) => {
    const nuevoGastoViatico: GastoViatico = {
      gastoId: gasto.id,
      tipoGasto: gasto.tipoGasto,
      descripcion: gasto.descripcion,
      actividad: gasto.actividad,
      cantidadSeleccionada: gasto.cantidad,
      cantidadMaxima: gasto.cantidad,
      costoUnitario: gasto.costoUnitario,
      costoTotal: gasto.costoUnitario * gasto.cantidad,
    }

    setGastosSeleccionados(prev => {
      const newMap = new Map(prev)
      newMap.set(gasto.id, nuevoGastoViatico)
      return newMap
    })
  }

  const handleEliminarGasto = (gastoId: string) => {
    setGastosSeleccionados(prev => {
      const newMap = new Map(prev)
      newMap.delete(gastoId)
      return newMap
    })
  }

  const handleCambiarCantidad = (gastoId: string, nuevaCantidad: number) => {
    setGastosSeleccionados(prev => {
      const newMap = new Map(prev)
      const gasto = newMap.get(gastoId)
      if (gasto && nuevaCantidad > 0 && nuevaCantidad <= gasto.cantidadMaxima) {
        newMap.set(gastoId, {
          ...gasto,
          cantidadSeleccionada: nuevaCantidad,
          costoTotal: gasto.costoUnitario * nuevaCantidad,
        })
      }
      return newMap
    })
  }

  const toggleBeneficiario = (beneficiarioId: string) => {
    setBeneficiariosSeleccionados(prev => {
      const newSet = new Set(prev)
      if (newSet.has(beneficiarioId)) {
        newSet.delete(beneficiarioId)
      } else {
        newSet.add(beneficiarioId)
      }
      return newSet
    })
  }

  const costoTotalViatico = React.useMemo(() => {
    return Array.from(gastosSeleccionados.values()).reduce(
      (total, gasto) => total + gasto.costoTotal,
      0
    )
  }, [gastosSeleccionados])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleGuardar = () => {
    if (nombreViatico.trim() && gastosSeleccionados.size > 0 && beneficiariosSeleccionados.size > 0) {
      onGuardar({
        nombre: nombreViatico.trim(),
        gastos: Array.from(gastosSeleccionados.values()),
        beneficiarios: Array.from(beneficiariosSeleccionados),
        costoTotal: costoTotalViatico,
      })
      handleReset()
      onOpenChange(false)
    }
  }

  const handleReset = () => {
    setNombreViatico("")
    setGastosSeleccionados(new Map())
    setBeneficiariosSeleccionados(new Set())
    setSeccionActiva("gastos")
  }

  React.useEffect(() => {
    if (!open) {
      handleReset()
    }
  }, [open])

  return (
    <FullPageModal open={open} onOpenChange={onOpenChange}>
      <FullPageModalContent className="p-0 gap-0" showCloseButton={false}>
        {/* Header */}
        <div className="bg-background border-b border-border flex items-center justify-between p-4">
          <h2 className="text-base font-semibold">Nuevo viático</h2>
          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => onOpenChange(false)}>
            <X className="size-5" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar de navegación */}
          <div className="bg-muted w-48 p-4 flex flex-col gap-1 shrink-0">
            <button
              onClick={() => setSeccionActiva("gastos")}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium text-left transition-colors",
                seccionActiva === "gastos"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              Gastos
            </button>
            <button
              onClick={() => setSeccionActiva("beneficiarios")}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium text-left transition-colors",
                seccionActiva === "beneficiarios"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              Beneficiarios
            </button>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 overflow-y-auto p-6">
            {seccionActiva === "gastos" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-semibold">Agrega los gastos del viático</h3>
                  <p className="text-sm text-muted-foreground">Puedes elegir las cantidades</p>
                </div>

                <div className="flex flex-col border-t">
                  {gastosDisponibles.map((gasto) => {
                    const gastoSeleccionado = gastosSeleccionados.get(gasto.id)
                    const isSelected = !!gastoSeleccionado

                    return (
                      <div key={gasto.id} className="flex items-center gap-4 p-3 border-b">
                        <div className="flex-1 flex flex-col gap-2">
                          <p className="text-sm text-muted-foreground">{gasto.actividad}</p>
                          <p className="text-base font-semibold">{gasto.tipoGasto}</p>
                          <p className="text-base">{gasto.descripcion}</p>
                          <div className="text-base text-muted-foreground">
                            <p>{gasto.cantidad} unidades</p>
                            <p>{formatCurrency(gasto.costoUnitario)} c/u</p>
                          </div>
                          <p className="text-base font-medium">{formatCurrency(gasto.costoTotal)}</p>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          {isSelected ? (
                            <>
                              <div className="flex items-center gap-2">
                                <div className="border border-input rounded-lg flex items-center overflow-hidden">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-none"
                                    onClick={() => handleCambiarCantidad(gasto.id, gastoSeleccionado.cantidadSeleccionada - 1)}
                                    disabled={gastoSeleccionado.cantidadSeleccionada <= 1}
                                  >
                                    <Minus className="size-4" />
                                  </Button>
                                  <input
                                    type="number"
                                    value={gastoSeleccionado.cantidadSeleccionada}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value)
                                      if (!isNaN(value)) {
                                        handleCambiarCantidad(gasto.id, value)
                                      }
                                    }}
                                    className="w-16 h-10 text-center border-x border-input text-sm"
                                    min="1"
                                    max={gastoSeleccionado.cantidadMaxima}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-none"
                                    onClick={() => handleCambiarCantidad(gasto.id, gastoSeleccionado.cantidadSeleccionada + 1)}
                                    disabled={gastoSeleccionado.cantidadSeleccionada >= gastoSeleccionado.cantidadMaxima}
                                  >
                                    <Plus className="size-4" />
                                  </Button>
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-10 w-10"
                                  onClick={() => handleEliminarGasto(gasto.id)}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                              <p className="text-lg font-medium">{formatCurrency(gastoSeleccionado.costoTotal)}</p>
                            </>
                          ) : (
                            <Button
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => handleAgregarGasto(gasto)}
                            >
                              <Plus className="size-5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {seccionActiva === "beneficiarios" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-semibold">Selecciona los beneficiarios</h3>
                  <p className="text-sm text-muted-foreground">Elige los beneficiarios del viático</p>
                </div>

                <div className="flex flex-col border-t">
                  {beneficiariosDisponibles.map((beneficiario) => {
                    const isSelected = beneficiariosSeleccionados.has(beneficiario.id)

                    return (
                      <div
                        key={beneficiario.id}
                        className={cn(
                          "flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-accent",
                          isSelected && "bg-blue-50"
                        )}
                        onClick={() => toggleBeneficiario(beneficiario.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleBeneficiario(beneficiario.id)}
                        />
                        <div className="flex-1 flex flex-col">
                          <p className="text-sm font-medium">{beneficiario.nombre}</p>
                          <p className="text-sm text-muted-foreground">{beneficiario.rol}</p>
                        </div>
                        <div className="flex flex-col items-end text-sm">
                          <p className="font-medium">{beneficiario.documento}</p>
                          <p className="text-muted-foreground">{beneficiario.tipoDocumento}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Panel derecho de resumen */}
          <div className="border-l border-border w-96 flex flex-col shrink-0">
            <div className="p-4 flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Detalles del viático</h3>
              
              <div className="flex flex-col gap-1">
                <Label htmlFor="nombre-viatico">Nombre del viático</Label>
                <Input
                  id="nombre-viatico"
                  value={nombreViatico}
                  onChange={(e) => setNombreViatico(e.target.value)}
                  placeholder="Ejemplo: alimentación para entrenadores"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-6">
              {/* Resumen de gastos */}
              {gastosSeleccionados.size > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-semibold">{gastosSeleccionados.size} Gastos</p>
                  <div className="flex flex-col">
                    {Array.from(gastosSeleccionados.values()).map((gasto) => (
                      <div key={gasto.gastoId} className="flex flex-col gap-1 border-t pt-3 pb-3">
                        <p className="text-sm text-muted-foreground">{gasto.actividad}</p>
                        <p className="text-base font-semibold">{gasto.tipoGasto}</p>
                        <p className="text-base">{gasto.descripcion}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="border border-input rounded-lg flex items-center overflow-hidden">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-none"
                              onClick={() => handleCambiarCantidad(gasto.gastoId, gasto.cantidadSeleccionada - 1)}
                              disabled={gasto.cantidadSeleccionada <= 1}
                            >
                              <Minus className="size-4" />
                            </Button>
                            <input
                              type="number"
                              value={gasto.cantidadSeleccionada}
                              onChange={(e) => {
                                const value = parseInt(e.target.value)
                                if (!isNaN(value)) {
                                  handleCambiarCantidad(gasto.gastoId, value)
                                }
                              }}
                              className="w-16 h-10 text-center border-x border-input text-sm"
                              min="1"
                              max={gasto.cantidadMaxima}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-none"
                              onClick={() => handleCambiarCantidad(gasto.gastoId, gasto.cantidadSeleccionada + 1)}
                              disabled={gasto.cantidadSeleccionada >= gasto.cantidadMaxima}
                            >
                              <Plus className="size-4" />
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => handleEliminarGasto(gasto.gastoId)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                        <p className="text-base text-muted-foreground">{formatCurrency(gasto.costoUnitario)} c/u</p>
                        <p className="text-base font-medium">{formatCurrency(gasto.costoTotal)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resumen de beneficiarios */}
              {beneficiariosSeleccionados.size > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-semibold">{beneficiariosSeleccionados.size} Beneficiarios</p>
                  <div className="flex flex-col">
                    {Array.from(beneficiariosSeleccionados).map((beneficiarioId) => {
                      const beneficiario = beneficiariosDisponibles.find(b => b.id === beneficiarioId)
                      if (!beneficiario) return null

                      return (
                        <div key={beneficiario.id} className="flex items-start justify-between border-t pt-3 pb-3">
                          <div className="flex flex-col gap-0.5">
                            <p className="text-sm text-muted-foreground">{beneficiario.rol}</p>
                            <p className="text-base font-semibold">{beneficiario.nombre}</p>
                            <p className="text-sm text-muted-foreground">{beneficiario.documento}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => toggleBeneficiario(beneficiario.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <Button
                className="w-full gap-2"
                onClick={handleGuardar}
                disabled={!nombreViatico.trim() || gastosSeleccionados.size === 0 || beneficiariosSeleccionados.size === 0}
              >
                <Check className="size-5" />
                Guardar viático
              </Button>
            </div>
          </div>
        </div>
      </FullPageModalContent>
    </FullPageModal>
  )
}

