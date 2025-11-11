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
import { MessageSquare, MoreVertical, Send } from "lucide-react"
import { useBlocks } from "@/prototype-logic/use-blocks"
import { createUserMessage } from "@/prototype-logic/message-helpers"
import type { ContentBlock } from "@/prototype-logic/types"

export default function SobreActividadPage() {
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
      id: "sobre-actividad",
      title: "Sobre la actividad",
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

  const sobreActividadFields = [
    {
      label: "Nombre de la actividad",
      value: "Mundial de atletismo y carreras",
    },
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
          <li>
            Aumentar la participación de atletas en un 20%, mejorar la visibilidad del evento a través de redes sociales y atraer a un público diverso.
          </li>
          <li>
            También es importante garantizar la sostenibilidad del evento y fomentar el desarrollo de talentos locales.
          </li>
        </ul>
      ),
    },
    {
      label: "Ciudad",
      value: "Buenos Aires",
    },
    {
      label: "País",
      value: "Argentina",
    },
    {
      label: "Nivel de actividad",
      value: "Internacional",
    },
    {
      label: "Fechas de inicio y fin",
      value: "19 ago 2026 - 25 ago 2026",
    },
    {
      label: "Fechas de salida y regreso",
      value: "19 ago 2026 - 25 ago 2026",
    },
    {
      label: "Recinto",
      value: (
        <>
          <p>Estadio Nacional de Buenos Aires</p>
          <p>Avenida principal 1234, Buenos Aires, Argentina.</p>
        </>
      ),
    },
    {
      label: "Horarios",
      value: "Lunes y miércoles de 8:00 a 16:00",
    },
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
    {
      label: "Bases",
      value: "Sin bases",
    },
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
                Sobre la actividad
              </h2>
            </div>
            <div className="flex flex-col gap-3 items-center w-full">
              {blocks.map((block) => (
                <FormCard
                  key={block.id}
                  id={block.id}
                  title={block.title}
                  fields={sobreActividadFields}
                  viabilizacionStatus={block.viabilizacionStatus}
                  onComment={handleCommentClick}
                />
              ))}
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

