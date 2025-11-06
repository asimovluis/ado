/**
 * Helper para mapear bloques a sus rutas de navegación
 * Esta lógica es solo para prototipado
 */

import type { ContentBlock } from "./types"

/**
 * Mapea un bloque a su ruta de navegación
 */
export function getBlockRoute(blockId: string): string {
  // Bloques de la página principal (antecedentes)
  if (blockId === "antecedentes") {
    return "/"
  }

  // Bloques de actividades - necesitamos extraer el ID de la actividad
  // Los bloques de actividades tienen IDs como "sobre-actividad", "mujeres-deportistas", etc.
  // y están en páginas como "/actividades/1", "/actividades/2", etc.
  // Por ahora, asumimos que todos los bloques de actividades están en la primera actividad
  // TODO: Esto debería mejorarse para mapear correctamente cada bloque a su actividad
  const activityBlockIds = [
    "sobre-actividad",
    "mujeres-deportistas",
    "hombres-deportistas",
    "mujeres-tecnico-staff",
    "hombres-tecnico-staff",
    "gastos",
  ]
  
  if (activityBlockIds.includes(blockId)) {
    // Por ahora, todos los bloques de actividades están en la actividad 1
    // Esto debería mejorarse para mapear correctamente
    return "/actividades/1"
  }

  // Bloques de viajes
  if (blockId.startsWith("viaje-")) {
    return "/viajes"
  }

  // Por defecto, ir a la página principal
  return "/"
}

/**
 * Obtiene el hash del bloque para hacer scroll a ese bloque específico
 * Útil para navegar directamente a un bloque dentro de una página
 */
export function getBlockHash(blockId: string): string {
  return `#${blockId}`
}

