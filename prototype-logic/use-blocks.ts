"use client"

import { useState, useCallback, useEffect } from "react"
import type { ViabilizacionStatus } from "@/components/composite/viabilizacion-status-selector"
import type { ContentBlock, BlocksState, ChatMessage } from "./types"

/**
 * Hook para manejar la lógica de bloques de contenido
 * Esta lógica es solo para prototipado
 */

// Función para obtener la clave de almacenamiento según los IDs de los bloques iniciales
function getStorageKey(initialBlocks: ContentBlock[]): string {
  // Crear una clave única basada en los IDs de los bloques iniciales
  // Esto permite que diferentes páginas tengan sus propios bloques
  const blockIds = initialBlocks.map(b => b.id).sort().join("-")
  return `ado-blocks-${blockIds}`
}

// Función para obtener datos del localStorage
function getStoredBlocks(storageKey: string): ContentBlock[] | null {
  if (typeof window === "undefined") return null
  
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      return JSON.parse(stored) as ContentBlock[]
    }
  } catch (error) {
    console.error("Error al leer localStorage:", error)
  }
  return null
}

// Función para guardar datos en localStorage
function saveStoredBlocks(storageKey: string, blocks: ContentBlock[]) {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(storageKey, JSON.stringify(blocks))
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
    // Limpiar todas las claves que empiecen con "ado-blocks-"
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("ado-blocks-")) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))
    console.log(`✅ ${keysToRemove.length} conjunto(s) de comentarios limpiados. Recarga la página para ver los cambios.`)
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

/**
 * Función para obtener todos los bloques de todas las páginas desde localStorage
 * Útil para calcular el progreso global de viabilización
 */
export function getAllBlocksFromStorage(): ContentBlock[] {
  if (typeof window === "undefined") return []
  
  try {
    const allBlocks: ContentBlock[] = []
    
    // Iterar sobre todas las claves de localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("ado-blocks-")) {
        const stored = localStorage.getItem(key)
        if (stored) {
          try {
            const blocks = JSON.parse(stored) as ContentBlock[]
            allBlocks.push(...blocks)
          } catch (error) {
            console.error(`Error al parsear bloques de ${key}:`, error)
          }
        }
      }
    }
    
    return allBlocks
  } catch (error) {
    console.error("Error al obtener todos los bloques:", error)
    return []
  }
}

export function useBlocks(initialBlocks: ContentBlock[]) {
  // Obtener la clave de almacenamiento única para esta página
  const storageKey = getStorageKey(initialBlocks)
  
  // Intentar cargar desde localStorage al inicio
  const [blocksState, setBlocksState] = useState<BlocksState>(() => {
    const storedBlocks = getStoredBlocks(storageKey)
    
    // Si hay datos guardados, fusionarlos con los iniciales
    // Mantener los bloques guardados que coincidan con los iniciales, pero asegurar que todos los iniciales estén presentes
    let blocksToUse: ContentBlock[]
    
    if (storedBlocks) {
      // Crear un mapa de bloques guardados por ID
      const storedBlocksMap = new Map(storedBlocks.map(b => [b.id, b]))
      
      // Para cada bloque inicial, usar el guardado si existe, o el inicial si no
      blocksToUse = initialBlocks.map(initialBlock => {
        const storedBlock = storedBlocksMap.get(initialBlock.id)
        if (storedBlock) {
          // Usar el bloque guardado (tiene mensajes y estado guardados)
          return storedBlock
        }
        // Usar el bloque inicial (nuevo o sin datos guardados)
        return initialBlock
      })
    } else {
      // No hay datos guardados, usar los iniciales
      blocksToUse = initialBlocks
    }
    
    return {
      blocks: blocksToUse,
      activeBlockId: blocksToUse[0]?.id || null,
    }
  })

  // Guardar en localStorage cada vez que cambien los bloques
  useEffect(() => {
    saveStoredBlocks(storageKey, blocksState.blocks)
    // Disparar evento personalizado para notificar cambios
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('blocksUpdated'))
    }
  }, [storageKey, blocksState.blocks])

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
      // Disparar evento personalizado para notificar cambios
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('blocksUpdated'))
      }
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

