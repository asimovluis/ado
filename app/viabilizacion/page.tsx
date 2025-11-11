"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/composite/page-header"
import { SidebarNav } from "@/components/composite/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreVertical, Send, Edit, FileText, CheckCircle2, XOctagon, BadgeCheck } from "lucide-react"
import { ViabilizacionFormDialog, type ViabilizacionFormData } from "@/components/composite/viabilizacion-form-dialog"
import { cn } from "@/lib/utils"
import { BENEFICIARIOS } from "@/lib/beneficiarios"

const STORAGE_KEY = "ado-viabilizacion-data"

export default function ViabilizacionPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<ViabilizacionFormData | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const sidebarItems = [
    { id: "sobre-actividad", label: "Sobre la actividad", active: pathname === "/sobre-actividad", href: "/sobre-actividad" },
    { id: "beneficiarios", label: "Beneficiarios", active: pathname === "/beneficiarios", href: "/beneficiarios" },
    { id: "gastos", label: "Gastos", active: pathname === "/gastos", href: "/gastos" },
    { id: "viajes", label: "Viajes", active: pathname === "/viajes", href: "/viajes" },
    { id: "viabilizacion", label: "Viabilización", active: pathname === "/viabilizacion", href: "/viabilizacion" },
  ]

  useEffect(() => {
    setIsMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setFormData(JSON.parse(stored))
      } catch (e) {
        console.error("Error parsing stored data:", e)
      }
    }
  }, [])

  const handleSave = (data: ViabilizacionFormData) => {
    setFormData(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  const handleEdit = () => {
    setIsDialogOpen(true)
  }

  const getTipoProductoLabels = () => {
    if (!formData) return []
    const labels: string[] = []
    if (formData.tipoProducto.implementacion) labels.push("Implementación")
    if (formData.tipoProducto.entrenamientos) labels.push("Entrenamientos y concentraciones")
    if (formData.tipoProducto.participacionCompetencias) labels.push("Participación en competencias")
    return labels
  }

  const getNecesidadesLabels = () => {
    if (!formData) return []
    const labels: string[] = []
    if (formData.necesidades.pasajes) labels.push("Pasajes")
    if (formData.necesidades.alojamientoAlimentacion) labels.push("Alojamiento y alimentación")
    if (formData.necesidades.viaticos) labels.push("Viáticos")
    if (formData.necesidades.inscripciones) labels.push("Inscripciones")
    if (formData.necesidades.serviciosVarios) labels.push("Servicios varios")
    if (formData.necesidades.implementacionDeportiva) labels.push("Implementación deportiva")
    if (formData.necesidades.arriendoRecintos) labels.push("Arriendo de recintos")
    if (formData.necesidades.otros) labels.push("Otros")
    return labels
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <span>Mundial de atletismo y carreras</span>
            <Badge variant="secondary">En revisión</Badge>
          </div>
        }
        backButtonText="Proyectos"
        onBack={() => router.push("/proyectos")}
        rightActions={
          <>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <Button variant="default" className="gap-1.5">
                <span>Enviar</span>
                <Send className="size-5" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <Button variant="ghost" size="icon">
                <MoreVertical className="size-5" />
              </Button>
            </motion.div>
          </>
        }
      />
      <div className="flex grow overflow-hidden">
        <SidebarNav items={sidebarItems} />
        <main className="flex grow flex-col gap-2 overflow-y-auto px-4 py-2">
          <div className="flex flex-col gap-10 items-center w-full">
            <div className="flex items-center px-0 py-3 w-full max-w-[920px]">
              <h2 className="text-2xl font-medium text-foreground leading-8">
                Viabilización
              </h2>
            </div>
            <div className="flex flex-col gap-3 items-center w-full">
              {!formData ? (
                // Empty state
                <Card className="relative gap-6 w-full max-w-[920px]">
                  <CardContent className="flex flex-col gap-6 items-center justify-center py-12 px-6">
                    <div className="flex flex-col gap-4 items-center text-center">
                      <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                        <FileText className="size-8 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          Formulario de viabilización
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                          Completa el formulario de viabilización técnica de la actividad
                        </p>
                      </div>
                      <Button onClick={() => setIsDialogOpen(true)} className="mt-2">
                        Completar formulario
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // Vista con datos
                <Card className="relative gap-6 w-full max-w-[920px]">
                  <CardHeader>
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col gap-2 grow min-w-0">
                        <CardTitle className="text-lg font-bold leading-7">
                          Viabilización técnica de la actividad
                        </CardTitle>
                      </div>
                      <CardAction className="absolute right-2 top-2 flex gap-1 shrink-0">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                        >
                          <Button variant="ghost" className="gap-1.5" onClick={handleEdit}>
                            <Edit className="size-4" />
                            <span className="text-sm font-medium">Editar</span>
                          </Button>
                        </motion.div>
                      </CardAction>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-6">
                    {/* ¿Se viabiliza técnicamente? */}
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        ¿Se viabiliza técnicamente la actividad?
                      </p>
                      <div className="flex items-center gap-2">
                        {formData.viabilizaTecnicamente === "si" ? (
                          <>
                            <CheckCircle2 className="size-5 text-[var(--teal-700)]" />
                            <span className="text-sm font-medium text-foreground">
                              Sí se viabiliza técnicamente
                            </span>
                          </>
                        ) : formData.viabilizaTecnicamente === "no" ? (
                          <>
                            <XOctagon className="size-5 text-red-700" />
                            <span className="text-sm font-medium text-foreground">
                              No se viabiliza técnicamente
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">No especificado</span>
                        )}
                      </div>
                    </div>

                    {/* Tipo de producto */}
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Tipo de producto viabilizado
                      </p>
                      <div className="flex flex-col gap-1">
                        {getTipoProductoLabels().length > 0 ? (
                          getTipoProductoLabels().map((label, idx) => (
                            <div key={idx} className="text-sm text-foreground">
                              • {label}
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">Ninguno seleccionado</span>
                        )}
                      </div>
                    </div>

                    {/* Necesidades */}
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Necesidades para la ejecución de la actividad
                      </p>
                      <div className="flex flex-col gap-1">
                        {getNecesidadesLabels().length > 0 ? (
                          getNecesidadesLabels().map((label, idx) => (
                            <div key={idx} className="text-sm text-foreground">
                              • {label}
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">Ninguna seleccionada</span>
                        )}
                      </div>
                    </div>

                    {/* Otras necesidades descripción */}
                    {formData.necesidades.otros && formData.otrasNecesidadesDescripcion && (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Descripción de otras necesidades
                        </p>
                        <p className="text-sm text-foreground">
                          {formData.otrasNecesidadesDescripcion}
                        </p>
                      </div>
                    )}

                    {/* Rango de presupuesto */}
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Rango de presupuesto aprobado
                      </p>
                      <p className="text-sm text-foreground">
                        {formData.rangoPresupuesto === "pre-aprobado"
                          ? "Pre-aprobado por planilla"
                          : formData.rangoPresupuesto === "ajustado"
                          ? "Ajustado con jefatura"
                          : "No especificado"}
                      </p>
                    </div>

                    {/* Beneficiarios a viabilizar */}
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Beneficiarios a viabilizar
                      </p>
                      <div className="border border-border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-b hover:bg-transparent">
                              <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap w-[48px]">
                              </TableHead>
                              <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap">
                                Nombre y modalidad
                              </TableHead>
                              <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap min-w-[96px]">
                                Nacionalidad
                              </TableHead>
                              <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap min-w-[120px]">
                                Documento
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {BENEFICIARIOS.map((beneficiario) => {
                              const isSelected = formData.beneficiariosSeleccionados.includes(beneficiario.name)
                              return (
                                <TableRow key={beneficiario.name} className="border-b hover:bg-transparent">
                                  <TableCell className="p-3 min-h-[60px]">
                                    {isSelected ? (
                                      <BadgeCheck className="size-6 text-[var(--teal-700)]" />
                                    ) : (
                                      <XOctagon className="size-6 text-destructive" />
                                    )}
                                  </TableCell>
                                  <TableCell className="p-3 min-h-[60px] whitespace-normal">
                                    <div className="flex flex-col gap-1">
                                      <p className="text-sm text-foreground leading-5">
                                        {beneficiario.name}
                                      </p>
                                      <p className="text-sm text-muted-foreground leading-5">
                                        {beneficiario.modality}
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell className="p-3 min-h-[60px] whitespace-normal">
                                    <p className="text-sm text-foreground leading-5">
                                      {beneficiario.nationality}
                                    </p>
                                  </TableCell>
                                  <TableCell className="p-3 min-h-[60px] whitespace-normal">
                                    <p className="text-sm text-foreground leading-5">
                                      {beneficiario.doc}
                                    </p>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Observaciones */}
                    {formData.observaciones && (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Observaciones
                        </p>
                        <p className="text-sm text-foreground">{formData.observaciones}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      <ViabilizacionFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={formData}
        onSave={handleSave}
      />
    </div>
  )
}
