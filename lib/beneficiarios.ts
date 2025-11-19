export interface Beneficiario {
  name?: string
  modality?: string
  gender: string
  role: string
  nationality?: string
  doc?: string
  docType?: string
  birthDate?: string
  phone?: string
  email?: string
  isIncomplete?: boolean
}

export const BENEFICIARIOS: Beneficiario[] = [
  // Mujeres deportistas
  { name: "María González", modality: "Carreras", gender: "Mujer", role: "Deportista", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "maria@atletismo.cl" },
  { name: "Ana Martínez", modality: "Carreras", gender: "Mujer", role: "Deportista", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "ana@atletismo.cl" },
  // Hombres deportistas
  { name: "Diego Armando Silva", modality: "Carreras", gender: "Hombre", role: "Deportista", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "diego@atletismo.cl" },
  { name: "Joaquín Pérez Rojas", modality: "Carreras", gender: "Hombre", role: "Deportista", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "joaquin@atletismo.cl" },
  { name: "Matías Fernández Soto", modality: "Carreras", gender: "Hombre", role: "Deportista", nationality: "Uruguaya", doc: "1234567", docType: "Pasaporte", birthDate: "01/01/1994", phone: "+56 912345678", email: "matias@atletismo.cl" },
  { name: "Nicolás Torres González", modality: "Carreras", gender: "Hombre", role: "Deportista", nationality: "Venezolana", doc: "1234567", docType: "Pasaporte", birthDate: "01/01/1994", phone: "+56 912345678", email: "nicolas@atletismo.cl" },
  { name: "Sebastián Castro Muñoz", modality: "Carreras", gender: "Hombre", role: "Deportista", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "sebastian@atletismo.cl" },
  { name: "Cristóbal Herrera López", modality: "Carreras", gender: "Hombre", role: "Deportista", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "cristobal@atletismo.cl" },
  // Mujeres técnico/staff
  { name: "Isabella Valenzuela López", modality: "Entrenador", gender: "Mujer", role: "Técnico/Staff", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "isabella@atletismo.cl" },
  { name: "Camila Ríos Martínez", modality: "Entrenador", gender: "Mujer", role: "Técnico/Staff", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "camila@atletismo.cl" },
  // Hombres técnico/staff
  { name: "Carlos Méndez", modality: "Entrenador", gender: "Hombre", role: "Técnico/Staff", nationality: "Chilena", doc: "12.345.678-K", docType: "RUT", birthDate: "01/01/1994", phone: "+56 912345678", email: "carlos@atletismo.cl" },
  // Beneficiarios incompletos (solo género y rol)
  { gender: "Hombre", role: "Deportista", isIncomplete: true },
  { gender: "Mujer", role: "Deportista", isIncomplete: true },
  { gender: "Hombre", role: "Técnico/Staff", isIncomplete: true },
  { gender: "Mujer", role: "Técnico/Staff", isIncomplete: true },
]

