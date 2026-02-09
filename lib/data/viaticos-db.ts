// Tipos e interfaces para la funcionalidad de Gastos de AR para rendir

export type CategoriaGastoAR = 
  | "Viático" 
  | "Honorarios" 
  | "Alimentación y alojamiento" 
  | "Pasajes/Traslados/peajes"

export interface BeneficiarioViatico {
  id: string
  nombre: string
  rol: string
  documento: string
  tipoDocumento: string
}

export interface GastoViatico {
  gastoId: string
  tipoGasto: string
  descripcion: string
  actividad: string
  federacion: string
  cantidadSeleccionada: number
  cantidadMaxima: number
  costoUnitario: number
  costoTotal: number
}

export interface GastoAR {
  id: string
  categoria: CategoriaGastoAR
  nombre: string
  gastos: GastoViatico[]
  beneficiarios: string[] // IDs de beneficiarios
  costoTotal: number
  fechaCreacion: string
  actividadOrigen?: string // Actividad de origen de los gastos
}

// Mantener Viatico para compatibilidad
export type Viatico = GastoAR

// Datos mock de beneficiarios
export const beneficiariosDisponibles: BeneficiarioViatico[] = [
  { id: "ben-1", nombre: "Diego Armando Silva", rol: "Carreras", documento: "12.345.678-K", tipoDocumento: "RUT" },
  { id: "ben-2", nombre: "Ana María González", rol: "Entrenador", documento: "12.345.678-K", tipoDocumento: "RUT" },
  { id: "ben-3", nombre: "Carlos Pérez", rol: "Kinesiologo", documento: "12.345.678-K", tipoDocumento: "RUT" },
  { id: "ben-4", nombre: "Laura Martínez", rol: "Carreras", documento: "12.345.678-K", tipoDocumento: "RUT" },
  { id: "ben-5", nombre: "Juan Rodríguez", rol: "Carreras", documento: "12.345.678-K", tipoDocumento: "RUT" },
  { id: "ben-6", nombre: "Patricia Torres", rol: "Entrenador", documento: "12.345.678-K", tipoDocumento: "RUT" },
  { id: "ben-7", nombre: "Miguel Sánchez", rol: "Kinesiologo", documento: "12.345.678-K", tipoDocumento: "RUT" },
  { id: "ben-8", nombre: "Sofía Ramírez", rol: "Carreras", documento: "12.345.678-K", tipoDocumento: "RUT" },
]

