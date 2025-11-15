"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BadgeCheck, XOctagon, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { BENEFICIARIOS, type Beneficiario } from "@/lib/beneficiarios"

export interface ViabilizacionFormData {
  viabilizaTecnicamente: "si" | "no" | null
  tipoProducto: {
    implementacion: boolean
    entrenamientos: boolean
    participacionCompetencias: boolean
  }
  necesidades: {
    pasajes: boolean
    alojamientoAlimentacion: boolean
    viaticos: boolean
    inscripciones: boolean
    serviciosVarios: boolean
    implementacionDeportiva: boolean
    arriendoRecintos: boolean
    otros: boolean
  }
  otrasNecesidadesDescripcion: string
  rangoPresupuesto: "pre-aprobado" | "ajustado" | null
  montoAprobado: string
  observaciones: string
  beneficiariosSeleccionados: string[]
}

interface ViabilizacionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: ViabilizacionFormData | null
  onSave: (data: ViabilizacionFormData) => void
}

export function ViabilizacionFormDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: ViabilizacionFormDialogProps) {
  const [formData, setFormData] = useState<ViabilizacionFormData>({
    viabilizaTecnicamente: null,
    tipoProducto: {
      implementacion: false,
      entrenamientos: false,
      participacionCompetencias: false,
    },
    necesidades: {
      pasajes: false,
      alojamientoAlimentacion: false,
      viaticos: false,
      inscripciones: false,
      serviciosVarios: false,
      implementacionDeportiva: false,
      arriendoRecintos: false,
      otros: false,
    },
    otrasNecesidadesDescripcion: "",
    rangoPresupuesto: null,
    montoAprobado: "",
    observaciones: "",
    beneficiariosSeleccionados: [],
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        viabilizaTecnicamente: null,
        tipoProducto: {
          implementacion: false,
          entrenamientos: false,
          participacionCompetencias: false,
        },
        necesidades: {
          pasajes: false,
          alojamientoAlimentacion: false,
          viaticos: false,
          inscripciones: false,
          serviciosVarios: false,
          implementacionDeportiva: false,
          arriendoRecintos: false,
          otros: false,
        },
        otrasNecesidadesDescripcion: "",
        rangoPresupuesto: null,
        montoAprobado: "",
        observaciones: "",
        beneficiariosSeleccionados: [],
      })
    }
  }, [initialData, open])

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Viabilización técnica de la actividad</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-10">
          {/* ¿Se viabiliza técnicamente? */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              ¿Se viabiliza técnicamente la actividad?
            </label>
            <RadioGroup
              value={formData.viabilizaTecnicamente || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, viabilizaTecnicamente: value as "si" | "no" })
              }
              className="flex gap-3"
            >
              <label
                className={cn(
                  "flex gap-2 items-center p-3 rounded-lg border-2 transition-colors grow cursor-pointer",
                  formData.viabilizaTecnicamente === "si"
                    ? "border-primary bg-accent"
                    : "border-border bg-popover"
                )}
              >
                <div className="size-10 rounded-full bg-[var(--teal-50)] flex items-center justify-center shrink-0">
                  <BadgeCheck className="size-6 text-[var(--teal-700)]" />
                </div>
                <span className="text-sm font-medium text-foreground grow">
                  Sí se viabiliza técnicamente
                </span>
                <RadioGroupItem value="si" className="shrink-0" />
              </label>
              <label
                className={cn(
                  "flex gap-2 items-center p-3 rounded-lg border-2 transition-colors grow cursor-pointer",
                  formData.viabilizaTecnicamente === "no"
                    ? "border-primary bg-accent"
                    : "border-border bg-popover"
                )}
              >
                <div className="size-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <XOctagon className="size-6 text-red-700" />
                </div>
                <span className="text-sm font-medium text-foreground grow">
                  No se viabiliza técnicamente
                </span>
                <RadioGroupItem value="no" className="shrink-0" />
              </label>
            </RadioGroup>
          </div>

          {/* Tipo de producto viabilizado */}
          <div className="flex flex-col gap-2">
            <label className="text-md font-semibold text-foreground">
              Tipo de producto viabilizado
            </label>
            <div className="flex flex-col gap-1">
              {[
                { key: "implementacion", label: "Implementación" },
                { key: "entrenamientos", label: "Entrenamientos y concentraciones" },
                { key: "participacionCompetencias", label: "Participación en competencias" },
              ].map((item) => (
                <label
                  key={item.key}
                  className={cn(
                    "flex gap-2 items-center p-3 rounded-lg border cursor-pointer transition-colors",
                    formData.tipoProducto[item.key as keyof typeof formData.tipoProducto]
                      ? "bg-accent border-input"
                      : "border-border"
                  )}
                >
                  <span className="text-sm font-medium text-foreground grow">
                    {item.label}
                  </span>
                  <Checkbox
                    checked={formData.tipoProducto[item.key as keyof typeof formData.tipoProducto]}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        tipoProducto: {
                          ...formData.tipoProducto,
                          [item.key]: checked === true,
                        },
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Necesidades */}
          <div className="flex flex-col gap-2">
            <label className="text-md font-semibold text-foreground">
              Necesidades para la ejecución de la actividad
            </label>
            <div className="flex flex-col gap-1">
              {[
                { key: "pasajes", label: "Pasajes" },
                { key: "alojamientoAlimentacion", label: "Alojamiento y alimentación" },
                { key: "viaticos", label: "Viáticos" },
                { key: "inscripciones", label: "Inscripciones" },
                { key: "serviciosVarios", label: "Servicios varios (transportes, recuperación física)" },
                { key: "implementacionDeportiva", label: "Implementación deportiva" },
                { key: "arriendoRecintos", label: "Arriendo de recintos o implementos" },
                { key: "otros", label: "Otros" },
              ].map((item) => (
                <label
                  key={item.key}
                  className={cn(
                    "flex gap-2 items-center p-3 rounded-lg border cursor-pointer transition-colors",
                    formData.necesidades[item.key as keyof typeof formData.necesidades]
                      ? "bg-accent border-input"
                      : "border-border"
                  )}
                >
                  <span className="text-sm font-medium text-foreground grow">
                    {item.label}
                  </span>
                  <Checkbox
                    checked={formData.necesidades[item.key as keyof typeof formData.necesidades]}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        necesidades: {
                          ...formData.necesidades,
                          [item.key]: checked === true,
                        },
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Descripción de otras necesidades */}
          {formData.necesidades.otros && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Describe las otras necesidades
              </label>
              <Textarea
                value={formData.otrasNecesidadesDescripcion}
                onChange={(e) =>
                  setFormData({ ...formData, otrasNecesidadesDescripcion: e.target.value })
                }
                placeholder="Describe las otras necesidades..."
                className="min-h-[80px]"
              />
            </div>
          )}

          {/* Rango de presupuesto */}
          <div className="flex flex-col gap-2">
            <label className="text-md font-semibold text-foreground">
              Rango de presupuesto aprobado
            </label>
            <RadioGroup
              value={formData.rangoPresupuesto || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, rangoPresupuesto: value as "pre-aprobado" | "ajustado" })
              }
              className="flex flex-col gap-0 border border-border rounded-lg overflow-hidden"
            >
              {[
                { value: "pre-aprobado", label: "Pre-aprobado por planilla" },
                { value: "ajustado", label: "Ajustado con jefatura" },
              ].map((item) => (
                <label
                  key={item.value}
                  className={cn(
                    "flex gap-2 items-center p-3 cursor-pointer transition-colors",
                    formData.rangoPresupuesto === item.value
                      ? "bg-accent"
                      : "bg-popover border-b border-border last:border-b-0"
                  )}
                >
                  <RadioGroupItem value={item.value} className="shrink-0" />
                  <span className="text-sm font-medium text-foreground grow">
                    {item.label}
                  </span>
                </label>
              ))}
            </RadioGroup>
            {formData.rangoPresupuesto === "ajustado" && (
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-medium text-foreground">
                  Monto aprobado
                </label>
                <Input
                  type="text"
                  value={formData.montoAprobado}
                  onChange={(e) =>
                    setFormData({ ...formData, montoAprobado: e.target.value })
                  }
                  placeholder="Ingresa el monto aprobado..."
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Beneficiarios */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <label className="text-base font-medium text-foreground">
                Seleciona los beneficiarios a viabilizar
              </label>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    formData.beneficiariosSeleccionados.length === BENEFICIARIOS.length
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({
                        ...formData,
                        beneficiariosSeleccionados: BENEFICIARIOS.map((b) => b.name),
                      })
                    } else {
                      setFormData({
                        ...formData,
                        beneficiariosSeleccionados: [],
                      })
                    }
                  }}
                />
                <span className="text-sm font-medium text-foreground">
                  Seleccionar todos
                </span>
              </div>
            </div>
            <div className="flex gap-1 items-start">
              <AlertTriangle className="size-6 text-orange-600 shrink-0 mt-0.5" />
              <p className="text-base font-medium text-foreground">
                Solo serán viabilizados los beneficiarios seleccionados
              </p>
            </div>
            <div className="flex flex-col gap-1 border border-border rounded-lg overflow-hidden">
              {BENEFICIARIOS.map((beneficiario) => (
                <label
                  key={beneficiario.name}
                  className={cn(
                    "flex gap-2 items-center p-3 border-b border-border last:border-b-0 cursor-pointer transition-colors",
                    formData.beneficiariosSeleccionados.includes(beneficiario.name)
                      ? "bg-accent"
                      : "bg-popover"
                  )}
                >
                  <div className="flex flex-col gap-1 grow min-w-0">
                    <span className="text-sm font-medium text-foreground">
                      {beneficiario.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {beneficiario.modality}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <span className="text-sm text-foreground w-20 text-right">
                      {beneficiario.nationality}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <span className="text-sm text-foreground w-24">
                      {beneficiario.doc}
                    </span>
                  </div>
                  <Checkbox
                    checked={formData.beneficiariosSeleccionados.includes(beneficiario.name)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({
                          ...formData,
                          beneficiariosSeleccionados: [
                            ...formData.beneficiariosSeleccionados,
                            beneficiario.name,
                          ],
                        })
                      } else {
                        setFormData({
                          ...formData,
                          beneficiariosSeleccionados: formData.beneficiariosSeleccionados.filter(
                            (name) => name !== beneficiario.name
                          ),
                        })
                      }
                    }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Observaciones
            </label>
            <Textarea
              value={formData.observaciones}
              onChange={(e) =>
                setFormData({ ...formData, observaciones: e.target.value })
              }
              placeholder="Observaciones..."
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

