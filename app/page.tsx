"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { PageHeader } from "@/components/composite/page-header"
import { AnchorNav } from "@/components/composite/anchor-nav"
import { FormCard } from "@/components/composite/form-card"
import { NotionCommentThread } from "@/components/composite/notion-comment-thread"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageSquare, MoreVertical, Send } from "lucide-react"
import { ViabilizacionStatusSelector, type ViabilizacionStatus } from "@/components/composite/viabilizacion-status-selector"
import { ItineraryTimeline } from "@/components/composite/itinerary-timeline"
import { BENEFICIARIOS } from "@/lib/beneficiarios"
import { getBeneficiariosViabilizacion, saveBeneficiarioViabilizacion } from "@/lib/beneficiarios-viabilizacion"
import { useBlocks } from "@/prototype-logic/use-blocks"
import { createUserMessage } from "@/prototype-logic/message-helpers"
import type { ContentBlock } from "@/prototype-logic/types"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "ado-observaciones-generales"

interface TravelCard {
  id: string
  title: string
  itinerary: {
    sections: Array<{
      label: "Salida" | "Regreso" | "Actividad intermedia"
      items: Array<{ city: string; date: string }>
    }>
  }
  passengers: string[]
}

export default function Home() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [beneficiariosViabilizacion, setBeneficiariosViabilizacion] = useState<Record<string, ViabilizacionStatus>>({})
  const [observaciones, setObservaciones] = useState("")
  const [openThreadId, setOpenThreadId] = useState<string | null>(null)
  const [hasEnoughSpace, setHasEnoughSpace] = useState(false) // Se actualizará en el useEffect
  const [focusedThreadId, setFocusedThreadId] = useState<string | null>(null)

  // Datos de viajes
  const travelCards: TravelCard[] = [
    {
      id: "viaje-1",
      title: "Viajeros a entrenamiento en el sur",
      itinerary: {
        sections: [
          {
            label: "Salida",
            items: [
              { city: "Santiago, Chile", date: "15/04/2026" },
              { city: "Puerto Varas, Chile", date: "15/04/2026" },
            ],
          },
          {
            label: "Regreso",
            items: [
              { city: "Santiago, Chile", date: "15/04/2026" },
            ],
          },
        ],
      },
      passengers: [
        "Diego Armando Silva",
        "Joaquín Pérez Rojas",
        "Matías Fernández Soto",
        "Nicolás Torres González",
        "Sebastián Castro Muñoz",
        "Cristóbal Herrera López",
      ],
    },
    {
      id: "viaje-2",
      title: "Viaje a Buenos aires desde santiago",
      itinerary: {
        sections: [
          {
            label: "Salida",
            items: [
              { city: "Santiago, Chile", date: "15/04/2026" },
              { city: "Buenos Aires, Argentina", date: "15/04/2026" },
            ],
          },
          {
            label: "Actividad intermedia",
            items: [
              { city: "Córdoba, Argentina", date: "15/04/2026" },
            ],
          },
          {
            label: "Regreso",
            items: [
              { city: "Santiago, Chile", date: "15/04/2026" },
            ],
          },
        ],
      },
      passengers: [
        "Diego Armando Silva",
        "Joaquín Pérez Rojas",
        "Matías Fernández Soto",
        "Nicolás Torres González",
        "Sebastián Castro Muñoz",
        "Cristóbal Herrera López",
      ],
    },
    {
      id: "viaje-3",
      title: "Viaje a Buenos aires desde el sur",
      itinerary: {
        sections: [
          {
            label: "Salida",
            items: [
              { city: "Puerto Varas, Chile", date: "15/04/2026" },
              { city: "Buenos Aires, Argentina", date: "15/04/2026" },
            ],
          },
          {
            label: "Actividad intermedia",
            items: [
              { city: "Córdoba, Argentina", date: "15/04/2026" },
            ],
          },
          {
            label: "Regreso",
            items: [
              { city: "Santiago, Chile", date: "15/04/2026" },
            ],
          },
        ],
      },
      passengers: [
        "Diego Armando Silva",
        "Joaquín Pérez Rojas",
        "Matías Fernández Soto",
        "Nicolás Torres González",
        "Sebastián Castro Muñoz",
        "Cristóbal Herrera López",
      ],
    },
  ]

  // Lógica de prototipado: bloques de contenido
  const initialBlocks: ContentBlock[] = [
    { id: "sobre-actividad", title: "Sobre la actividad", viabilizacionStatus: null, messages: [] },
    { id: "beneficiarios", title: "Beneficiarios", viabilizacionStatus: null, messages: [] },
    { id: "gastos", title: "Gastos", viabilizacionStatus: null, messages: [] },
    ...travelCards.map((travel) => ({
      id: travel.id,
      title: travel.title,
      viabilizacionStatus: null,
      messages: [],
    })),
  ]

  const {
    blocks,
    activeBlock,
    activeBlockId,
    setActiveBlock,
    addMessageToBlock,
    updateBlockStatus,
    updateMessageInBlock,
    deleteMessageFromBlock,
  } = useBlocks(initialBlocks)

  // Función helper para obtener el estado de viabilización de un bloque
  const getBlockStatus = (blockId: string): ViabilizacionStatus => {
    const block = blocks.find(b => b.id === blockId)
    return block?.viabilizacionStatus || null
  }

  // Calcular progreso de beneficiarios
  const beneficiariosProgress = useMemo(() => {
    const total = BENEFICIARIOS.length
    const statusCounts = {
      viabilizado: 0,
      "pre-viabilizado": 0,
      "no-viabilizado": 0,
    }
    let withStatus = 0

    BENEFICIARIOS.forEach((beneficiario) => {
      const status = beneficiariosViabilizacion[beneficiario.name]
      if (status) {
        withStatus++
        if (status === "viabilizado") {
          statusCounts.viabilizado++
        } else if (status === "pre-viabilizado") {
          statusCounts["pre-viabilizado"]++
        } else if (status === "no-viabilizado") {
          statusCounts["no-viabilizado"]++
        }
      }
    })

    return {
      progressCount: withStatus,
      progressTotal: total,
      statusCounts: {
        viabilizado: statusCounts.viabilizado > 0 ? statusCounts.viabilizado : undefined,
        "pre-viabilizado": statusCounts["pre-viabilizado"] > 0 ? statusCounts["pre-viabilizado"] : undefined,
        "no-viabilizado": statusCounts["no-viabilizado"] > 0 ? statusCounts["no-viabilizado"] : undefined,
      },
    }
  }, [beneficiariosViabilizacion])

  // Calcular progreso de viajes
  const viajesProgress = useMemo(() => {
    const total = travelCards.length
    const statusCounts = {
      viabilizado: 0,
      "pre-viabilizado": 0,
      "no-viabilizado": 0,
    }
    let withStatus = 0

    travelCards.forEach((travel) => {
      const block = blocks.find(b => b.id === travel.id)
      if (block?.viabilizacionStatus) {
        withStatus++
        if (block.viabilizacionStatus === "viabilizado") {
          statusCounts.viabilizado++
        } else if (block.viabilizacionStatus === "pre-viabilizado") {
          statusCounts["pre-viabilizado"]++
        } else if (block.viabilizacionStatus === "no-viabilizado") {
          statusCounts["no-viabilizado"]++
        }
      }
    })

    return {
      progressCount: withStatus,
      progressTotal: total,
      statusCounts: {
        viabilizado: statusCounts.viabilizado > 0 ? statusCounts.viabilizado : undefined,
        "pre-viabilizado": statusCounts["pre-viabilizado"] > 0 ? statusCounts["pre-viabilizado"] : undefined,
        "no-viabilizado": statusCounts["no-viabilizado"] > 0 ? statusCounts["no-viabilizado"] : undefined,
      },
    }
  }, [blocks, travelCards])

  // Navegación con anchor links - recalcular cuando cambien los bloques
  const anchorNavItems = useMemo(() => [
    { id: "sobre-actividad", label: "Sobre la actividad", anchor: "sobre-actividad", viabilizacionStatus: getBlockStatus("sobre-actividad") },
    { 
      id: "beneficiarios", 
      label: "Beneficiarios", 
      anchor: "beneficiarios", 
      progressCount: beneficiariosProgress.progressCount,
      progressTotal: beneficiariosProgress.progressTotal,
      statusCounts: beneficiariosProgress.statusCounts,
    },
    { id: "gastos", label: "Gastos", anchor: "gastos", viabilizacionStatus: getBlockStatus("gastos") },
    { 
      id: "viajes", 
      label: "Viajes", 
      anchor: "viajes",
      progressCount: viajesProgress.progressCount,
      progressTotal: viajesProgress.progressTotal,
      statusCounts: viajesProgress.statusCounts,
    },
    { id: "observaciones-generales", label: "Observaciones generales", anchor: "observaciones-generales", viabilizacionStatus: null },
  ], [blocks, beneficiariosProgress, viajesProgress])

  const blockOptions = blocks.map((block) => ({
    id: block.id,
    label: block.title,
  }))

  const handleSendMessage = (blockId: string, message: string) => {
    const userMessage = createUserMessage(message)
    addMessageToBlock(blockId, userMessage)
  }

  const handleEditMessage = (blockId: string, messageId: string, updatedContent: string) => {
    updateMessageInBlock(blockId, messageId, updatedContent)
  }

  const handleDeleteMessage = (blockId: string, messageId: string) => {
    deleteMessageFromBlock(blockId, messageId)
  }

  const handleBeneficiarioViabilizacionChange = (beneficiarioName: string, status: ViabilizacionStatus) => {
    saveBeneficiarioViabilizacion(beneficiarioName, status)
    setBeneficiariosViabilizacion((prev) => {
      if (status === null) {
        const { [beneficiarioName]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [beneficiarioName]: status }
    })
  }

  // Cargar datos de beneficiarios y observaciones
  useEffect(() => {
    setIsMounted(true)
    const stored = getBeneficiariosViabilizacion()
    setBeneficiariosViabilizacion(stored)
    
    const storedObservaciones = localStorage.getItem(STORAGE_KEY)
    if (storedObservaciones) {
      setObservaciones(storedObservaciones)
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, observaciones)
    }
  }, [observaciones, isMounted])

  // Detectar ancho de pantalla para mostrar/ocultar threads
  useEffect(() => {
    const THRESHOLD = 1380 // Breakpoint para mostrar threads - CAMBIADO DE 1300 A 1380
    
    const checkWidth = () => {
      // Medir el ancho completo de la ventana (window.innerWidth)
      // Los threads deben mostrarse cuando la pantalla completa sea >= 1380px
      if (typeof window === "undefined") return
      
      const windowWidth = window.innerWidth
      // IMPORTANTE: El breakpoint es 1380, NO 1300
      const hasSpace = windowWidth >= 1380
      // Debug: activado temporalmente para verificar
      console.log('Window width:', windowWidth, 'Has enough space:', hasSpace, 'Threshold: 1380 (NO 1300)')
      setHasEnoughSpace(hasSpace)
    }
    
    // Verificar inmediatamente
    checkWidth()
    
    // También verificar después de delays para asegurar que el DOM esté listo
    const timeoutId = setTimeout(checkWidth, 0)
    const timeoutId2 = setTimeout(checkWidth, 100)
    const timeoutId3 = setTimeout(checkWidth, 300)
    
    // Escuchar cambios de tamaño de la ventana
    window.addEventListener("resize", checkWidth)
    
    // También usar ResizeObserver como respaldo
    const resizeObserver = new ResizeObserver(checkWidth)
    if (document.body) {
      resizeObserver.observe(document.body)
    }
    
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(timeoutId2)
      clearTimeout(timeoutId3)
      window.removeEventListener("resize", checkWidth)
      resizeObserver.disconnect()
    }
  }, [])

  const handleCommentClick = (blockId: string) => {
    // Si no hay suficiente espacio, siempre abrir en modal
    if (!hasEnoughSpace) {
      setOpenThreadId(blockId)
    } else {
      // Si hay suficiente espacio, el thread ya está visible inline, hacer focus en el input
      setTimeout(() => {
        const input = document.querySelector(`[data-thread-id="${blockId}"] input`) as HTMLInputElement
        if (input) {
          input.focus()
        }
      }, 50)
    }
  }


  // Campos de formulario
  const antecedentesGeneralesFields = [
    { label: "Nombre del proyecto", value: "Mundial de atletismo y carreras" },
    {
      label: "Justificación",
      value: 'La planificación del proyecto "Mundial de atletismo y carreras" en Chile se justifica desde un enfoque olímpico, ya que busca promover el deporte y la actividad física a nivel nacional. Este evento no solo elevaría el perfil del atletismo en el país, sino que también fomentaría la participación de jóvenes atletas, mejorando la infraestructura deportiva y generando un sentido de unidad y orgullo nacional. Además, al ser un evento internacional, atraerá turismo y potenciará la economía local.',
    },
    {
      label: "Objetivo",
      value: "Este proyecto tiene como objetivo promover el Mundial de Atletismo y Carreras, destacando la importancia de la competencia y el espíritu deportivo.",
    },
    {
      label: "Metas",
      value: (
        <ul className="list-disc list-inside space-y-0">
          <li>Aaumentar la participación de atletas en un 20%, mejorar la visibilidad del evento a través de redes sociales y atraer a un público diverso.</li>
          <li>También es importante garantizar la sostenibilidad del evento y fomentar el desarrollo de talentos locales.</li>
        </ul>
      ),
    },
    { label: "Próxima competencia fundamental", value: "Inaguración de los juegos" },
    { label: "País de la competencia", value: "Argentina" },
    { label: "Ciudad", value: "Buenos Aires" },
    { label: "Fecha de inicio", value: "30 septiembre 2026" },
    { label: "Fecha de fin", value: "30 octubre 2026" },
  ]

  const sobreActividadFields = [
    { label: "Nombre de la actividad", value: "Competencia de Buenos Aires" },
    {
      label: "Descripción de la actividad",
      value: "Este evento consiste en la participación a nivel mundial en una competencia de atletismo, donde atletas de diversas naciones se reúnen para competir en diferentes disciplinas.",
    },
    {
      label: "Objetivo",
      value: "Este proyecto tiene como objetivo promover el Mundial de Atletismo y Carreras, destacando la importancia de la competencia y el espíritu deportivo.",
    },
    {
      label: "Metas",
      value: (
        <ul className="list-disc list-inside space-y-0">
          <li>Aumentar la participación de atletas en un 20%, mejorar la visibilidad del evento a través de redes sociales y atraer a un público diverso.</li>
          <li>También es importante garantizar la sostenibilidad del evento y fomentar el desarrollo de talentos locales.</li>
        </ul>
      ),
    },
    { label: "Ciudad", value: "Buenos Aires" },
    { label: "País", value: "Argentina" },
    { label: "Nivel de actividad", value: "Internacional" },
    { label: "Fechas de inicio y fin", value: "19 ago 2026 - 25 ago 2026" },
    { label: "Fechas de salida y regreso", value: "19 ago 2026 - 25 ago 2026" },
    {
      label: "Recinto",
      value: (
        <>
          <p>Estadio Nacional de Buenos Aires</p>
          <p>Avenida principal 1234, Buenos Aires, Argentina.</p>
        </>
      ),
    },
    { label: "Horarios", value: "Lunes y miércoles de 8:00 a 16:00" },
    {
      label: "Categorías",
      value: (
        <>
          <p>Junior</p>
          <p>Senior</p>
        </>
      ),
    },
    {
      label: "Criterios de selección",
      value: (
        <>
          <p>Ranking selectivo nacional</p>
          <p>Controles selectivos</p>
        </>
      ),
    },
    { label: "Bases", value: "Sin bases" },
  ]

  const getBlock = (id: string) => blocks.find((b) => b.id === id)

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
        <AnchorNav items={anchorNavItems} />
        <main className="flex grow overflow-y-auto overflow-x-hidden px-4 py-2">
          <div className="flex flex-col gap-10 items-center w-full max-w-[1400px] mx-auto" data-content-wrapper>
            {/* Sección: Antecedentes */}
            <section id="antecedentes" className="flex flex-col gap-10 items-start w-full scroll-mt-20">
              <div className="flex flex-col gap-3 items-start w-full">
                <Card className="w-[600px]">
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="antecedentes" className="border-0">
                        <AccordionTrigger className="px-6 py-4 text-lg font-bold text-foreground hover:no-underline">
                          Antecedentes del proyecto
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="flex flex-col gap-6">
                            {antecedentesGeneralesFields.map((field, index) => (
                              <div key={index} className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                  {field.label}
                                </p>
                                <div className="text-base text-foreground">
                                  {typeof field.value === "string" ? (
                                    <p>{field.value}</p>
                                  ) : (
                                    field.value
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator className="w-full" />

            {/* Sección: Sobre la actividad */}
            <section id="sobre-actividad" className="flex flex-col gap-10 items-start w-full scroll-mt-20">
              <div className="flex items-center px-0 py-3 w-full">
                <h2 className="text-2xl font-medium text-foreground leading-8">
                  Sobre la actividad
                </h2>
              </div>
              <div className="flex gap-4 items-start justify-between w-full">
                <div className="flex-1 w-full max-w-[600px]">
                  {getBlock("sobre-actividad") && (
                    <FormCard
                      id="sobre-actividad"
                      title={getBlock("sobre-actividad")!.title}
                      fields={sobreActividadFields}
                      viabilizacionStatus={getBlock("sobre-actividad")!.viabilizacionStatus}
                      onViabilizacionStatusChange={(status) => updateBlockStatus("sobre-actividad", status)}
                      onComment={() => handleCommentClick("sobre-actividad")}
                      className={cn(
                        focusedThreadId === "sobre-actividad" && "ring-4 ring-ring/20 shadow-xl transition-all"
                      )}
                    />
                  )}
                </div>
                {getBlock("sobre-actividad") && hasEnoughSpace && (
                  <div className="w-[360px] shrink-0 sticky top-4 self-start">
                    <NotionCommentThread
                      messages={getBlock("sobre-actividad")!.messages}
                      onSend={(message) => handleSendMessage("sobre-actividad", message)}
                      onEdit={(messageId, updatedContent) => handleEditMessage("sobre-actividad", messageId, updatedContent)}
                      onDelete={(messageId) => handleDeleteMessage("sobre-actividad", messageId)}
                      onFocus={() => setFocusedThreadId("sobre-actividad")}
                      onBlur={() => setFocusedThreadId(null)}
                      threadId="sobre-actividad"
                    />
                  </div>
                )}
              </div>
            </section>

            <Separator className="w-full" />

            {/* Sección: Beneficiarios */}
            <section id="beneficiarios" className="flex flex-col gap-10 items-start w-full scroll-mt-20">
              <div className="flex items-center px-0 py-3 w-full">
                <h2 className="text-2xl font-medium text-foreground leading-8">
                  Beneficiarios
                </h2>
              </div>
              <div className="flex gap-4 items-start justify-between w-full">
                <div className="flex-1 w-full max-w-[920px] min-w-0">
                  {getBlock("beneficiarios") && (
                    <Card className={cn(
                      "relative gap-6 w-full transition-all",
                    getBlock("beneficiarios")?.viabilizacionStatus === "viabilizado" ? "bg-green-100 shadow-[0_2px_8px_rgba(34,197,94,0.1)]" :
                    getBlock("beneficiarios")?.viabilizacionStatus === "pre-viabilizado" ? "bg-cyan-50 shadow-[0_2px_8px_rgba(103,232,249,0.1)]" :
                    getBlock("beneficiarios")?.viabilizacionStatus === "no-viabilizado" ? "bg-orange-50 shadow-[0_2px_8px_rgba(251,146,60,0.1)]" :
                    "",
                    focusedThreadId === "beneficiarios" && "ring-4 ring-ring/20 shadow-xl"
                  )}>
                    <CardHeader>
                      <div className="flex items-start gap-2">
                        <div className="flex flex-col gap-2 grow min-w-0">
                          <CardTitle className="text-lg font-bold leading-7">
                            Beneficiarios
                          </CardTitle>
                        </div>
                        <CardAction className="absolute right-2 top-2 flex gap-1 shrink-0">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                          >
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCommentClick("beneficiarios")
                              }}
                            >
                              <MessageSquare className="size-5" />
                            </Button>
                          </motion.div>
                        </CardAction>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 min-w-0">
                      <p className="text-base font-semibold text-foreground leading-6">
                        {BENEFICIARIOS.length} Beneficiarios
                      </p>
                      <div className="border border-border rounded-md overflow-x-auto w-full min-w-0">
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow className="border-b hover:bg-transparent">
                              <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap">
                                Nombre y modalidad
                              </TableHead>
                              <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap">
                                Género
                              </TableHead>
                              <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap">
                                Rol
                              </TableHead>
                              <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap min-w-[134px]">
                                Nacionalidad
                              </TableHead>
                              <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap min-w-[132px]">
                                Documento
                              </TableHead>
                              <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap min-w-[110px]">
                                Fecha nacimiento
                              </TableHead>
                              <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap">
                                Teléfono y correo
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {BENEFICIARIOS.map((row, idx) => {
                              const beneficiarioStatus = beneficiariosViabilizacion[row.name] || null
                              const getRowBackground = () => {
                                if (beneficiarioStatus === "viabilizado") {
                                  return "bg-green-100 hover:!bg-green-100"
                                } else if (beneficiarioStatus === "pre-viabilizado") {
                                  return "bg-cyan-50 hover:!bg-cyan-50"
                                } else if (beneficiarioStatus === "no-viabilizado") {
                                  return "bg-orange-50 hover:!bg-orange-50"
                                }
                                return "hover:!bg-transparent"
                              }
                              
                              return (
                              <TableRow key={idx} className={cn("border-b", getRowBackground())}>
                                <TableCell className="p-3 align-top whitespace-normal">
                                  <div className="flex flex-col gap-2">
                                    <div>
                                      <p className="text-sm font-semibold text-foreground leading-5">
                                        {row.name}
                                      </p>
                                      <p className="text-sm text-muted-foreground leading-5">
                                        {row.modality}
                                      </p>
                                    </div>
                                    {isMounted && (
                                      <div className="pt-1">
                                        <ViabilizacionStatusSelector
                                          status={beneficiariosViabilizacion[row.name] || null}
                                          onStatusChange={(status) => handleBeneficiarioViabilizacionChange(row.name, status)}
                                          hidePreViabilizado
                                          hideLabels
                                        />
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="p-3 align-top whitespace-normal">
                                  <p className="text-sm text-foreground leading-5">
                                    {row.gender}
                                  </p>
                                </TableCell>
                                <TableCell className="p-3 align-top whitespace-normal">
                                  <p className="text-sm text-foreground leading-5">
                                    {row.role}
                                  </p>
                                </TableCell>
                                <TableCell className="p-3 align-top whitespace-normal">
                                  <p className="text-sm text-foreground leading-5">
                                    {row.nationality}
                                  </p>
                                </TableCell>
                                <TableCell className="p-3 align-top whitespace-normal">
                                  <p className="text-sm text-foreground leading-5">
                                    {row.doc}
                                  </p>
                                  <p className="text-sm text-muted-foreground leading-5">
                                    {row.docType}
                                  </p>
                                </TableCell>
                                <TableCell className="p-3 align-top whitespace-normal">
                                  <p className="text-sm text-foreground leading-5">
                                    {row.birthDate}
                                  </p>
                                </TableCell>
                                <TableCell className="p-3 align-top whitespace-normal">
                                  <p className="text-sm text-foreground leading-5">
                                    {row.phone}
                                  </p>
                                  <p className="text-sm text-muted-foreground leading-5">
                                    {row.email}
                                  </p>
                                </TableCell>
                              </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                    <div className="border-t border-border flex items-center justify-end pt-3 px-6 pb-0">
                      <Button
                        variant="ghost"
                        className="gap-1.5 h-9 px-4"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCommentClick("beneficiarios")
                        }}
                      >
                        <MessageSquare className="size-5" />
                        <span className="text-sm font-medium">Comentarios</span>
                      </Button>
                    </div>
                  </Card>
                  )}
                </div>
                {getBlock("beneficiarios") && hasEnoughSpace && (
                  <div className="w-[360px] shrink-0 sticky top-4 self-start">
                    <NotionCommentThread
                      messages={getBlock("beneficiarios")!.messages}
                      onSend={(message) => handleSendMessage("beneficiarios", message)}
                      onEdit={(messageId, updatedContent) => handleEditMessage("beneficiarios", messageId, updatedContent)}
                      onDelete={(messageId) => handleDeleteMessage("beneficiarios", messageId)}
                      onFocus={() => setFocusedThreadId("beneficiarios")}
                      onBlur={() => setFocusedThreadId(null)}
                      threadId="beneficiarios"
                    />
                  </div>
                )}
              </div>
            </section>

            <Separator className="w-full" />

            {/* Sección: Gastos */}
            <section id="gastos" className="flex flex-col gap-10 items-start w-full scroll-mt-20">
              <div className="flex items-center px-0 py-3 w-full">
                <h2 className="text-2xl font-medium text-foreground leading-8">
                  Gastos
                </h2>
              </div>
              <div className="flex gap-4 items-start justify-between w-full">
                <div className="flex-1 w-full max-w-[920px] min-w-0">
                  {getBlock("gastos") && (
                    <Card className={cn(
                      "relative gap-6 w-full transition-all",
                    getBlock("gastos")?.viabilizacionStatus === "viabilizado" ? "bg-green-100 shadow-[0_2px_8px_rgba(34,197,94,0.1)]" :
                    getBlock("gastos")?.viabilizacionStatus === "pre-viabilizado" ? "bg-cyan-50 shadow-[0_2px_8px_rgba(103,232,249,0.1)]" :
                    getBlock("gastos")?.viabilizacionStatus === "no-viabilizado" ? "bg-orange-50 shadow-[0_2px_8px_rgba(251,146,60,0.1)]" :
                    "",
                    focusedThreadId === "gastos" && "ring-4 ring-ring/20 shadow-xl"
                  )}>
                    <CardHeader>
                      <div className="flex items-start gap-2">
                        <div className="flex flex-col gap-2 grow min-w-0">
                          <CardTitle className="text-lg font-bold leading-7">
                            Gastos
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2 p-4 border border-border rounded-lg bg-background">
                        <div className="flex flex-col gap-1">
                          <p className="text-base font-medium text-foreground leading-6">
                            🟢 Gastos dentro de lo presupuestado
                          </p>
                          <p className="text-sm text-foreground leading-5">
                            No hay problemas con el total de gastos que has agregado
                          </p>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="relative h-2 bg-[#d8f999] rounded-full overflow-hidden">
                            <div className="absolute h-4 bg-[#00b8db] left-0 right-[25.25%] top-1/2 -translate-y-1/2" />
                            <div className="absolute h-4 bg-[hsl(var(--chart-3))] left-0 right-[55.75%] top-1/2 -translate-y-1/2" />
                          </div>
                          <div className="flex gap-4">
                            <div className="flex flex-col gap-0.5 grow">
                              <p className="text-xs font-medium text-foreground leading-4">
                                Presupuesto total
                              </p>
                              <p className="text-sm text-foreground leading-5">
                                $999.999.999
                              </p>
                            </div>
                            <div className="flex flex-col gap-0.5 grow">
                              <div className="flex items-center gap-2">
                                <div className="size-3 bg-[#00b8db] border border-border rounded-sm shrink-0" />
                                <p className="text-xs font-medium text-foreground leading-4">
                                  Gastos agregados
                                </p>
                              </div>
                              <p className="text-sm text-foreground leading-5">
                                $999.999.999
                              </p>
                            </div>
                            <div className="flex flex-col gap-0.5 grow">
                              <div className="flex items-center gap-2">
                                <div className="size-3 bg-[#d8f999] border border-border rounded-sm shrink-0" />
                                <p className="text-xs font-medium text-foreground leading-4">
                                  Disponible
                                </p>
                              </div>
                              <p className="text-sm text-foreground leading-5">
                                $999.999.999
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border border-border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-b hover:bg-transparent">
                              <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap min-w-[160px]">
                                Tipo de gasto
                              </TableHead>
                              <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap text-right min-w-[160px]">
                                Precio unitario
                              </TableHead>
                              <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap text-right min-w-[160px]">
                                Cantidad
                              </TableHead>
                              <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap text-right min-w-[160px]">
                                Precio total
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[
                              { type: "Alojamiento", description: "Habitación doble (16 al 25 de agosto )  x 190.000 por dia ", unitPrice: "$999.999.999", quantity: "10", total: "$999.999.999" },
                              { type: "Alojamiento", description: "Habitación doble (16 al 25 de agosto )  x 190.000 por dia ", unitPrice: "$999.999.999", quantity: "10", total: "$999.999.999" },
                              { type: "Alimentación", description: "Habitación doble (16 al 25 de agosto )  x 190.000 por dia ", unitPrice: "$999.999.999", quantity: "10", total: "$999.999.999" },
                              { type: "Alimentación", description: "Habitación doble (16 al 25 de agosto )  x 190.000 por dia ", unitPrice: "$999.999.999", quantity: "10", total: "$999.999.999" },
                            ].map((row, idx) => (
                              <TableRow key={idx} className="border-b hover:bg-transparent">
                                <TableCell className="p-3 min-h-[68px] whitespace-normal">
                                  <div className="flex flex-col gap-1">
                                    <p className="text-sm text-foreground leading-5">
                                      {row.type}
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-5 whitespace-pre-wrap">
                                      {row.description}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell className="p-3 min-h-[68px] whitespace-normal">
                                  <p className="text-sm text-foreground leading-5 text-right">
                                    {row.unitPrice}
                                  </p>
                                </TableCell>
                                <TableCell className="p-3 min-h-[68px] whitespace-normal">
                                  <p className="text-sm text-foreground leading-5 text-right">
                                    {row.quantity}
                                  </p>
                                </TableCell>
                                <TableCell className="p-3 min-h-[68px] whitespace-normal">
                                  <p className="text-sm text-foreground leading-5 text-right">
                                    {row.total}
                                  </p>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                    <div className="border-t border-border flex items-center justify-between pt-3 px-6 pb-0">
                      {getBlock("gastos") && (
                        <ViabilizacionStatusSelector
                          status={getBlock("gastos")!.viabilizacionStatus || null}
                          onStatusChange={(status) => updateBlockStatus("gastos", status)}
                        />
                      )}
                      <Button
                        variant="ghost"
                        className="gap-1.5 h-9 px-4"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCommentClick("gastos")
                        }}
                      >
                        <MessageSquare className="size-5" />
                        <span className="text-sm font-medium">Comentarios</span>
                      </Button>
                    </div>
                  </Card>
                  )}
                </div>
                {getBlock("gastos") && hasEnoughSpace && (
                  <div className="w-[360px] shrink-0 sticky top-4 self-start">
                    <NotionCommentThread
                      messages={getBlock("gastos")!.messages}
                      onSend={(message) => handleSendMessage("gastos", message)}
                      onEdit={(messageId, updatedContent) => handleEditMessage("gastos", messageId, updatedContent)}
                      onDelete={(messageId) => handleDeleteMessage("gastos", messageId)}
                      onFocus={() => setFocusedThreadId("gastos")}
                      onBlur={() => setFocusedThreadId(null)}
                      threadId="gastos"
                    />
                  </div>
                )}
              </div>
            </section>

            <Separator className="w-full" />

            {/* Sección: Viajes */}
            <section id="viajes" className="flex flex-col gap-10 items-start w-full scroll-mt-20">
              <div className="flex items-center px-0 py-3 w-full">
                <h2 className="text-2xl font-medium text-foreground leading-8">
                  Viajes
                </h2>
              </div>
              <div className="flex flex-col gap-3 items-start w-full">
                {travelCards.map((travel, index) => {
                  const block = getBlock(travel.id)
                  return (
                    <div key={travel.id} className="flex gap-4 items-start justify-between w-full">
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                        className="flex-1 max-w-[600px]"
                      >
                        <Card className={cn(
                          "relative gap-6 w-full transition-all",
                        block?.viabilizacionStatus === "viabilizado" ? "bg-green-100 shadow-[0_2px_8px_rgba(34,197,94,0.1)]" :
                        block?.viabilizacionStatus === "pre-viabilizado" ? "bg-cyan-50 shadow-[0_2px_8px_rgba(103,232,249,0.1)]" :
                        block?.viabilizacionStatus === "no-viabilizado" ? "bg-orange-50 shadow-[0_2px_8px_rgba(251,146,60,0.1)]" :
                        "",
                        focusedThreadId === travel.id && "ring-4 ring-ring/20 shadow-xl"
                      )}>
                        <CardHeader>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                              <div className="flex flex-col gap-2 grow min-w-0">
                                <CardTitle className="text-lg font-bold leading-7">
                                  {travel.title}
                                </CardTitle>
                              </div>
                              <CardAction className="absolute right-2 top-2 flex gap-1 shrink-0">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCommentClick(travel.id)
                                  }}
                                >
                                  <MessageSquare className="size-5" />
                                </Button>
                              </CardAction>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-6 px-6">
                          <div className="flex gap-6 items-start">
                            <div className="basis-0 flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
                              <ItineraryTimeline sections={travel.itinerary.sections} />
                            </div>
                            <div className="flex items-start justify-center relative shrink-0 w-[251px]">
                              <div className="basis-0 flex flex-col grow items-center min-h-px min-w-px relative shrink-0">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="border-b hover:bg-transparent">
                                      <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap">
                                        Pasajeros
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {travel.passengers.map((passenger, idx) => (
                                      <TableRow key={idx} className="border-b hover:bg-transparent">
                                        <TableCell className="p-3 h-10 whitespace-normal">
                                          <p className="text-sm text-foreground leading-5">
                                            {passenger}
                                          </p>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <div className="border-t border-border flex items-center justify-between pt-3 px-6 pb-0">
                          {block && (
                            <ViabilizacionStatusSelector
                              status={block.viabilizacionStatus || null}
                              onStatusChange={(status) => updateBlockStatus(block.id, status)}
                            />
                          )}
                          <Button
                            variant="ghost"
                            className="gap-1.5 h-9 px-4"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCommentClick(travel.id)
                            }}
                          >
                            <MessageSquare className="size-5" />
                            <span className="text-sm font-medium">Comentarios</span>
                          </Button>
                        </div>
                      </Card>
                      </motion.div>
                      {block && hasEnoughSpace && (
                        <div className="w-[360px] shrink-0 sticky top-4 self-start">
                          <NotionCommentThread
                            messages={block.messages}
                            onSend={(message) => handleSendMessage(block.id, message)}
                            onEdit={(messageId, updatedContent) => handleEditMessage(block.id, messageId, updatedContent)}
                            onDelete={(messageId) => handleDeleteMessage(block.id, messageId)}
                            onFocus={() => setFocusedThreadId(travel.id)}
                            onBlur={() => setFocusedThreadId(null)}
                            threadId={travel.id}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            <Separator className="w-full" />

            {/* Sección: Observaciones generales */}
            <section id="observaciones-generales" className="flex flex-col gap-10 items-start w-full scroll-mt-20">
              <div className="flex items-center px-0 py-3 w-full">
                <h2 className="text-2xl font-medium text-foreground leading-8">
                  Observaciones generales
                </h2>
              </div>
              <div className="flex flex-col gap-3 items-start w-full">
                <Card className="relative gap-6 w-full max-w-[600px]">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold leading-7">
                      Observaciones generales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <Textarea
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      placeholder="Escribe tus observaciones generales aquí..."
                      className="min-h-[200px]"
                    />
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </main>
        
        {/* Modal para threads en pantallas pequeñas */}
        <Dialog open={openThreadId !== null} onOpenChange={(open) => !open && setOpenThreadId(null)}>
          <DialogContent className="max-w-[400px] max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>
                {openThreadId && getBlock(openThreadId)?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">
              {openThreadId && getBlock(openThreadId) && (
                <NotionCommentThread
                  messages={getBlock(openThreadId)!.messages}
                  onSend={(message) => {
                    handleSendMessage(openThreadId, message)
                    // Si hay suficiente espacio, cerrar el modal después de un breve delay para que el estado se actualice
                    // El thread aparecerá inline automáticamente porque ahora tiene mensajes
                    if (hasEnoughSpace) {
                      setTimeout(() => {
                        setOpenThreadId(null)
                      }, 100)
                    }
                  }}
                  onEdit={(messageId, updatedContent) => handleEditMessage(openThreadId, messageId, updatedContent)}
                  onDelete={(messageId) => handleDeleteMessage(openThreadId, messageId)}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
