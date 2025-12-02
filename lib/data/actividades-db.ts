// Base de datos básica - solo datos iniciales (mock)

export interface Proyecto {
  id: string
  nombre: string // Ej: "Atletismo 2026"
  deporte: string
  año: number
}

export interface Actividad {
  id: string
  nombre: string // Ej: "Competencia en España"
  proyectoId: string
}

// Datos mock iniciales - estos son los que se ven al cargar la página
export const proyectos: Proyecto[] = [
  { id: "proyecto-1", nombre: "Atletismo 2026", deporte: "Atletismo", año: 2026 },
  { id: "proyecto-2", nombre: "Natación 2026", deporte: "Natación", año: 2026 },
  { id: "proyecto-3", nombre: "Ciclismo 2025", deporte: "Ciclismo", año: 2025 },
]

export const actividades: Actividad[] = [
  { id: "actividad-1", nombre: "Competencia en España", proyectoId: "proyecto-1" },
  { id: "actividad-2", nombre: "Copa Mundial de Atletismo", proyectoId: "proyecto-1" },
  { id: "actividad-3", nombre: "Concentrado en Italia", proyectoId: "proyecto-1" },
  { id: "actividad-4", nombre: "Campeonato Sudamericano", proyectoId: "proyecto-1" },
  { id: "actividad-5", nombre: "Competencia en Francia", proyectoId: "proyecto-2" },
  { id: "actividad-6", nombre: "Mundial de Natación", proyectoId: "proyecto-2" },
  { id: "actividad-7", nombre: "Tour de Francia", proyectoId: "proyecto-3" },
]

