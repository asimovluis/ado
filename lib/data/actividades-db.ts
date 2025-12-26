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
  federacion: string // Ej: "Atletismo", "Natación", "Ciclismo"
}

// Datos mock iniciales - estos son los que se ven al cargar la página
export const proyectos: Proyecto[] = [
  { id: "proyecto-1", nombre: "Atletismo 2026", deporte: "Atletismo", año: 2026 },
  { id: "proyecto-2", nombre: "Natación 2026", deporte: "Natación", año: 2026 },
  { id: "proyecto-3", nombre: "Ciclismo 2025", deporte: "Ciclismo", año: 2025 },
  { id: "proyecto-4", nombre: "Fútbol 2026", deporte: "Fútbol", año: 2026 },
  { id: "proyecto-5", nombre: "Básquetbol 2026", deporte: "Básquetbol", año: 2026 },
]

export const actividades: Actividad[] = [
  { id: "actividad-1", nombre: "Competencia en España", proyectoId: "proyecto-1", federacion: "Atletismo" },
  { id: "actividad-2", nombre: "Copa Mundial de Atletismo", proyectoId: "proyecto-1", federacion: "Atletismo" },
  { id: "actividad-3", nombre: "Concentrado en Italia", proyectoId: "proyecto-1", federacion: "Atletismo" },
  { id: "actividad-4", nombre: "Campeonato Sudamericano", proyectoId: "proyecto-1", federacion: "Atletismo" },
  { id: "actividad-5", nombre: "Competencia en Francia", proyectoId: "proyecto-2", federacion: "Natación" },
  { id: "actividad-6", nombre: "Mundial de Natación", proyectoId: "proyecto-2", federacion: "Natación" },
  { id: "actividad-7", nombre: "Tour de Francia", proyectoId: "proyecto-3", federacion: "Ciclismo" },
  { id: "actividad-8", nombre: "Copa América", proyectoId: "proyecto-4", federacion: "Fútbol" },
  { id: "actividad-9", nombre: "Mundial de Fútbol", proyectoId: "proyecto-4", federacion: "Fútbol" },
  { id: "actividad-10", nombre: "Liga Nacional", proyectoId: "proyecto-5", federacion: "Básquetbol" },
]

