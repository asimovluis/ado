import type { ViabilizacionStatus } from "@/components/composite/viabilizacion-status-selector"

/**
 * Tipos para la lógica de prototipado de bloques de contenido
 * Esta sección es solo para prototipado y no debe contaminar el código de producción
 */

export interface ChatMessage {
  id: string
  sender?: string
  content: string | React.ReactNode
  timestamp: string
  isOwn?: boolean
  links?: Array<{ label: string; href?: string }>
  lists?: Array<{ items: string[] }>
}

export interface ContentBlock {
  id: string
  title: string
  viabilizacionStatus: ViabilizacionStatus | null
  messages: ChatMessage[]
}

export interface BlocksState {
  blocks: ContentBlock[]
  activeBlockId: string | null
}

