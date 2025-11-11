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
import { BadgeCheck, XOctagon } from "lucide-react"
import { cn } from "@/lib/utils"

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

        <div className="flex flex-col gap-5">
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
            <label className="text-sm font-medium text-foreground">
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
            <label className="text-sm font-medium text-foreground">
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
            <label className="text-sm font-medium text-foreground">
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

