import type { ViabilizacionStatus } from "@/components/composite/viabilizacion-status-selector"

const STORAGE_KEY = "ado-beneficiarios-viabilizacion"

export interface BeneficiarioViabilizacion {
  [beneficiarioName: string]: ViabilizacionStatus
}

export function getBeneficiariosViabilizacion(): BeneficiarioViabilizacion {
  if (typeof window === "undefined") return {}
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as BeneficiarioViabilizacion
    }
  } catch (error) {
    console.error("Error al leer viabilización de beneficiarios:", error)
  }
  return {}
}

export function saveBeneficiarioViabilizacion(
  beneficiarioName: string,
  status: ViabilizacionStatus
) {
  if (typeof window === "undefined") return
  
  try {
    const current = getBeneficiariosViabilizacion()
    if (status === null) {
      // Si es null, eliminar la entrada
      const { [beneficiarioName]: _, ...rest } = current
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
    } else {
      // Si tiene un valor, guardarlo
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...current, [beneficiarioName]: status })
      )
    }
  } catch (error) {
    console.error("Error al guardar viabilización de beneficiario:", error)
  }
}

