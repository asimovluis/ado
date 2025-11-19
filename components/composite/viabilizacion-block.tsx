"use client"

import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Pencil, BadgeCheck, XOctagon, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ViabilizacionFormData, SectionComments } from "./viabilizacion-form-dialog"
import { BENEFICIARIOS } from "@/lib/beneficiarios"

interface ViabilizacionBlockProps {
    data: ViabilizacionFormData | null
    onOpenForm: () => void
    className?: string
    sectionComments?: SectionComments[]
}

export function ViabilizacionBlock({ data, onOpenForm, className, sectionComments = [] }: ViabilizacionBlockProps) {
    if (!data) {
        return (
            <Card className={cn("w-full flex flex-col items-center justify-center py-16 gap-6", className)}>
                <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="size-8 text-muted-foreground" />
                </div>
                <div className="flex flex-col items-center gap-2 text-center max-w-md">
                    <h3 className="text-lg font-semibold text-foreground">
                        Formulario de viabilización
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Completa el formulario de viabilización técnica de la actividad
                    </p>
                </div>
                <Button onClick={onOpenForm} variant="default">
                    Completar formulario
                </Button>
            </Card>
        )
    }

    return (
        <Card className={cn("w-full", className)}>
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg font-bold leading-7">
                        Viabilización técnica de la actividad
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={onOpenForm} className="gap-1.5 h-8">
                        <Pencil className="size-3.5" />
                        <span>Editar</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-8">
                {/* ¿Se viabiliza? */}
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-muted-foreground">
                        ¿Se viabiliza técnicamente la actividad?
                    </p>
                    <div className="flex items-center gap-2">
                        {data.viabilizaTecnicamente === "si" ? (
                            <>
                                <BadgeCheck className="size-8 text-[var(--teal-700)]" />
                                <span className="text-xl font-semibold text-foreground">
                                    Sí se viabiliza técnicamente
                                </span>
                            </>
                        ) : data.viabilizaTecnicamente === "con-indicaciones" ? (
                            <>
                                <BadgeCheck className="size-8 text-blue-700" />
                                <span className="text-xl font-semibold text-foreground">
                                    Se viabiliza con indicaciones
                                </span>
                            </>
                        ) : (
                            <>
                                <XOctagon className="size-8 text-destructive" />
                                <span className="text-xl font-semibold text-foreground">
                                    No se viabiliza técnicamente
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Tipo de producto */}
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-muted-foreground">
                        Tipo de producto viabilizado
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                        {data.tipoProducto.implementacion && (
                            <li className="text-sm text-foreground">Implementación</li>
                        )}
                        {data.tipoProducto.entrenamientos && (
                            <li className="text-sm text-foreground">Entrenamientos y concentraciones</li>
                        )}
                        {data.tipoProducto.participacionCompetencias && (
                            <li className="text-sm text-foreground">Participación en competencias</li>
                        )}
                    </ul>
                </div>

                {/* Necesidades */}
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-muted-foreground">
                        Necesidades para la ejecución de la actividad
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                        {data.necesidades.pasajes && <li className="text-sm text-foreground">Pasajes</li>}
                        {data.necesidades.alojamientoAlimentacion && <li className="text-sm text-foreground">Alojamiento y alimentación</li>}
                        {data.necesidades.viaticos && <li className="text-sm text-foreground">Viáticos</li>}
                        {data.necesidades.inscripciones && <li className="text-sm text-foreground">Inscripciones</li>}
                        {data.necesidades.serviciosVarios && <li className="text-sm text-foreground">Servicios varios</li>}
                        {data.necesidades.implementacionDeportiva && <li className="text-sm text-foreground">Implementación deportiva</li>}
                        {data.necesidades.arriendoRecintos && <li className="text-sm text-foreground">Arriendo de recintos</li>}
                        {data.necesidades.otros && (
                            <li className="text-sm text-foreground">
                                Otros: {data.otrasNecesidadesDescripcion}
                            </li>
                        )}
                    </ul>
                </div>

                {/* Presupuesto */}
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-muted-foreground">
                        Rango de presupuesto aprobado
                    </p>
                    <p className="text-base font-medium text-foreground">
                        {data.rangoPresupuesto === "pre-aprobado"
                            ? "Pre-aprobado por planilla"
                            : "Ajustado con jefatura"}
                    </p>
                    {data.rangoPresupuesto === "pre-aprobado" && (
                        <p className="text-sm text-muted-foreground">
                            Monto: $10.000.000
                        </p>
                    )}
                    {data.rangoPresupuesto === "ajustado" && data.montoAprobado && (
                        <p className="text-sm text-muted-foreground">
                            Monto: {data.montoAprobado}
                        </p>
                    )}
                </div>

                {/* Beneficiarios */}
                <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium text-muted-foreground">
                        Beneficiarios a viabilizar
                    </p>
                    <div className="border border-border rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="p-3 font-medium text-muted-foreground">Nombre y modalidad</th>
                                    <th className="p-3 font-medium text-muted-foreground">Nacionalidad</th>
                                    <th className="p-3 font-medium text-muted-foreground">Documento</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {BENEFICIARIOS.map((beneficiario, idx) => {
                                    const isIncomplete = beneficiario.isIncomplete || !beneficiario.name
                                    const uniqueKey = beneficiario.name || `incomplete-${idx}`
                                    const isSelected = beneficiario.name ? data.beneficiariosSeleccionados.includes(beneficiario.name) : false
                                    return (
                                        <tr key={uniqueKey} className="bg-background">
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    {!isIncomplete && (
                                                        <div className={cn(
                                                            "size-6 rounded-full flex items-center justify-center shrink-0",
                                                            isSelected
                                                                ? "bg-[var(--teal-50)] text-[var(--teal-700)]"
                                                                : "bg-destructive/10 text-destructive"
                                                        )}>
                                                            {isSelected ? (
                                                                <BadgeCheck className="size-4" />
                                                            ) : (
                                                                <XOctagon className="size-4" />
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        {isIncomplete ? (
                                                            <>
                                                                <span className="text-muted-foreground italic">No se ha indicado quién es</span>
                                                                <span className="text-muted-foreground">{beneficiario.gender} - {beneficiario.role}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="font-medium text-foreground">{beneficiario.name}</span>
                                                                <span className="text-muted-foreground">{beneficiario.modality}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 text-foreground">
                                                {isIncomplete ? <span className="text-muted-foreground italic">—</span> : beneficiario.nationality}
                                            </td>
                                            <td className="p-3 text-foreground">
                                                {isIncomplete ? <span className="text-muted-foreground italic">—</span> : beneficiario.doc}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Observaciones */}
                {data.observaciones && (
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-muted-foreground">
                            Observaciones
                        </p>
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                            {data.observaciones}
                        </p>
                    </div>
                )}

                {/* Comentarios por sección */}
                {sectionComments && sectionComments.length > 0 && sectionComments.some((s) => s.messages.length > 0) && (
                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium text-muted-foreground">
                            Comentarios por sección
                        </p>
                        <div className="flex flex-col gap-4">
                            {sectionComments
                                .filter((section) => section.messages.length > 0)
                                .map((section) => (
                                    <div key={section.sectionId} className="flex flex-col gap-2">
                                        <h4 className="text-sm font-semibold text-foreground">
                                            {section.sectionTitle}
                                        </h4>
                                        <ul className="flex flex-col gap-2 list-disc list-inside">
                                            {section.messages.map((message) => (
                                                <li key={message.id} className="text-sm text-foreground">
                                                    {typeof message.content === "string"
                                                        ? message.content
                                                        : String(message.content)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
