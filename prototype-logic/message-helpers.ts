import type { ChatMessage } from "./types"

/**
 * Helpers para la lógica de prototipado de mensajes
 * Esta sección es solo para prototipado
 */

/**
 * Genera un timestamp en formato "HH:MM DD MMM"
 */
export function generateTimestamp(): string {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, "0")
  const minutes = now.getMinutes().toString().padStart(2, "0")
  const day = now.getDate().toString().padStart(2, "0")
  const monthNames = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ]
  const month = monthNames[now.getMonth()]

  return `${hours}:${minutes} ${day} ${month}`
}

/**
 * Genera un ID único para un mensaje
 */
export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Crea un nuevo mensaje de chat desde el contenido del usuario
 */
export function createUserMessage(content: string): ChatMessage {
  return {
    id: generateMessageId(),
    sender: "Usuario", // Puedes cambiar esto según necesites
    content: content.trim(),
    timestamp: generateTimestamp(),
    isOwn: true,
  }
}

