"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { PageHeader } from "@/components/composite/page-header"
import { SidebarNav } from "@/components/composite/sidebar-nav"
import { ChatPanel } from "@/components/composite/chat-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ViabilizacionStatusSelector, type ViabilizacionStatus } from "@/components/composite/viabilizacion-status-selector"
import { ArrowLeft, Send, MoreVertical, MessageSquare, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBlocks } from "@/prototype-logic/use-blocks"
import { createUserMessage } from "@/prototype-logic/message-helpers"
import type { ContentBlock } from "@/prototype-logic/types"

export default function ActividadPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("actividad")

  // Lógica de prototipado: bloques de contenido independientes
  const initialBlocks: ContentBlock[] = [
    {
      id: "sobre-actividad",
      title: "Sobre la actividad",
      viabilizacionStatus: "pendiente",
      messages: [],
    },
    {
      id: "mujeres-deportistas",
      title: "Mujeres deportistas",
      viabilizacionStatus: "pendiente",
      messages: [],
    },
    {
      id: "hombres-deportistas",
      title: "Hombres deportistas",
      viabilizacionStatus: "pendiente",
      messages: [],
    },
    {
      id: "mujeres-tecnico-staff",
      title: "Mujeres técnico/staff",
      viabilizacionStatus: "pendiente",
      messages: [],
    },
    {
      id: "hombres-tecnico-staff",
      title: "Hombres técnico/staff",
      viabilizacionStatus: "pendiente",
      messages: [],
    },
    {
      id: "gastos",
      title: "Gastos",
      viabilizacionStatus: "pendiente",
      messages: [],
    },
  ]

  const {
    blocks,
    activeBlock,
    activeBlockId,
    setActiveBlock,
    updateBlockStatus,
    addMessageToBlock,
  } = useBlocks(initialBlocks)

  // Preparar opciones para el selector de bloques
  const blockOptions = blocks.map((block) => ({
    id: block.id,
    label: block.title,
  }))

  // Handler para cuando se hace clic en el botón de comentarios de un card
  const handleCommentClick = (blockId: string) => {
    console.log("🔵 handleCommentClick - blockId:", blockId)
    console.log("🔵 Available blocks:", blocks.map(b => b.id))
    const blockExists = blocks.some((block) => block.id === blockId)
    console.log("🔵 Block exists:", blockExists)
    
    if (blockExists) {
      console.log("🔵 Setting active block to:", blockId)
      setActiveBlock(blockId)
      console.log("🔵 Opening chat panel")
      setIsChatPanelOpen(true)
      console.log("🔵 isChatPanelOpen:", true, "activeBlockId will be:", blockId)
    } else {
      console.error("❌ Block not found:", blockId)
    }
  }

  // Handler para enviar mensajes
  const handleSendMessage = (message: string) => {
    if (activeBlockId) {
      const userMessage = createUserMessage(message)
      addMessageToBlock(activeBlockId, userMessage)
    }
  }

  // Función helper para obtener el estado de un bloque específico
  const getBlockStatus = (blockId: string): ViabilizacionStatus => {
    const block = blocks.find((b) => b.id === blockId)
    return block?.viabilizacionStatus || "pendiente"
  }

  const sidebarItems = [
    { id: "antecedentes", label: "Antecedentes", active: false, href: "/" },
    { id: "actividades", label: "Actividades", badge: "3", active: true, href: "/actividades" },
    { id: "viajes", label: "Viajes", badge: "3", href: "/viajes" },
  ]

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
        onBack={() => router.push("/actividades")}
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
        <main className="flex grow flex-col overflow-y-auto bg-muted">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col grow w-full">
            <div className="bg-muted flex flex-col gap-0 sticky top-0 w-full z-10">
              <div className="flex gap-2 items-start px-4 py-3">
                <Button variant="ghost" size="icon" onClick={() => router.push("/actividades")}>
                  <ArrowLeft className="size-5" />
                </Button>
                <div className="flex flex-col gap-3 grow items-start justify-center min-w-0 pt-2">
                  <h2 className="text-base font-medium text-foreground leading-6">
                    Participación mundial en carrera de atletismo
                  </h2>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="size-5" />
                </Button>
              </div>
              <div className="border-b border-input relative shrink-0 w-full">
                <TabsList className="bg-transparent border-0 gap-2 h-auto items-center overflow-clip px-0 py-1 rounded-none shadow-none w-full">
                  <TabsTrigger
                    value="actividad"
                    className="border-b-2 border-transparent bg-transparent h-auto pb-3 pt-2 px-3 rounded-none shadow-none text-sm font-medium leading-5 data-[state=active]:text-foreground data-[state=active]:border-primary data-[state=inactive]:text-muted-foreground hover:text-foreground"
                  >
                    Actividad
                  </TabsTrigger>
                  <TabsTrigger
                    value="beneficiarios"
                    className="border-b-2 border-transparent bg-transparent h-auto pb-3 pt-2 px-3 rounded-none shadow-none text-sm font-medium leading-5 data-[state=active]:text-foreground data-[state=active]:border-primary data-[state=inactive]:text-muted-foreground hover:text-foreground"
                  >
                    Beneficiarios
                  </TabsTrigger>
                  <TabsTrigger
                    value="gastos"
                    className="border-b-2 border-transparent bg-transparent h-auto pb-3 pt-2 px-3 rounded-none shadow-none text-sm font-medium leading-5 data-[state=active]:text-foreground data-[state=active]:border-primary data-[state=inactive]:text-muted-foreground hover:text-foreground"
                  >
                    Gastos
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center w-full px-4 py-2">
              <TabsContent value="actividad" className="flex flex-col gap-6 items-start relative shrink-0 w-full mt-0">
                <div className="flex flex-col gap-6 items-start relative shrink-0 w-full">
                  <h3 className="text-base font-semibold text-foreground leading-6 w-full">
                    Actividad
                  </h3>
                  <div className="flex flex-col gap-3 items-center relative shrink-0 w-full">
                    <Card className="relative gap-6 w-[600px]">
                      <CardAction className="absolute right-2 top-2 flex gap-1 shrink-0">
                        <ViabilizacionStatusSelector
                          status={getBlockStatus("sobre-actividad")}
                          onStatusChange={(status) => updateBlockStatus("sobre-actividad", status)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCommentClick("sobre-actividad")
                          }}
                        >
                          <MessageSquare className="size-5" />
                        </Button>
                      </CardAction>
                      <CardHeader>
                        <CardTitle className="text-lg font-bold leading-7">
                          Sobre la actividad
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-3 px-6">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-muted-foreground leading-5">
                            Nombre de la actividad
                          </p>
                          <p className="text-base leading-6 text-foreground">
                            Mundial de atletismo y carreras
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-muted-foreground leading-5">
                            Descripción de la actividad
                          </p>
                          <p className="text-base leading-6 text-foreground">
                            Este evento consiste en la participación a nivel mundial en una competencia de atletismo, donde atletas de diversas naciones se reúnen para competir en diferentes disciplinas.
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-muted-foreground leading-5">
                            Objetivo
                          </p>
                          <p className="text-base leading-6 text-foreground">
                            Este proyecto tiene como objetivo promover el Mundial de Atletismo y Carreras, destacando la importancia de la competencia y el espíritu deportivo.
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-muted-foreground leading-5">
                            Metas
                          </p>
                          <ul className="list-disc list-inside space-y-0">
                            <li>
                              <span className="text-base leading-6 text-foreground">
                                Aaumentar la participación de atletas en un 20%, mejorar la visibilidad del evento a través de redes sociales y atraer a un público diverso.
                              </span>
                            </li>
                            <li>
                              <span className="text-base font-medium leading-6 text-foreground">
                                También es importante garantizar la sostenibilidad del evento y fomentar el desarrollo de talentos locales.
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="flex flex-col gap-1 h-12">
                          <p className="text-sm font-medium text-muted-foreground leading-5">
                            ciudad
                          </p>
                          <p className="text-base leading-6 text-foreground">
                            Buenos Aires
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 h-12">
                          <p className="text-sm font-medium text-muted-foreground leading-5">
                            País
                          </p>
                          <p className="text-base leading-6 text-foreground">
                            Argentina
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 h-12">
                          <p className="text-sm font-medium text-muted-foreground leading-5">
                            Nivel de actividad
                          </p>
                          <p className="text-base leading-6 text-foreground">
                            Internacional
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 h-12">
                          <p className="text-sm font-medium text-muted-foreground leading-5">
                            Fechas de inicio y fin
                          </p>
                          <p className="text-base leading-6 text-foreground">
                            19 ago 2026 - 25 ago 2026
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 h-12">
                          <p className="text-sm font-medium text-muted-foreground leading-5">
                            Fechas de salida y regreso
                          </p>
                          <p className="text-base leading-6 text-foreground">
                            19 ago 2026 - 25 ago 2026
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-muted-foreground leading-5">
                            Recinto
                          </p>
                          <p className="text-base leading-6 text-foreground">
                            Estadio Nacional de Buenos Aires
                          </p>
                          <p className="text-base leading-6 text-foreground">
                            Avenida principa 1234, Buenos Aires, Argentina.
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-muted-foreground leading-5">
                            Horarios
                          </p>
                          <p className="text-base leading-6 text-foreground">
                            Lunes y miércoles de 8:00 a 16:00
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-muted-foreground leading-5">
                            Categorías
                          </p>
                          <p className="text-base leading-6 text-foreground">
                            Junior
                          </p>
                          <p className="text-base leading-6 text-foreground">
                            Senior
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-muted-foreground leading-5">
                            Criterios de selección
                          </p>
                          <p className="text-base leading-6 text-foreground">
                            Ranking selectivo nacional
                          </p>
                          <p className="text-base leading-6 text-foreground">
                            Controles selectivos
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-muted-foreground leading-5">
                            Bases
                          </p>
                          <p className="text-base leading-6 text-foreground">
                            Sin bases
                          </p>
                        </div>
                      </CardContent>
                      {/* Sección de botones al final del card */}
                      <div className="border-t border-border flex items-center justify-between pt-3 px-6 pb-0">
                        <ViabilizacionStatusSelector
                          status={getBlockStatus("sobre-actividad")}
                          onStatusChange={(status) => updateBlockStatus("sobre-actividad", status)}
                        />
                        <Button
                          variant="ghost"
                          className="gap-1.5 h-9 px-4"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCommentClick("sobre-actividad")
                          }}
                        >
                          <MessageSquare className="size-5" />
                          <span className="text-sm font-medium">Comentarios</span>
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="beneficiarios" className="flex flex-col gap-6 items-start relative shrink-0 w-full mt-0">
                <div className="flex flex-col gap-6 items-start relative shrink-0 w-full px-4 py-2">
                  <h3 className="text-base font-semibold text-foreground leading-6 w-full">
                    Beneficiarios
                  </h3>
                  <div className="flex flex-col gap-3 items-center relative shrink-0 w-full">
                    <Card className="relative gap-6 w-full max-w-[920px]">
                      <CardAction className="absolute right-2 top-2 flex gap-1 shrink-0">
                        <ViabilizacionStatusSelector
                          status={getBlockStatus("mujeres-deportistas")}
                          onStatusChange={(status) => updateBlockStatus("mujeres-deportistas", status)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCommentClick("mujeres-deportistas")
                          }}
                        >
                          <MessageSquare className="size-5" />
                        </Button>
                      </CardAction>
                      <CardHeader className="flex flex-row items-start gap-2">
                        <CheckCircle2 className="size-6 text-primary shrink-0 mt-0.5" />
                        <CardTitle className="text-lg font-bold leading-7">
                          Mujeres deportistas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4">
                        <p className="text-base font-semibold text-foreground leading-6">
                          10 Mujeres deportistas
                        </p>
                      </CardContent>
                      {/* Sección de botones al final del card */}
                      <div className="border-t border-border flex items-center justify-between pt-3 px-6 pb-0">
                        <ViabilizacionStatusSelector
                          status={getBlockStatus("mujeres-deportistas")}
                          onStatusChange={(status) => updateBlockStatus("mujeres-deportistas", status)}
                        />
                        <Button
                          variant="ghost"
                          className="gap-1.5 h-9 px-4"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCommentClick("mujeres-deportistas")
                          }}
                        >
                          <MessageSquare className="size-5" />
                          <span className="text-sm font-medium">Comentarios</span>
                        </Button>
                      </div>
                    </Card>
                    <Card className="relative gap-6 w-full max-w-[920px]">
                      <CardAction className="absolute right-2 top-2 flex gap-1 shrink-0">
                        <ViabilizacionStatusSelector
                          status={getBlockStatus("hombres-deportistas")}
                          onStatusChange={(status) => updateBlockStatus("hombres-deportistas", status)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCommentClick("hombres-deportistas")
                          }}
                        >
                          <MessageSquare className="size-5" />
                        </Button>
                      </CardAction>
                      <CardHeader className="flex flex-row items-start gap-2">
                        <CheckCircle2 className="size-6 text-primary shrink-0 mt-0.5" />
                        <CardTitle className="text-lg font-bold leading-7">
                          Hombres deportistas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4">
                        <p className="text-base font-semibold text-foreground leading-6">
                          10 Hombres deportistas
                        </p>
                        <div className="border border-border rounded-md overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b hover:bg-transparent">
                                <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap">
                                  Nombre y modalidad
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
                              {[
                                { name: "Diego Armando Silva", modality: "Carreras", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "joaquindeportista@atletismo.cl" },
                                { name: "Joaquín Pérez Rojas", modality: "Carreras", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "Valentinadeportista@atletismo.cl" },
                                { name: "Matías Fernández Soto", modality: "Carreras", nationality: "Uruguaya", doc: "1234567", docType: "Pasaporte", birthDate: "01/01/1994", phone: "+56 912345678", email: "Felipedeportista@atletismo.cl" },
                                { name: "Nicolás Torres González", modality: "Carreras", nationality: "Venezolana", doc: "1234567", docType: "Pasaporte", birthDate: "01/01/1994", phone: "+56 912345678", email: "Caminadeportista@atletismo.cl" },
                                { name: "Sebastián Castro Muñoz", modality: "Carreras", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "Diegodeportista@atletismo.cl" },
                                { name: "Cristóbal Herrera López", modality: "Carreras", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "isidoradeportista@atletismo.cl" },
                              ].map((row, idx) => (
                                <TableRow key={idx} className="border-b hover:bg-transparent">
                                  <TableCell className="p-3 min-h-[60px] whitespace-normal">
                                    <p className="text-sm text-foreground leading-5">
                                      {row.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-5">
                                      {row.modality}
                                    </p>
                                  </TableCell>
                                  <TableCell className="p-3 whitespace-normal">
                                    <p className="text-sm text-foreground leading-5">
                                      {row.nationality}
                                    </p>
                                  </TableCell>
                                  <TableCell className="p-3 whitespace-normal">
                                    <p className="text-sm text-foreground leading-5">
                                      {row.doc}
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-5">
                                      {row.docType}
                                    </p>
                                  </TableCell>
                                  <TableCell className="p-3 whitespace-normal">
                                    <p className="text-sm text-foreground leading-5">
                                      {row.birthDate}
                                    </p>
                                  </TableCell>
                                  <TableCell className="p-3 whitespace-normal">
                                    <p className="text-sm text-foreground leading-5">
                                      {row.phone}
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-5">
                                      {row.email}
                                    </p>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                      {/* Sección de botones al final del card */}
                      <div className="border-t border-border flex items-center justify-between pt-3 px-6 pb-0">
                        <ViabilizacionStatusSelector
                          status={getBlockStatus("hombres-deportistas")}
                          onStatusChange={(status) => updateBlockStatus("hombres-deportistas", status)}
                        />
                        <Button
                          variant="ghost"
                          className="gap-1.5 h-9 px-4"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCommentClick("hombres-deportistas")
                          }}
                        >
                          <MessageSquare className="size-5" />
                          <span className="text-sm font-medium">Comentarios</span>
                        </Button>
                      </div>
                    </Card>
                    <Card className="relative gap-6 w-full max-w-[920px]">
                      <CardAction className="absolute right-2 top-2 flex gap-1 shrink-0">
                        <ViabilizacionStatusSelector
                          status={getBlockStatus("mujeres-tecnico-staff")}
                          onStatusChange={(status) => updateBlockStatus("mujeres-tecnico-staff", status)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCommentClick("mujeres-tecnico-staff")
                          }}
                        >
                          <MessageSquare className="size-5" />
                        </Button>
                      </CardAction>
                      <CardHeader className="flex flex-row items-start gap-2">
                        <CheckCircle2 className="size-6 text-primary shrink-0 mt-0.5" />
                        <CardTitle className="text-lg font-bold leading-7">
                          Mujeres técnico/staff
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4">
                        <p className="text-base font-semibold text-foreground leading-6">
                          10 Mujeres técnico/staff
                        </p>
                        <div className="border border-border rounded-md overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b hover:bg-transparent">
                                <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap">
                                  Nombre y modalidad
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
                                <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap min-w-[150px]">
                                  Acreditación DS22
                                </TableHead>
                                <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap min-w-[110px]">
                                  Acreditación DS22
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {[
                                { name: "Isabella Valenzuela López", role: "Entrenador", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "joaquindeportista@atletismo.cl", acreditacion1: "01/01/1994", acreditacion2: "Sí" },
                                { name: "Camila Ríos Martínez", role: "Entrenador", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "Valentinadeportista@atletismo.cl", acreditacion1: "01/01/1994", acreditacion2: "En trámite" },
                                { name: "Sofía González Pérez", role: "Entrenador", nationality: "Uruguaya", doc: "1234567", docType: "Pasaporte", birthDate: "01/01/1994", phone: "+56 912345678", email: "Felipedeportista@atletismo.cl", acreditacion1: "01/01/1994", acreditacion2: "No" },
                                { name: "Valentina Muñoz Torres", role: "Entrenador", nationality: "Venezolana", doc: "1234567", docType: "Pasaporte", birthDate: "01/01/1994", phone: "+56 912345678", email: "Caminadeportista@atletismo.cl", acreditacion1: "01/01/1994", acreditacion2: "Sí" },
                                { name: "Antonia Castro Silva", role: "Entrenador", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "Diegodeportista@atletismo.cl", acreditacion1: "01/01/1994", acreditacion2: "Sí" },
                                { name: "Fernanda Herrera Díaz", role: "Entrenador", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "isidoradeportista@atletismo.cl", acreditacion1: "01/01/1994", acreditacion2: "Sí" },
                              ].map((row, idx) => (
                                <TableRow key={idx} className="border-b hover:bg-transparent">
                                  <TableCell className="p-3 min-h-[60px] whitespace-normal">
                                    <p className="text-sm text-foreground leading-5">
                                      {row.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-5">
                                      {row.role}
                                    </p>
                                  </TableCell>
                                  <TableCell className="p-3 whitespace-normal">
                                    <p className="text-sm text-foreground leading-5">
                                      {row.nationality}
                                    </p>
                                  </TableCell>
                                  <TableCell className="p-3 whitespace-normal">
                                    <p className="text-sm text-foreground leading-5">
                                      {row.doc}
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-5">
                                      {row.docType}
                                    </p>
                                  </TableCell>
                                  <TableCell className="p-3 whitespace-normal">
                                    <p className="text-sm text-foreground leading-5">
                                      {row.birthDate}
                                    </p>
                                  </TableCell>
                                  <TableCell className="p-3 whitespace-normal">
                                    <p className="text-sm text-foreground leading-5">
                                      {row.acreditacion1}
                                    </p>
                                  </TableCell>
                                  <TableCell className="p-3 whitespace-normal">
                                    <p className="text-sm text-foreground leading-5">
                                      {row.acreditacion2}
                                    </p>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                      {/* Sección de botones al final del card */}
                      <div className="border-t border-border flex items-center justify-between pt-3 px-6 pb-0">
                        <ViabilizacionStatusSelector
                          status={getBlockStatus("mujeres-tecnico-staff")}
                          onStatusChange={(status) => updateBlockStatus("mujeres-tecnico-staff", status)}
                        />
                        <Button
                          variant="ghost"
                          className="gap-1.5 h-9 px-4"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCommentClick("mujeres-tecnico-staff")
                          }}
                        >
                          <MessageSquare className="size-5" />
                          <span className="text-sm font-medium">Comentarios</span>
                        </Button>
                      </div>
                    </Card>
                    <Card className="relative gap-6 w-full max-w-[920px]">
                      <CardAction className="absolute right-2 top-2 flex gap-1 shrink-0">
                        <ViabilizacionStatusSelector
                          status={getBlockStatus("hombres-tecnico-staff")}
                          onStatusChange={(status) => updateBlockStatus("hombres-tecnico-staff", status)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCommentClick("hombres-tecnico-staff")
                          }}
                        >
                          <MessageSquare className="size-5" />
                        </Button>
                      </CardAction>
                      <CardHeader className="flex flex-row items-start gap-2">
                        <CheckCircle2 className="size-6 text-primary shrink-0 mt-0.5" />
                        <CardTitle className="text-lg font-bold leading-7">
                          Hombres técnico/staff
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4">
                        <p className="text-base font-semibold text-foreground leading-6">
                          10 Hombres técnico/staff
                        </p>
                      </CardContent>
                      {/* Sección de botones al final del card */}
                      <div className="border-t border-border flex items-center justify-between pt-3 px-6 pb-0">
                        <ViabilizacionStatusSelector
                          status={getBlockStatus("hombres-tecnico-staff")}
                          onStatusChange={(status) => updateBlockStatus("hombres-tecnico-staff", status)}
                        />
                        <Button
                          variant="ghost"
                          className="gap-1.5 h-9 px-4"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCommentClick("hombres-tecnico-staff")
                          }}
                        >
                          <MessageSquare className="size-5" />
                          <span className="text-sm font-medium">Comentarios</span>
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="gastos" className="flex flex-col gap-6 items-start relative shrink-0 w-full mt-0">
                <div className="flex flex-col gap-6 items-start relative shrink-0 w-full px-4 py-2">
                  <h3 className="text-base font-semibold text-foreground leading-6 w-full">
                    Gastos
                  </h3>
                  <div className="flex flex-col gap-3 items-center relative shrink-0 w-full">
                    <Card className="relative gap-6 w-full max-w-[920px]">
                      <CardAction className="absolute right-2 top-2 flex gap-1 shrink-0">
                        <ViabilizacionStatusSelector
                          status={getBlockStatus("gastos")}
                          onStatusChange={(status) => updateBlockStatus("gastos", status)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCommentClick("gastos")
                          }}
                        >
                          <MessageSquare className="size-5" />
                        </Button>
                      </CardAction>
                      <CardHeader className="flex flex-row items-start gap-2">
                        <CheckCircle2 className="size-6 text-primary shrink-0 mt-0.5" />
                        <CardTitle className="text-lg font-bold leading-7">
                          Gastos
                        </CardTitle>
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
                                <TableHead className="p-3 text-sm font-medium text-muted-foreground leading-5 whitespace-nowrap">
                                  Descripción
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
                                    <p className="text-sm text-foreground leading-5">
                                      {row.type}
                                    </p>
                                  </TableCell>
                                  <TableCell className="p-3 min-h-[68px] whitespace-normal">
                                    <p className="text-sm text-foreground leading-5 whitespace-pre-wrap">
                                      {row.description}
                                    </p>
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
                      {/* Sección de botones al final del card */}
                      <div className="border-t border-border flex items-center justify-between pt-3 px-6 pb-0">
                        <ViabilizacionStatusSelector
                          status={getBlockStatus("gastos")}
                          onStatusChange={(status) => updateBlockStatus("gastos", status)}
                        />
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
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </main>
        <AnimatePresence mode="wait">
          {(() => {
            console.log("🟢 Render check - isChatPanelOpen:", isChatPanelOpen, "activeBlockId:", activeBlockId, "activeBlock:", activeBlock)
            return isChatPanelOpen && activeBlockId
          })() && (
            <ChatPanel
              viabilizacionStatus={activeBlock?.viabilizacionStatus || "pendiente"}
              onViabilizacionStatusChange={(status) => {
                if (activeBlockId) {
                  updateBlockStatus(activeBlockId, status)
                }
              }}
              messages={activeBlock?.messages || []}
              onClose={() => setIsChatPanelOpen(false)}
              onSend={handleSendMessage}
              blocks={blockOptions}
              selectedBlockId={activeBlockId}
              onBlockSelect={(blockId) => {
                setActiveBlock(blockId)
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


