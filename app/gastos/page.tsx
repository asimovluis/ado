"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { PageHeader } from "@/components/composite/page-header"
import { SidebarNav } from "@/components/composite/sidebar-nav"
import { ChatPanel } from "@/components/composite/chat-panel"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MessageSquare, MoreVertical, Send } from "lucide-react"
import { ViabilizacionStatusSelector } from "@/components/composite/viabilizacion-status-selector"
import { useBlocks } from "@/prototype-logic/use-blocks"
import { createUserMessage } from "@/prototype-logic/message-helpers"
import type { ContentBlock } from "@/prototype-logic/types"
import { cn } from "@/lib/utils"

export default function GastosPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false)

  const sidebarItems = [
    { id: "sobre-actividad", label: "Sobre la actividad", active: pathname === "/sobre-actividad", href: "/sobre-actividad" },
    { id: "beneficiarios", label: "Beneficiarios", active: pathname === "/beneficiarios", href: "/beneficiarios" },
    { id: "gastos", label: "Gastos", active: pathname === "/gastos", href: "/gastos" },
    { id: "viajes", label: "Viajes", active: pathname === "/viajes", href: "/viajes" },
    { id: "observaciones-generales", label: "Observaciones generales", active: pathname === "/observaciones-generales", href: "/observaciones-generales" },
  ]

  const initialBlocks: ContentBlock[] = [
    {
      id: "gastos",
      title: "Gastos",
      viabilizacionStatus: null,
      messages: [],
    },
  ]

  const {
    blocks,
    activeBlock,
    activeBlockId,
    setActiveBlock,
    addMessageToBlock,
    updateBlockStatus,
  } = useBlocks(initialBlocks)

  const blockOptions = blocks.map((block) => ({
    id: block.id,
    label: block.title,
  }))

  const handleCommentClick = (blockId: string) => {
    setActiveBlock(blockId)
    setIsChatPanelOpen(true)
  }

  const handleSendMessage = (message: string) => {
    if (activeBlockId) {
      const userMessage = createUserMessage(message)
      addMessageToBlock(activeBlockId, userMessage)
    }
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
                Gastos
              </h2>
            </div>
            <div className="flex flex-col gap-3 items-center w-full">
              <Card className={cn(
                "relative gap-6 w-full max-w-[920px]",
                blocks[0]?.viabilizacionStatus === "viabilizado" ? "bg-green-100 shadow-[0_2px_8px_rgba(34,197,94,0.1)]" :
                blocks[0]?.viabilizacionStatus === "pre-viabilizado" ? "bg-cyan-50 shadow-[0_2px_8px_rgba(103,232,249,0.1)]" :
                blocks[0]?.viabilizacionStatus === "no-viabilizado" ? "bg-orange-50 shadow-[0_2px_8px_rgba(251,146,60,0.1)]" :
                ""
              )}>
                <CardHeader>
                  <div className="flex items-start gap-2">
                    <div className="flex flex-col gap-2 grow min-w-0">
                      <CardTitle className="text-lg font-bold leading-7">
                        Gastos
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
                            handleCommentClick("gastos")
                          }}
                        >
                          <MessageSquare className="size-5" />
                        </Button>
                      </motion.div>
                    </CardAction>
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
                  {blocks[0] && (
                    <ViabilizacionStatusSelector
                      status={blocks[0].viabilizacionStatus || null}
                      onStatusChange={(status) => updateBlockStatus(blocks[0].id, status)}
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
            </div>
          </div>
        </main>
        <AnimatePresence mode="wait">
          {isChatPanelOpen && activeBlock && (
            <ChatPanel 
              messages={activeBlock.messages}
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

