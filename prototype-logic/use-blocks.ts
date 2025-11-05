"use client"

import { useState, useCallback, useEffect } from "react"
import type { ViabilizacionStatus } from "@/components/composite/viabilizacion-status-selector"
import type { ContentBlock, BlocksState, ChatMessage } from "./types"

/**
 * Hook para manejar la lógica de bloques de contenido
 * Esta lógica es solo para prototipado
 */

const STORAGE_KEY = "ado-blocks-data"

// Función para obtener datos del localStorage
function getStoredBlocks(): ContentBlock[] | null {
  if (typeof window === "undefined") return null
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as ContentBlock[]
    }
  } catch (error) {
    console.error("Error al leer localStorage:", error)
  }
  return null
}

// Función para guardar datos en localStorage
function saveStoredBlocks(blocks: ContentBlock[]) {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks))
  } catch (error) {
    console.error("Error al guardar en localStorage:", error)
  }
}

/**
 * Función para limpiar todos los comentarios guardados en localStorage
 * Se puede llamar desde la consola del navegador: window.clearADOComments()
 */
export function clearStoredBlocks() {
  if (typeof window === "undefined") return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log("✅ Comentarios limpiados. Recarga la página para ver los cambios.")
    return true
  } catch (error) {
    console.error("Error al limpiar localStorage:", error)
    return false
  }
}

// Exponer la función en window para fácil acceso desde la consola
if (typeof window !== "undefined") {
  ;(window as any).clearADOComments = clearStoredBlocks
}

export function useBlocks(initialBlocks: ContentBlock[]) {
  // Intentar cargar desde localStorage al inicio
  const [blocksState, setBlocksState] = useState<BlocksState>(() => {
    const storedBlocks = getStoredBlocks()
    
    // Si hay datos guardados, usarlos; si no, usar los iniciales
    const blocksToUse = storedBlocks || initialBlocks
    
    return {
      blocks: blocksToUse,
      activeBlockId: blocksToUse[0]?.id || null,
    }
  })

  // Guardar en localStorage cada vez que cambien los bloques
  useEffect(() => {
    saveStoredBlocks(blocksState.blocks)
  }, [blocksState.blocks])

  const setActiveBlock = useCallback((blockId: string) => {
    setBlocksState((prev) => ({
      ...prev,
      activeBlockId: blockId,
    }))
  }, [])

  const updateBlockStatus = useCallback((blockId: string, status: ViabilizacionStatus) => {
    setBlocksState((prev) => {
      const updated = {
        ...prev,
        blocks: prev.blocks.map((block) =>
          block.id === blockId ? { ...block, viabilizacionStatus: status } : block
        ),
      }
      // Guardar inmediatamente después de actualizar
      saveStoredBlocks(updated.blocks)
      return updated
    })
  }, [])

  const addMessageToBlock = useCallback((blockId: string, message: ChatMessage) => {
    setBlocksState((prev) => {
      const updated = {
        ...prev,
        blocks: prev.blocks.map((block) =>
          block.id === blockId
            ? { ...block, messages: [...block.messages, message] }
            : block
        ),
      }
      // Guardar inmediatamente después de agregar mensaje
      saveStoredBlocks(updated.blocks)
      return updated
    })
  }, [])

  const activeBlock = blocksState.blocks.find(
    (block) => block.id === blocksState.activeBlockId
  ) || null

  return {
    blocks: blocksState.blocks,
    activeBlock,
    activeBlockId: blocksState.activeBlockId,
    setActiveBlock,
    updateBlockStatus,
    addMessageToBlock,
  }
}

