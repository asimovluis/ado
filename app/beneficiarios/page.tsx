"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { BENEFICIARIOS } from "@/lib/beneficiarios"
import { AnimatePresence, motion } from "framer-motion"
import { PageHeader } from "@/components/composite/page-header"
import { SidebarNav } from "@/components/composite/sidebar-nav"
import { ChatPanel } from "@/components/composite/chat-panel"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MessageSquare, MoreVertical, Send } from "lucide-react"
import { useBlocks } from "@/prototype-logic/use-blocks"
import { createUserMessage } from "@/prototype-logic/message-helpers"
import type { ContentBlock } from "@/prototype-logic/types"

export default function BeneficiariosPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false)

  const sidebarItems = [
    { id: "sobre-actividad", label: "Sobre la actividad", active: pathname === "/sobre-actividad", href: "/sobre-actividad" },
    { id: "beneficiarios", label: "Beneficiarios", active: pathname === "/beneficiarios", href: "/beneficiarios" },
    { id: "gastos", label: "Gastos", active: pathname === "/gastos", href: "/gastos" },
    { id: "viajes", label: "Viajes", active: pathname === "/viajes", href: "/viajes" },
    { id: "viabilizacion", label: "Viabilización", active: pathname === "/viabilizacion", href: "/viabilizacion" },
  ]

  const initialBlocks: ContentBlock[] = [
    {
      id: "beneficiarios",
      title: "Beneficiarios",
      viabilizacionStatus: "pendiente",
      messages: [],
    },
  ]

  const {
    blocks,
    activeBlock,
    activeBlockId,
    setActiveBlock,
    addMessageToBlock,
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

  // Usar la constante compartida de beneficiarios
  const beneficiarios = BENEFICIARIOS

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
                Beneficiarios
              </h2>
            </div>
            <div className="flex flex-col gap-3 items-center w-full">
              <Card className="relative gap-6 w-full max-w-[920px]">
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
                <CardContent className="flex flex-col gap-4">
                  <p className="text-base font-semibold text-foreground leading-6">
                    {beneficiarios.length} Beneficiarios
                  </p>
                  <div className="border border-border rounded-md overflow-hidden">
                    <Table>
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
                        {beneficiarios.map((row, idx) => (
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
                                {row.gender}
                              </p>
                            </TableCell>
                            <TableCell className="p-3 whitespace-normal">
                              <p className="text-sm text-foreground leading-5">
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

