"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { PageHeader } from "@/components/composite/page-header"
import { SidebarNav } from "@/components/composite/sidebar-nav"
import { FormCard } from "@/components/composite/form-card"
import { ChatPanel } from "@/components/composite/chat-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, MoreVertical, Send, ArrowRight } from "lucide-react"
import { useBlocks } from "@/prototype-logic/use-blocks"
import { createUserMessage } from "@/prototype-logic/message-helpers"
import type { ContentBlock } from "@/prototype-logic/types"

export default function Home() {
  const router = useRouter()
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false)

  // Lógica de prototipado: bloques de contenido
  const initialBlocks: ContentBlock[] = [
    {
      id: "antecedentes",
      title: "Antecedentes del proyecto",
      viabilizacionStatus: null,
      messages: [], // Inicializar con historial limpio
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
  const pathname = usePathname()
  const sidebarItems = [
    { id: "sobre-actividad", label: "Sobre la actividad", active: pathname === "/sobre-actividad", href: "/sobre-actividad" },
    { id: "beneficiarios", label: "Beneficiarios", active: pathname === "/beneficiarios", href: "/beneficiarios" },
    { id: "gastos", label: "Gastos", active: pathname === "/gastos", href: "/gastos" },
    { id: "viajes", label: "Viajes", active: pathname === "/viajes", href: "/viajes" },
    { id: "observaciones-generales", label: "Observaciones generales", active: pathname === "/observaciones-generales", href: "/observaciones-generales" },
  ]

  const antecedentesGeneralesFields = [
    {
      label: "Nombre del proyecto",
      value: "Mundial de atletismo y carreras",
    },
    {
      label: "Justificación",
      value:
        'La planificación del proyecto "Mundial de atletismo y carreras" en Chile se justifica desde un enfoque olímpico, ya que busca promover el deporte y la actividad física a nivel nacional. Este evento no solo elevaría el perfil del atletismo en el país, sino que también fomentaría la participación de jóvenes atletas, mejorando la infraestructura deportiva y generando un sentido de unidad y orgullo nacional. Además, al ser un evento internacional, atraerá turismo y potenciará la economía local.',
    },
    {
      label: "Objetivo",
      value:
        "Este proyecto tiene como objetivo promover el Mundial de Atletismo y Carreras, destacando la importancia de la competencia y el espíritu deportivo.",
    },
    {
      label: "Metas",
      value: (
        <ul className="list-disc list-inside space-y-0">
          <li>
            Aaumentar la participación de atletas en un 20%, mejorar la
            visibilidad del evento a través de redes sociales y atraer a un
            público diverso.
          </li>
          <li>
            También es importante garantizar la sostenibilidad del evento y
            fomentar el desarrollo de talentos locales.
          </li>
        </ul>
      ),
    },
    {
      label: "Próxima competencia fundamental",
      value: "Inaguración de los juegos",
    },
    {
      label: "País de la competencia",
      value: "Argentina",
    },
    {
      label: "Ciudad",
      value: "Buenos Aires",
    },
    {
      label: "Fecha de inicio",
      value: "30 septiembre 2026",
    },
    {
      label: "Fecha de fin",
      value: "30 octubre 2026",
    },
  ]


  // Preparar opciones para el selector de bloques
  const blockOptions = blocks.map((block) => ({
    id: block.id,
    label: block.title,
  }))

  // Handler para cuando se hace clic en el botón de comentarios de un form-card
  const handleCommentClick = (blockId: string) => {
    setActiveBlock(blockId)
    setIsChatPanelOpen(true)
  }

  // Handler para enviar mensajes
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
            <div className="flex items-center px-0 py-3 w-[600px]">
              <h2 className="text-2xl font-medium text-foreground leading-8">
                Antecedentes
              </h2>
            </div>
            <div className="flex flex-col gap-3 items-center w-full">
              {blocks.map((block) => (
                <FormCard
                  key={block.id}
                  id={block.id}
                  title={block.title}
                  fields={antecedentesGeneralesFields}
                  onComment={handleCommentClick}
                  viabilizacionStatus={block.viabilizacionStatus}
                  onViabilizacionStatusChange={(status) => updateBlockStatus(block.id, status)}
                />
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center justify-between px-0 py-3 w-[600px]"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              >
                <Button variant="secondary" className="gap-1.5">
                  <span>Actividades</span>
                  <ArrowRight className="size-5" />
                </Button>
              </motion.div>
            </motion.div>
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