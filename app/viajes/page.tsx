"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { PageHeader } from "@/components/composite/page-header"
import { SidebarNav } from "@/components/composite/sidebar-nav"
import { ChatPanel } from "@/components/composite/chat-panel"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ViabilizacionStatusSelector } from "@/components/composite/viabilizacion-status-selector"
import { ItineraryTimeline } from "@/components/composite/itinerary-timeline"
import { MessageSquare, MoreVertical, Send } from "lucide-react"
import { useBlocks } from "@/prototype-logic/use-blocks"
import { createUserMessage } from "@/prototype-logic/message-helpers"
import type { ContentBlock } from "@/prototype-logic/types"
import { cn } from "@/lib/utils"

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

export default function ViajesPage() {
  const router = useRouter()
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false)

  // Datos de ejemplo de viajes
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
  const initialBlocks: ContentBlock[] = travelCards.map((travel) => ({
    id: travel.id,
    title: travel.title,
    viabilizacionStatus: "pendiente" as const,
    messages: [], // Inicializar con historial limpio
  }))

  const { blocks, activeBlock, activeBlockId, setActiveBlock, updateBlockStatus, addMessageToBlock } = useBlocks(initialBlocks)

  const blockOptions = blocks.map((block) => ({
    id: block.id,
    label: block.title,
  }))

  // Handler para cuando se hace clic en el botón de comentarios de un card
  const handleCommentClick = (blockId: string) => {
    const blockExists = blocks.some((block) => block.id === blockId)
    if (blockExists) {
      setActiveBlock(blockId)
      // Abrir el panel inmediatamente
      setIsChatPanelOpen(true)
    }
  }

  // Handler para enviar mensajes
  const handleSendMessage = (message: string) => {
    if (activeBlockId) {
      const userMessage = createUserMessage(message)
      addMessageToBlock(activeBlockId, userMessage)
    }
  }

  const getBlockStatus = (blockId: string) => {
    return blocks.find((block) => block.id === blockId)?.viabilizacionStatus || "pendiente"
  }

  const sidebarItems = [
    { id: "antecedentes", label: "Antecedentes", href: "/" },
    { id: "actividades", label: "Actividades", badge: 3, href: "/actividades" },
    { id: "viajes", label: "Viajes", active: true, badge: 3, href: "/viajes" },
  ]

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <PageHeader
        title={
          <>
            Mundial de atletismo y carreras
            <Badge variant="secondary" className="ml-2">
              En revisión
            </Badge>
          </>
        }
        onBack={() => router.push("/proyectos")}
        rightActions={
          <>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <Button>
                <span>Enviar</span>
                <Send className="size-6 ml-1.5" />
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
            <div className="flex items-center px-0 py-3 w-[600px]">
              <h2 className="text-2xl font-medium text-foreground leading-8">
                Viajes
              </h2>
            </div>
            <div className="flex flex-col gap-3 items-center w-full">
              {travelCards.map((travel, index) => {
                const block = blocks.find((b) => b.id === travel.id)
                return (
                  <motion.div
                    key={travel.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Card className="relative gap-6 w-[600px]">
                      <CardHeader>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start gap-2">
                            <div className="flex flex-col gap-2 grow min-w-0">
                              <CardTitle className="text-lg font-bold leading-7">
                                {travel.title}
                              </CardTitle>
                            </div>
                            <CardAction className="absolute right-2 top-2 flex gap-1 shrink-0">
                              <ViabilizacionStatusSelector
                                status={getBlockStatus(travel.id)}
                                onStatusChange={(status) => {
                                  updateBlockStatus(travel.id, status)
                                }}
                              />
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                              >
                                <Button variant="ghost" size="icon" onClick={() => handleCommentClick(travel.id)}>
                                  <MessageSquare className="size-5" />
                                </Button>
                              </motion.div>
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
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </main>
        <AnimatePresence mode="wait">
          {isChatPanelOpen && activeBlockId && (
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

