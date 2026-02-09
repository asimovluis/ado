"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/composite/page-header"
import { SidebarNav } from "@/components/composite/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { X, Plus, Download, Upload, CheckCircle2, Circle, AlertTriangle, MoreVertical, MessageSquare, FileText, Trash2, Search, CircleDollarSign, Pencil, SlidersHorizontal, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { RequisitoDocumentModal } from "@/components/composite/requisito-document-modal"
import { PdfCompiladoModal } from "@/components/composite/pdf-compilado-modal"
import { AgregarAclaracionModal } from "@/components/composite/agregar-aclaracion-modal"
import { AgregarDocumentoModal } from "@/components/composite/agregar-documento-modal"
import { GastoDetailPanel } from "@/components/composite/gasto-detail-panel"
import { AgregarGrupoDialog } from "@/components/composite/agregar-grupo-dialog"
import { MoverActividadDialog } from "@/components/composite/mover-actividad-dialog"
import { CrearViaticoModal } from "@/components/composite/crear-viatico-modal"
import { DetallesViaticoModal } from "@/components/composite/detalles-viatico-modal"
import { InformeCierreModal } from "@/components/composite/informe-cierre-modal"
import { proyectos, actividades } from "@/lib/data/actividades-db"
import { beneficiariosDisponibles } from "@/lib/data/viaticos-db"
import type { Viatico, GastoAR } from "@/lib/data/viaticos-db"

interface Aclaracion {
  id: string
  titulo: string
  contenido: string
}

interface DocumentoAdicional {
  id: string
  titulo: string
  archivo: File | null
  documentoUrl?: string
  nombreArchivo?: string
  fechaCarga?: string
}

interface Gasto {
  id: string
  tipoGasto: string
  descripcion: string
  actividad: string
  federacion: string
  costoUnitario: number
  cantidad: number
  costoTotal: number
  estado: "incompleto" | "listo"
  // Información de viático si este gasto es un viático
  esViatico?: boolean
  viaticoId?: string
  // Información si este gasto es parte de un viático
  parteDeViaticos?: Array<{
    viaticoId: string
    nombreViatico: string
    cantidadUsada: number
  }>
  documentosRequeridos: Array<{
    id: string
    nombre: string
    subido: boolean
    tieneAdvertencia?: boolean
    documentoUrl?: string
    nombreArchivo?: string
    fechaCarga?: string
    validaciones?: Array<{
      id: string
      nombre: string
      cumplida: boolean
    }>
  }>
  aclaraciones?: Aclaracion[]
  documentosAdicionales?: DocumentoAdicional[]
}

interface GrupoActividad {
  id: string
  nombre: string
  cantidadGastos: number
  gastos: Gasto[]
  // Calculado: cantidad de actividades únicas
  cantidadActividades?: number
  // Actividades que pertenecen a este grupo (por nombre)
  actividades?: string[]
}

const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
const años = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

// Constante para el ID del grupo por defecto
const GRUPO_DEFAULT_ID = "grupo-bandeja-gastos"

// Función helper para generar documentos requeridos estándar
// Si el gasto está "listo", todos los documentos deben estar subidos y sin advertencias
const getDocumentosRequeridosEstandar = (gastoId: string, estado: "incompleto" | "listo" = "incompleto"): Array<{
  id: string
  nombre: string
  subido: boolean
  tieneAdvertencia?: boolean
  documentoUrl?: string
  nombreArchivo?: string
  fechaCarga?: string
  validaciones?: Array<{
    id: string
    nombre: string
    cumplida: boolean
  }>
}> => {
  const esListo = estado === "listo"
  
  return [
    {
      id: `${gastoId}-doc-1`,
      nombre: "Planilla de detalle de ítems presentados en producto",
      subido: true,
      documentoUrl: "http://localhost:3845/assets/075f59aeb7f1e24458d70e299802f5aa2618a799.png",
      nombreArchivo: "planilla-detalle-items.pdf",
      fechaCarga: "Cargado el 15 ago 2025",
      validaciones: [
        { id: "v1", nombre: "Fecha acorde con la actividad", cumplida: true },
        { id: "v2", nombre: "Monto dentro del rango", cumplida: true },
        { id: "v3", nombre: "Formato correcto", cumplida: true },
      ],
    },
    {
      id: `${gastoId}-doc-2`,
      nombre: "Comprobante de egreso",
      subido: true,
      documentoUrl: "http://localhost:3845/assets/075f59aeb7f1e24458d70e299802f5aa2618a799.png",
      nombreArchivo: "comprobante-egreso.pdf",
      fechaCarga: "Cargado el 14 ago 2025",
      validaciones: [
        { id: "v1", nombre: "Fecha acorde con la actividad", cumplida: true },
        { id: "v2", nombre: "Monto dentro del rango", cumplida: true },
      ],
    },
    {
      id: `${gastoId}-doc-3`,
      nombre: "Factura emitida por proveedor",
      subido: esListo,
      documentoUrl: esListo ? "http://localhost:3845/assets/075f59aeb7f1e24458d70e299802f5aa2618a799.png" : undefined,
      nombreArchivo: esListo ? "factura-proveedor.pdf" : undefined,
      fechaCarga: esListo ? "Cargado el 13 ago 2025" : undefined,
      validaciones: esListo ? [
        { id: "v1", nombre: "Fecha acorde con la actividad", cumplida: true },
        { id: "v2", nombre: "Monto dentro del rango", cumplida: true },
      ] : undefined,
    },
    {
      id: `${gastoId}-doc-4`,
      nombre: "Orden de compra de emisión",
      subido: true,
      documentoUrl: "http://localhost:3845/assets/075f59aeb7f1e24458d70e299802f5aa2618a799.png",
      nombreArchivo: "orden-compra.pdf",
      fechaCarga: "Cargado el 13 ago 2025",
      validaciones: [
        { id: "v1", nombre: "Fecha acorde con la actividad", cumplida: true },
        { id: "v2", nombre: "Monto dentro del rango", cumplida: true },
      ],
    },
    {
      id: `${gastoId}-doc-5`,
      nombre: "Planilla de beneficiarios firmada por proveedor",
      subido: esListo,
      documentoUrl: esListo ? "http://localhost:3845/assets/075f59aeb7f1e24458d70e299802f5aa2618a799.png" : undefined,
      nombreArchivo: esListo ? "planilla-beneficiarios.pdf" : undefined,
      fechaCarga: esListo ? "Cargado el 12 ago 2025" : undefined,
      validaciones: esListo ? [
        { id: "v1", nombre: "Fecha acorde con la actividad", cumplida: true },
        { id: "v2", nombre: "Monto dentro del rango", cumplida: true },
      ] : undefined,
    },
    {
      id: `${gastoId}-doc-6`,
      nombre: "Contrato de servicios",
      subido: true,
      tieneAdvertencia: !esListo, // Solo tiene advertencia si no está listo
      documentoUrl: "http://localhost:3845/assets/075f59aeb7f1e24458d70e299802f5aa2618a799.png",
      nombreArchivo: "contrato-servicios.pdf",
      fechaCarga: "Cargado el 12 ago 2025",
      validaciones: [
        { id: "v1", nombre: "Fecha acorde con la actividad", cumplida: esListo }, // Solo cumplida si está listo
        { id: "v2", nombre: "Monto dentro del rango", cumplida: true },
      ],
    },
    {
      id: `${gastoId}-doc-7`,
      nombre: "Copia de cédula de identidad / pasaporte vigente",
      subido: esListo,
      documentoUrl: esListo ? "http://localhost:3845/assets/075f59aeb7f1e24458d70e299802f5aa2618a799.png" : undefined,
      nombreArchivo: esListo ? "cedula-pasaporte.pdf" : undefined,
      fechaCarga: esListo ? "Cargado el 11 ago 2025" : undefined,
      validaciones: esListo ? [
        { id: "v1", nombre: "Fecha acorde con la actividad", cumplida: true },
        { id: "v2", nombre: "Monto dentro del rango", cumplida: true },
      ] : undefined,
    },
  ]
}

// Datos mock iniciales
const gruposIniciales: GrupoActividad[] = [
  {
    id: GRUPO_DEFAULT_ID,
    nombre: "Bandeja de gastos",
    cantidadGastos: 18,
    cantidadActividades: 8,
    gastos: [
      {
        id: "gasto-bandeja-1",
        tipoGasto: "Alimentación",
        descripcion: "Viáticos diarios para entrenamiento",
        actividad: "Competencia en España",
        federacion: "Atletismo",
        costoUnitario: 20000,
        cantidad: 5,
        costoTotal: 100000,
        estado: "incompleto",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-1", "incompleto"),
      },
      {
        id: "gasto-bandeja-2",
        tipoGasto: "Transporte",
        descripcion: "Traslados a centro de entrenamiento",
        actividad: "Competencia en España",
        federacion: "Atletismo",
        costoUnitario: 15000,
        cantidad: 10,
        costoTotal: 150000,
        estado: "listo",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-2", "listo"),
      },
      {
        id: "gasto-bandeja-3",
        tipoGasto: "Equipamiento",
        descripcion: "Material deportivo básico",
        actividad: "Copa Mundial de Atletismo",
        federacion: "Atletismo",
        costoUnitario: 50000,
        cantidad: 3,
        costoTotal: 150000,
        estado: "incompleto",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-3", "incompleto"),
      },
      {
        id: "gasto-bandeja-4",
        tipoGasto: "Inscripciones",
        descripcion: "Inscripción a competencia",
        actividad: "Copa Mundial de Atletismo",
        federacion: "Atletismo",
        costoUnitario: 30000,
        cantidad: 4,
        costoTotal: 120000,
        estado: "listo",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-4", "listo"),
      },
      {
        id: "gasto-bandeja-5",
        tipoGasto: "Alojamiento",
        descripcion: "Hotel para competencia (2 noches)",
        actividad: "Concentrado en Italia",
        federacion: "Atletismo",
        costoUnitario: 80000,
        cantidad: 4,
        costoTotal: 320000,
        estado: "incompleto",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-5", "incompleto"),
      },
      {
        id: "gasto-bandeja-6",
        tipoGasto: "Pasajes",
        descripcion: "Vuelos internacionales",
        actividad: "Concentrado en Italia",
        federacion: "Atletismo",
        costoUnitario: 150000,
        cantidad: 6,
        costoTotal: 900000,
        estado: "listo",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-6", "listo"),
      },
      {
        id: "gasto-bandeja-7",
        tipoGasto: "Transporte",
        descripcion: "Traslados aeropuerto - hotel",
        actividad: "Campeonato Sudamericano",
        federacion: "Atletismo",
        costoUnitario: 25000,
        cantidad: 6,
        costoTotal: 150000,
        estado: "incompleto",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-7", "incompleto"),
      },
      {
        id: "gasto-bandeja-8",
        tipoGasto: "Alimentación",
        descripcion: "Viáticos para competencia",
        actividad: "Campeonato Sudamericano",
        federacion: "Atletismo",
        costoUnitario: 22000,
        cantidad: 18,
        costoTotal: 396000,
        estado: "listo",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-8", "listo"),
      },
      {
        id: "gasto-bandeja-9",
        tipoGasto: "Pasajes",
        descripcion: "Vuelos a Francia",
        actividad: "Competencia en Francia",
        federacion: "Natación",
        costoUnitario: 180000,
        cantidad: 4,
        costoTotal: 720000,
        estado: "listo",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-9", "listo"),
      },
      {
        id: "gasto-bandeja-10",
        tipoGasto: "Alojamiento",
        descripcion: "Hotel en Francia (3 noches)",
        actividad: "Competencia en Francia",
        federacion: "Natación",
        costoUnitario: 95000,
        cantidad: 4,
        costoTotal: 380000,
        estado: "incompleto",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-10", "incompleto"),
      },
      {
        id: "gasto-bandeja-11",
        tipoGasto: "Transporte",
        descripcion: "Traslados durante competencia",
        actividad: "Mundial de Natación",
        federacion: "Natación",
        costoUnitario: 30000,
        cantidad: 5,
        costoTotal: 150000,
        estado: "listo",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-11", "listo"),
      },
      {
        id: "gasto-bandeja-12",
        tipoGasto: "Alimentación",
        descripcion: "Viáticos para mundial",
        actividad: "Mundial de Natación",
        federacion: "Natación",
        costoUnitario: 25000,
        cantidad: 12,
        costoTotal: 300000,
        estado: "incompleto",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-12", "incompleto"),
      },
      {
        id: "gasto-bandeja-13",
        tipoGasto: "Pasajes",
        descripcion: "Vuelos para Tour de Francia",
        actividad: "Tour de Francia",
        federacion: "Ciclismo",
        costoUnitario: 200000,
        cantidad: 8,
        costoTotal: 1600000,
        estado: "listo",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-13", "listo"),
      },
      {
        id: "gasto-bandeja-14",
        tipoGasto: "Equipamiento",
        descripcion: "Bicicletas y accesorios",
        actividad: "Tour de Francia",
        federacion: "Ciclismo",
        costoUnitario: 500000,
        cantidad: 2,
        costoTotal: 1000000,
        estado: "incompleto",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-14", "incompleto"),
      },
      {
        id: "gasto-bandeja-15",
        tipoGasto: "Inscripciones",
        descripcion: "Inscripción a Copa América",
        actividad: "Copa América",
        federacion: "Fútbol",
        costoUnitario: 40000,
        cantidad: 25,
        costoTotal: 1000000,
        estado: "listo",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-15", "listo"),
      },
      {
        id: "gasto-bandeja-16",
        tipoGasto: "Alojamiento",
        descripcion: "Hotel para selección (5 noches)",
        actividad: "Copa América",
        federacion: "Fútbol",
        costoUnitario: 120000,
        cantidad: 25,
        costoTotal: 3000000,
        estado: "incompleto",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-16", "incompleto"),
      },
      {
        id: "gasto-bandeja-17",
        tipoGasto: "Pasajes",
        descripcion: "Vuelos para Mundial de Fútbol",
        actividad: "Mundial de Fútbol",
        federacion: "Fútbol",
        costoUnitario: 250000,
        cantidad: 30,
        costoTotal: 7500000,
        estado: "listo",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-17", "listo"),
      },
      {
        id: "gasto-bandeja-18",
        tipoGasto: "Alimentación",
        descripcion: "Viáticos para Liga Nacional",
        actividad: "Liga Nacional",
        federacion: "Básquetbol",
        costoUnitario: 28000,
        cantidad: 15,
        costoTotal: 420000,
        estado: "incompleto",
        documentosRequeridos: getDocumentosRequeridosEstandar("gasto-bandeja-18", "incompleto"),
      },
    ],
  },
]

export default function RendicionesPage() {
  const router = useRouter()
  const [selectedGrupo, setSelectedGrupo] = useState<string>(GRUPO_DEFAULT_ID)
  const [selectedMes, setSelectedMes] = useState<string>("Ene")
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [todoElAno, setTodoElAno] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedFederaciones, setSelectedFederaciones] = useState<Set<string>>(new Set())
  const [isFiltrosDialogOpen, setIsFiltrosDialogOpen] = useState(false)
  const [actividadParaAgregarGasto, setActividadParaAgregarGasto] = useState<{federacion: string, actividad: string} | null>(null)
  
  // Datos mock con estado
  const [grupos, setGrupos] = useState<GrupoActividad[]>(gruposIniciales)
  
  const [selectedGasto, setSelectedGasto] = useState<Gasto | null>(null)
  
  // Sincronizar selectedGasto cuando cambian los grupos
  useEffect(() => {
    if (selectedGasto) {
      const grupoActual = grupos.find((g) => g.id === selectedGrupo)
      const updatedGasto = grupoActual?.gastos.find((g) => g.id === selectedGasto.id)
      
      if (updatedGasto) {
        // Si el gasto existe en el nuevo grupo, actualizar la referencia
        setSelectedGasto(updatedGasto)
      } else {
        // Si el gasto no existe en el nuevo grupo, limpiar la selección
        setSelectedGasto(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grupos, selectedGrupo])
  const [selectedDocumento, setSelectedDocumento] = useState<{
    gastoId: string
    documentoId: string
    esDocumentoAdicional?: boolean
  } | null>(null)
  const [isPdfCompiladoOpen, setIsPdfCompiladoOpen] = useState(false)
  const [isAgregarAclaracionOpen, setIsAgregarAclaracionOpen] = useState(false)
  const [isAgregarDocumentoOpen, setIsAgregarDocumentoOpen] = useState(false)
  const [editingAclaracionId, setEditingAclaracionId] = useState<string | null>(null)
  const [editingDocumentoId, setEditingDocumentoId] = useState<string | null>(null)
  const [isAgregarGrupoOpen, setIsAgregarGrupoOpen] = useState(false)
  const [isMoverActividadOpen, setIsMoverActividadOpen] = useState(false)
  const [actividadAMover, setActividadAMover] = useState<{ nombre: string; gastos: Gasto[] } | null>(null)
  const [isEliminarGrupoOpen, setIsEliminarGrupoOpen] = useState(false)
  const [grupoAEliminar, setGrupoAEliminar] = useState<GrupoActividad | null>(null)
  const [isRenombrandoGrupo, setIsRenombrandoGrupo] = useState(false)
  const [nuevoNombreGrupo, setNuevoNombreGrupo] = useState("")
  
  // Estado para viáticos
  const [viaticos, setViaticos] = useState<Viatico[]>([])
  const [isCrearViaticoOpen, setIsCrearViaticoOpen] = useState(false)
  const [isDetallesViaticoOpen, setIsDetallesViaticoOpen] = useState(false)
  const [isEliminarViaticoOpen, setIsEliminarViaticoOpen] = useState(false)
  const [viaticoAEliminar, setViaticoAEliminar] = useState<string | null>(null)
  const [viaticoAEditar, setViaticoAEditar] = useState<string | null>(null)
  const [isInformeCierreOpen, setIsInformeCierreOpen] = useState(false)

  const grupoActual = grupos.find((g) => g.id === selectedGrupo)
  
  // Obtener todas las federaciones únicas de los gastos
  const todasLasFederaciones = Array.from(
    new Set(grupoActual?.gastos.map(g => g.federacion) || [])
  ).sort()
  
  // Calcular gastos listos y totales del grupo seleccionado
  const gastosListos = grupoActual?.gastos.filter((g) => g.estado === "listo").length || 0
  const totalGastos = grupoActual?.gastos.length || 0
  const progreso = totalGastos > 0 ? (gastosListos / totalGastos) * 100 : 0

  // Obtener todas las actividades únicas de los gastos originales Y de los gastos de AR
  // (para mostrar todas las actividades, incluso si solo tienen gastos de AR)
  const actividadesPorFederacion = useMemo(() => {
    if (!grupoActual) return {} as Record<string, Set<string>>
    
    const acc: Record<string, Set<string>> = {}
    
    // Primero, agregar actividades desde los gastos del grupo
    grupoActual.gastos.forEach(gasto => {
      if (!acc[gasto.federacion]) {
        acc[gasto.federacion] = new Set<string>()
      }
      acc[gasto.federacion].add(gasto.actividad)
    })
    
    // Luego, agregar todas las actividades del grupo (incluso si no tienen gastos)
    if (grupoActual.actividades) {
      grupoActual.actividades.forEach(nombreActividad => {
        // Buscar la federación de esta actividad
        const actividad = actividades.find(a => a.nombre === nombreActividad)
        if (actividad) {
          if (!acc[actividad.federacion]) {
            acc[actividad.federacion] = new Set<string>()
          }
          acc[actividad.federacion].add(nombreActividad)
        }
      })
    }
    
    return acc
  }, [grupoActual, actividades])

  // Filtrar solo Gastos de AR para rendir
  const gastosARFiltrados = grupoActual?.gastos.filter((gasto) => {
    // Solo mostrar gastos de AR
    if (!gasto.esViatico) return false
    
    // Filtro por federaciones
    if (selectedFederaciones.size > 0 && !selectedFederaciones.has(gasto.federacion)) return false
    
    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      return (
        gasto.tipoGasto.toLowerCase().includes(query) ||
        gasto.descripcion.toLowerCase().includes(query) ||
        gasto.actividad.toLowerCase().includes(query) ||
        gasto.federacion.toLowerCase().includes(query)
      )
    }
    
    return true
  }) || []

  // Agrupar gastos de AR por federación y luego por actividad
  const gastosARPorFederacion = gastosARFiltrados.reduce((acc, gasto) => {
    if (!acc[gasto.federacion]) {
      acc[gasto.federacion] = {}
    }
    if (!acc[gasto.federacion][gasto.actividad]) {
      acc[gasto.federacion][gasto.actividad] = []
    }
    acc[gasto.federacion][gasto.actividad].push(gasto)
    return acc
  }, {} as Record<string, Record<string, Gasto[]>>)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Calcular cuánto falta por transformar en Gastos de AR para una actividad
  const calcularMontoFaltantePorActividad = (actividad: string) => {
    if (!grupoActual) return 0
    
    // Gastos originales de la actividad (que no sean Gastos de AR)
    const gastosOriginales = grupoActual.gastos.filter(
      g => !g.esViatico && g.actividad === actividad
    )
    
    // Calcular total de gastos originales
    const totalOriginal = gastosOriginales.reduce((sum, g) => sum + g.costoTotal, 0)
    
    // Calcular cuánto ya se usó en Gastos de AR (basado en parteDeViaticos)
    const totalUsadoEnAR = gastosOriginales.reduce((sum, gasto) => {
      if (gasto.parteDeViaticos && gasto.parteDeViaticos.length > 0) {
        const usadoEnEsteGasto = gasto.parteDeViaticos.reduce((gastoSum, parte) => {
          return gastoSum + (parte.cantidadUsada * gasto.costoUnitario)
        }, 0)
        return sum + usadoEnEsteGasto
      }
      return sum
    }, 0)
    
    return Math.max(0, totalOriginal - totalUsadoEnAR)
  }

  // Calcular monto disponible (total de gastos originales) para una actividad
  const calcularMontoDisponiblePorActividad = (actividad: string) => {
    if (!grupoActual) return 0
    
    // Gastos originales de la actividad (que no sean Gastos de AR)
    const gastosOriginales = grupoActual.gastos.filter(
      g => !g.esViatico && g.actividad === actividad
    )
    
    // Calcular total de gastos originales
    return gastosOriginales.reduce((sum, g) => sum + g.costoTotal, 0)
  }

  // Función para manejar la creación de un nuevo grupo
  const handleAgregarGrupo = (nombre: string, actividadIds: string[]) => {
    // Obtener los nombres de las actividades seleccionadas
    const nombresActividades = actividadIds
      .map(id => actividades.find(a => a.id === id)?.nombre)
      .filter((nombre): nombre is string => !!nombre)

    // Buscar gastos que pertenezcan a estas actividades en todos los grupos
    const gastosDelGrupo: Gasto[] = []
    const gastosIdsAMover = new Set<string>()
    
    grupos.forEach(grupo => {
      grupo.gastos.forEach(gasto => {
        if (nombresActividades.includes(gasto.actividad)) {
          gastosDelGrupo.push(gasto)
          gastosIdsAMover.add(gasto.id)
        }
      })
    })

    // Calcular cantidad de actividades únicas
    const actividadesUnicas = new Set(gastosDelGrupo.map(g => g.actividad)).size

    const nuevoGrupo: GrupoActividad = {
      id: `grupo-${Date.now()}`,
      nombre,
      cantidadGastos: gastosDelGrupo.length,
      cantidadActividades: actividadesUnicas,
      gastos: gastosDelGrupo,
      actividades: nombresActividades, // Guardar las actividades del grupo
    }

    // Actualizar los grupos: remover los gastos del grupo origen y agregar el nuevo grupo
    setGrupos(prevGrupos => {
      const gruposActualizados = prevGrupos.map(grupo => {
        // Remover los gastos que se movieron al nuevo grupo
        const gastosRestantes = grupo.gastos.filter(g => !gastosIdsAMover.has(g.id))
        const actividadesRestantes = new Set(gastosRestantes.map(g => g.actividad)).size
        
        return {
          ...grupo,
          gastos: gastosRestantes,
          cantidadGastos: gastosRestantes.length,
          cantidadActividades: actividadesRestantes,
        }
      })
      
      return [...gruposActualizados, nuevoGrupo]
    })
    
    setSelectedGrupo(nuevoGrupo.id)
  }

  // Función para manejar el movimiento de una actividad a otro grupo
  const handleMoverActividad = (grupoDestinoId: string) => {
    if (!actividadAMover) return

    setGrupos(prevGrupos => {
      const grupoOrigen = prevGrupos.find(g => g.id === selectedGrupo)
      const grupoDestino = prevGrupos.find(g => g.id === grupoDestinoId)
      
      if (!grupoOrigen || !grupoDestino) return prevGrupos

      // Mover gastos de la actividad al grupo destino
      const gastosAMover = actividadAMover.gastos
      const gastosRestantes = grupoOrigen.gastos.filter(
        g => !gastosAMover.some(ga => ga.id === g.id)
      )

      return prevGrupos.map(grupo => {
        if (grupo.id === selectedGrupo) {
          const actividadesRestantes = new Set(gastosRestantes.map(g => g.actividad)).size
          // Remover la actividad de la lista de actividades del grupo origen
          const actividadesActualizadas = grupo.actividades?.filter(
            act => act !== actividadAMover.nombre
          ) || []
          return {
            ...grupo,
            gastos: gastosRestantes,
            cantidadGastos: gastosRestantes.length,
            cantidadActividades: actividadesRestantes,
            actividades: actividadesActualizadas,
          }
        }
        if (grupo.id === grupoDestinoId) {
          const nuevasActividades = new Set([...grupo.gastos, ...gastosAMover].map(g => g.actividad)).size
          // Agregar la actividad a la lista de actividades del grupo destino si no existe
          const actividadesActualizadas = grupo.actividades || []
          if (!actividadesActualizadas.includes(actividadAMover.nombre)) {
            actividadesActualizadas.push(actividadAMover.nombre)
          }
          return {
            ...grupo,
            gastos: [...grupo.gastos, ...gastosAMover],
            cantidadGastos: grupo.gastos.length + gastosAMover.length,
            cantidadActividades: nuevasActividades,
            actividades: actividadesActualizadas,
          }
        }
        return grupo
      })
    })

    setActividadAMover(null)
  }

  // Función para manejar la creación de un Gasto de AR para rendir
  const handleGuardarViatico = (gastoARData: Omit<GastoAR, "id" | "fechaCreacion">) => {
    const nuevoGastoAR: GastoAR = {
      ...gastoARData,
      id: `gasto-ar-${Date.now()}`,
      fechaCreacion: new Date().toISOString(),
    }

    // Agregar el gasto de AR a la lista de viáticos (mantener compatibilidad)
    setViaticos(prev => [...prev, nuevoGastoAR as Viatico])

    // Obtener la federación y actividad de los gastos originales usados
    const gastosOriginalesIds = nuevoGastoAR.gastos.map(g => g.gastoId)
    const gastosOriginales = grupoActual?.gastos.filter(g => 
      !g.esViatico && gastosOriginalesIds.includes(g.id)
    ) || []
    
    // Obtener la federación del primer gasto original (todos deberían ser de la misma federación)
    const federacion = gastosOriginales[0]?.federacion || grupoActual?.gastos[0]?.federacion || "Atletismo"
    // Usar la actividad de origen si existe, sino usar la del primer gasto original
    const actividad = gastoARData.actividadOrigen || gastosOriginales[0]?.actividad || "Gastos de AR para rendir"

    // Crear un nuevo gasto de tipo según la categoría en el grupo actual
    const nuevoGasto: Gasto = {
      id: `gasto-ar-${Date.now()}`,
      tipoGasto: nuevoGastoAR.categoria,
      descripcion: nuevoGastoAR.nombre,
      actividad: actividad,
      federacion: federacion,
      costoUnitario: nuevoGastoAR.costoTotal,
      cantidad: 1,
      costoTotal: nuevoGastoAR.costoTotal,
      estado: "listo",
      esViatico: true,
      viaticoId: nuevoGastoAR.id,
      documentosRequeridos: getDocumentosRequeridosEstandar(`gasto-ar-${Date.now()}`, "listo"),
    }

    // Actualizar los gastos originales para marcarlos como parte del gasto de AR
    setGrupos(prevGrupos => {
      return prevGrupos.map(grupo => {
        if (grupo.id === selectedGrupo) {
          // Actualizar gastos existentes para indicar que son parte del gasto de AR
          const gastosActualizados = grupo.gastos.map(gasto => {
            const gastoEnAR = nuevoGastoAR.gastos.find(gv => gv.gastoId === gasto.id)
            if (gastoEnAR) {
              const parteDeViaticos = gasto.parteDeViaticos || []
              return {
                ...gasto,
                parteDeViaticos: [
                  ...parteDeViaticos,
                  {
                    viaticoId: nuevoGastoAR.id,
                    nombreViatico: nuevoGastoAR.nombre,
                    cantidadUsada: gastoEnAR.cantidadSeleccionada,
                  },
                ],
              }
            }
            return gasto
          })

          // Agregar el nuevo gasto de AR
          const nuevosGastos = [...gastosActualizados, nuevoGasto]
          
          return {
            ...grupo,
            gastos: nuevosGastos,
            cantidadGastos: nuevosGastos.length,
            cantidadActividades: new Set(nuevosGastos.map(g => g.actividad)).size,
          }
        }
        return grupo
      })
    })
  }

  // Función para renombrar un grupo
  const handleRenombrarGrupo = () => {
    if (!nuevoNombreGrupo.trim() || !grupoActual) return
    
    setGrupos(prevGrupos => {
      return prevGrupos.map(grupo => {
        if (grupo.id === selectedGrupo) {
          return {
            ...grupo,
            nombre: nuevoNombreGrupo.trim(),
          }
        }
        return grupo
      })
    })
    
    setIsRenombrandoGrupo(false)
    setNuevoNombreGrupo("")
  }

  // Función para eliminar un grupo y mover los gastos a la bandeja de gastos
  const handleEliminarGrupo = () => {
    if (!grupoAEliminar) return
    
    // No permitir eliminar la bandeja de gastos
    if (grupoAEliminar.id === GRUPO_DEFAULT_ID) {
      setIsEliminarGrupoOpen(false)
      setGrupoAEliminar(null)
      return
    }

    setGrupos(prevGrupos => {
      // Encontrar la bandeja de gastos
      const bandejaGastos = prevGrupos.find(g => g.id === GRUPO_DEFAULT_ID)
      if (!bandejaGastos) return prevGrupos

      // Mover todos los gastos del grupo a eliminar a la bandeja de gastos
      const gastosAMover = grupoAEliminar.gastos
      const nuevosGastosBandeja = [...bandejaGastos.gastos, ...gastosAMover]
      const nuevasActividadesBandeja = new Set(nuevosGastosBandeja.map(g => g.actividad)).size

      // Si el grupo eliminado estaba seleccionado, cambiar a la bandeja de gastos
      if (selectedGrupo === grupoAEliminar.id) {
        setSelectedGrupo(GRUPO_DEFAULT_ID)
      }

      // Si hay un gasto seleccionado del grupo que se elimina, cerrar el panel
      if (selectedGasto && gastosAMover.some(g => g.id === selectedGasto.id)) {
        setSelectedGasto(null)
      }

      return prevGrupos
        .filter(g => g.id !== grupoAEliminar.id) // Eliminar el grupo
        .map(grupo => {
          if (grupo.id === GRUPO_DEFAULT_ID) {
            // Actualizar la bandeja de gastos con los nuevos gastos
            return {
              ...grupo,
              gastos: nuevosGastosBandeja,
              cantidadGastos: nuevosGastosBandeja.length,
              cantidadActividades: nuevasActividadesBandeja,
            }
          }
          return grupo
        })
    })

    setIsEliminarGrupoOpen(false)
    setGrupoAEliminar(null)
  }

  // Función para eliminar un viático y devolver los gastos a su estado inicial
  const handleEliminarViatico = (viaticoId: string) => {
    const viatico = viaticos.find(v => v.id === viaticoId)
    if (!viatico) return

    // Eliminar el viático de la lista
    setViaticos(prev => prev.filter(v => v.id !== viaticoId))

    // Actualizar los grupos para:
    // 1. Eliminar el gasto de viático
    // 2. Remover la referencia del viático de los gastos originales
    setGrupos(prevGrupos => {
      return prevGrupos.map(grupo => {
        if (grupo.id === selectedGrupo) {
          // Eliminar el gasto de viático
          const gastosSinViatico = grupo.gastos.filter(g => !(g.esViatico && g.viaticoId === viaticoId))

          // Remover la referencia del viático de los gastos originales
          const gastosActualizados = gastosSinViatico.map(gasto => {
            if (gasto.parteDeViaticos && gasto.parteDeViaticos.length > 0) {
              const parteDeViaticosActualizado = gasto.parteDeViaticos.filter(
                p => p.viaticoId !== viaticoId
              )
              return {
                ...gasto,
                parteDeViaticos: parteDeViaticosActualizado.length > 0 ? parteDeViaticosActualizado : undefined,
              }
            }
            return gasto
          })

          // Si el gasto seleccionado es el viático que se está eliminando, cerrar el panel
          if (selectedGasto?.esViatico && selectedGasto.viaticoId === viaticoId) {
            setSelectedGasto(null)
          }

          return {
            ...grupo,
            gastos: gastosActualizados,
            cantidadGastos: gastosActualizados.length,
            cantidadActividades: new Set(gastosActualizados.map(g => g.actividad)).size,
          }
        }
        return grupo
      })
    })
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <PageHeader
        title="Rendiciones"
        backButtonText="Proyectos"
        onBack={() => router.push("/viabilizacion")}
        currentVersion={undefined}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="bg-sidebar border-r border-border flex flex-col h-full shrink-0 w-60">
          <div className="flex flex-col gap-2 grow items-start p-2 pt-3">
            <div className="flex flex-col gap-2 w-full">
              {/* Bandeja de gastos */}
              {grupos
                .filter(grupo => grupo.id === GRUPO_DEFAULT_ID)
                .map((grupo) => (
                  <Button
                    key={grupo.id}
                    variant={selectedGrupo === grupo.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-between h-auto px-4 py-2",
                      selectedGrupo === grupo.id && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      setSelectedGrupo(grupo.id)
                      // Limpiar selectedGasto si no existe en el nuevo grupo
                      if (selectedGasto) {
                        const nuevoGrupo = grupos.find((g) => g.id === grupo.id)
                        const gastoExiste = nuevoGrupo?.gastos.some((g) => g.id === selectedGasto.id)
                        if (!gastoExiste) {
                          setSelectedGasto(null)
                        }
                      }
                    }}
                  >
                    <span className="text-left">{grupo.nombre}</span>
                    <Badge variant="secondary">
                      {grupo.cantidadActividades ?? 
                        new Set(grupo.gastos.map(g => g.actividad)).size}
                    </Badge>
                  </Button>
                ))}
            </div>
            
            {/* Separador y título de grupos */}
            <div className="w-full pt-6">
              <p className="text-xs font-medium px-4 text-muted-foreground">Grupos (productos)</p>
            </div>
            
            {/* Grupos */}
            <div className="flex flex-col gap-2 w-full">
              {grupos
                .filter(grupo => grupo.id !== GRUPO_DEFAULT_ID)
                .map((grupo) => (
                  <Button
                    key={grupo.id}
                    variant={selectedGrupo === grupo.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-between h-auto px-4 py-2",
                      selectedGrupo === grupo.id && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      setSelectedGrupo(grupo.id)
                      // Limpiar selectedGasto si no existe en el nuevo grupo
                      if (selectedGasto) {
                        const nuevoGrupo = grupos.find((g) => g.id === grupo.id)
                        const gastoExiste = nuevoGrupo?.gastos.some((g) => g.id === selectedGasto.id)
                        if (!gastoExiste) {
                          setSelectedGasto(null)
                        }
                      }
                    }}
                  >
                    <span className="text-left">{grupo.nombre}</span>
                    <Badge variant="secondary">
                      {grupo.cantidadActividades ?? 
                        new Set(grupo.gastos.map(g => g.actividad)).size}
                    </Badge>
                  </Button>
                ))}
            </div>
            
            {/* Botón agregar grupo */}
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-1.5 h-auto py-2"
              onClick={() => setIsAgregarGrupoOpen(true)}
            >
              <Plus className="size-4" />
              <span>Agregar un grupo</span>
            </Button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header - abraza su contenido */}
            <div className="bg-background shrink-0 flex flex-col gap-4 p-4 pb-0 border-b">
              <div className="flex items-center gap-5 justify-between relative">
                <div className="flex items-center gap-5 flex-1 relative">
                  {isRenombrandoGrupo ? (
                    <div className="absolute left-0 top-0 bg-background z-20 flex items-center gap-2 px-4 py-0" style={{ width: 'calc(100% - 200px)' }}>
                      <Input
                        value={nuevoNombreGrupo}
                        onChange={(e) => setNuevoNombreGrupo(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRenombrarGrupo()
                          } else if (e.key === "Escape") {
                            setIsRenombrandoGrupo(false)
                            setNuevoNombreGrupo("")
                          }
                        }}
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={handleRenombrarGrupo}
                        disabled={!nuevoNombreGrupo.trim()}
                      >
                        Guardar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsRenombrandoGrupo(false)
                          setNuevoNombreGrupo("")
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-medium">{grupoActual?.nombre || "Gastos"}</h2>
                        {grupoActual && grupoActual.id !== GRUPO_DEFAULT_ID && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="size-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-40 p-1" align="start">
                              <button
                                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent text-sm text-foreground w-full"
                                onClick={() => {
                                  setNuevoNombreGrupo(grupoActual.nombre)
                                  setIsRenombrandoGrupo(true)
                                }}
                              >
                                Renombrar
                              </button>
                              <button
                                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent text-sm text-destructive w-full"
                                onClick={() => {
                                  setGrupoAEliminar(grupoActual)
                                  setIsEliminarGrupoOpen(true)
                                }}
                              >
                                <Trash2 className="size-4" />
                                Eliminar grupo
                              </button>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setIsInformeCierreOpen(true)}
                >
                  Ver informe de cierre
                </Button>
              </div>

              {/* Filtros de año y meses */}
              <div className="flex gap-1 items-center">
                {/* Selector de año */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-9 w-20">
                      {selectedYear}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-32 p-2" align="start">
                    <div className="flex flex-col gap-1">
                      {años.map((year) => (
                        <button
                          key={year}
                          onClick={() => setSelectedYear(year)}
                          className={cn(
                            "px-3 py-1.5 rounded-md text-sm transition-colors text-left",
                            selectedYear === year
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent"
                          )}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                
                {/* Toggle "Todo el año" */}
                <button
                  onClick={() => {
                    setTodoElAno(true)
                    setSelectedMes("")
                  }}
                  className={cn(
                    "h-9 px-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                    todoElAno
                      ? "bg-muted text-foreground"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  Todo el año
                </button>
                
                {/* Toggles de meses */}
                {meses.map((mes) => (
                  <button
                    key={mes}
                    onClick={() => {
                      setSelectedMes(mes)
                      setTodoElAno(false)
                    }}
                    className={cn(
                      "h-9 px-2.5 rounded-md text-sm font-medium transition-colors",
                      selectedMes === mes
                        ? "bg-muted text-foreground"
                        : "text-foreground hover:bg-accent"
                    )}
                  >
                    {mes}
                  </button>
                ))}
              </div>

              {/* Badges de filtros activos */}
              {(selectedFederaciones.size > 0) && (
                <div className="flex flex-wrap gap-2 items-center px-4 pb-2">
                  {Array.from(selectedFederaciones).map((federacion) => (
                    <Badge
                      key={federacion}
                      variant="secondary"
                      className="gap-1.5 pr-1"
                    >
                      {federacion}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 hover:bg-transparent"
                        onClick={() => {
                          setSelectedFederaciones(prev => {
                            const newSet = new Set(prev)
                            newSet.delete(federacion)
                            return newSet
                          })
                        }}
                      >
                        <X className="size-3" />
                      </Button>
                    </Badge>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setSelectedFederaciones(new Set())}
                  >
                    Quitar filtros
                  </Button>
                </div>
              )}

              {/* Título y controles */}
              <div className="flex items-center justify-between  pb-2">
                <h2 className="text-xl font-semibold">Gastos de AR para rendir</h2>

                <div className="flex gap-1 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setSearchQuery("")
                          e.currentTarget.blur()
                        }
                      }}
                      className={cn("h-9 pl-9 w-64", searchQuery ? "pr-9" : "pr-3")}
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setIsFiltrosDialogOpen(true)}
                  >
                    <SlidersHorizontal className="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Listado de gastos de AR - ocupa el alto disponible restante */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-6 p-4">
              {Object.entries(actividadesPorFederacion).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="flex flex-col gap-3 items-center max-w-md text-center">
                    <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                      <CircleDollarSign className="size-8 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        No hay actividades
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        No hay actividades disponibles para agregar gastos de AR.
                      </p>
                    </div>
                  </div>
                </div>
              ) : Object.entries(actividadesPorFederacion)
                .filter(([federacion]) => {
                  // Filtrar por federación si hay filtros activos
                  if (selectedFederaciones.size > 0 && !selectedFederaciones.has(federacion)) {
                    return false
                  }
                  return true
                })
                .map(([federacion, actividadesSet]) => {
                // Convertir Set a Array y ordenar
                const actividadesArray = Array.from(actividadesSet).sort()
                
                return (
                  <div key={federacion} className="flex flex-col gap-12">
                    {/* Título de Federación sticky */}
                    <div className="sticky top-0 z-20 bg-background pb-0 -mt-4 -mx-4 px-[36px] pt-3">
                      <h2 className="text-xl font-semibold ">{federacion}</h2>
                    </div>
                    
                    {actividadesArray.map((actividad) => {
                      // Obtener gastos de AR para esta actividad (puede estar vacío)
                      const gastos = gastosARPorFederacion[federacion]?.[actividad] || []
                    const montoFaltante = calcularMontoFaltantePorActividad(actividad)
                    
                    return (
                    <div key={actividad} className="flex flex-col gap-8">
                      {/* Título de Actividad sticky - debajo del de federación */}
                      <div className="sticky top-[40px] z-10 bg-background pb-2 -mt-4 -mx-4 px-[36px] pt-0">
                        <div className="flex flex-col gap-3">
                          {/* Primera fila: nombre de actividad y botón de tres puntos */}
                          <div className="flex items-center justify-between">
                            <h3 className="text-md font-medium text-muted-foreground">{actividad}</h3>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="size-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-40 p-1" align="end">
                                <div className="flex flex-col gap-0">
                                  <button 
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent text-sm text-foreground"
                                    onClick={() => {
                                      setActividadAMover({ nombre: actividad, gastos })
                                      setIsMoverActividadOpen(true)
                                    }}
                                  >
                                    Mover a otro grupo
                                  </button>
                                  <button className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent text-sm text-foreground">
                                    Ir a la actividad
                                  </button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          {/* Segunda fila: botón agregar gasto y mensaje de monto faltante */}
                          <div className="flex items-center justify-start gap-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => {
                                setActividadParaAgregarGasto({ federacion, actividad })
                                setIsCrearViaticoOpen(true)
                              }}
                            >
                              <Plus className="size-3.5 mr-1.5" />
                              Agregar gasto
                            </Button>
                            
                            {/* Mensaje de monto faltante con tooltip */}
                            {montoFaltante > 0 && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <div className="flex items-center gap-1 cursor-pointer">
                                    <Info className="size-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      Te faltan {formatCurrency(montoFaltante)} por agregar
                                    </span>
                                  </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-3" align="start">
                                  <p className="text-xs text-foreground">
                                    Parte de los gastos viabilizados de esta actividad que aún no han sido transformados en Gastos de AR para rendir
                                  </p>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col border-t">
                        {false && gastos.length === 0 ? (
                          <div className="border border-border rounded-xl p-6 max-w-[600px] mx-auto my-12">
                            <div className="flex flex-col gap-6 items-center text-center">
                              <div className="size-8 flex items-center justify-center">
                                <Info className="size-8 text-foreground" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <p className="text-base font-semibold text-foreground leading-6">
                                  Tienes {formatCurrency(calcularMontoDisponiblePorActividad(actividad))} disponibles en gastos viabilizados para esta actividad
                                </p>
                                <p className="text-base font-normal text-foreground leading-6">
                                  Agrega los gastos de la misma forma en que corresponde para subirlos al sistema AR del IND
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                className="mt-2"
                                onClick={() => {
                                  setActividadParaAgregarGasto({ federacion, actividad })
                                  setIsCrearViaticoOpen(true)
                                }}
                              >
                                <Plus className="size-4 mr-2" />
                                Agregar gasto
                              </Button>
                            </div>
                          </div>
                        ) : (
                          gastos.map((gasto) => {
                            return (
                              <div
                                key={gasto.id}
                                className={cn(
                                  "flex gap-4 items-start p-2 border-b transition-colors cursor-pointer hover:bg-muted/50",
                                  selectedGasto?.id === gasto.id && "bg-accent"
                                )}
                                onClick={() => setSelectedGasto(gasto)}
                              >
                                <div className="flex-1 flex gap-2 min-w-[200px] p-3">
                                  <div className="flex-1 flex flex-col gap-1">
                                    <p className="text-sm font-semibold text-foreground">
                                      {gasto.tipoGasto}
                                    </p>
                                    <p className="text-sm line-clamp-2 text-foreground">
                                      {gasto.descripcion}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex-1 flex flex-col items-start justify-center p-3 gap-1">
                                  {(() => {
                                    const requisitosListos = gasto.documentosRequeridos.filter(d => d.subido).length
                                    const totalRequisitos = gasto.documentosRequeridos.length
                                    const porcentaje = totalRequisitos > 0 ? (requisitosListos / totalRequisitos) * 100 : 0
                                    const estaCompleto = requisitosListos === totalRequisitos && totalRequisitos > 0
                                    return (
                                      <div className="flex flex-col gap-1">
                                        <span className="text-xs font-medium">{requisitosListos}/{totalRequisitos} listos</span>
                                        <div className="bg-muted h-1.5 w-12 rounded-full overflow-hidden outline outline-1 outline-border">
                                          <div
                                            className={cn("h-full transition-all", estaCompleto ? "bg-green-600" : "bg-slate-500")}
                                            style={{ width: `${porcentaje}%` }}
                                          />
                                        </div>
                                      </div>
                                    )
                                  })()}
                                </div>
                                <div className="flex-1 flex flex-col items-end justify-center p-3 gap-0.5">
                                  <p className="text-sm text-muted-foreground">
                                    {gasto.cantidad} unidades
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatCurrency(gasto.costoUnitario)} c/u
                                  </p>
                                </div>
                                <div className="flex-1 flex items-center justify-end min-w-[128px] p-3">
                                  <p className="text-sm font-medium">
                                    {formatCurrency(gasto.costoTotal)}
                                  </p>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                    )
                  })}
                  </div>
                )
              })}

              </div>
            </div>
          </div>

          {/* Panel derecho */}
          {selectedGasto && (
            <GastoDetailPanel onClose={() => setSelectedGasto(null)}>
              <GastoDetailPanel.Header>
                <GastoDetailPanel.Info>
                  <div className="flex flex-col gap-0">
                    <p className="text-sm font-semibold text-foreground">{selectedGasto.federacion}</p>
                    <p className="text-sm font-normal text-muted-foreground">{selectedGasto.actividad}</p>
                  </div>
                  <h3 className="text-lg font-semibold">{selectedGasto.tipoGasto}</h3>
                  <p className="text-sm font-normal text-foreground line-clamp-2">
                    {selectedGasto.descripcion}
                  </p>
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(selectedGasto.costoTotal)}</p>
                </GastoDetailPanel.Info>
                <GastoDetailPanel.Actions
                  onAddDocument={() => {
                    setEditingDocumentoId(null)
                    setIsAgregarDocumentoOpen(true)
                  }}
                  onAddAclaracion={() => {
                    setEditingAclaracionId(null)
                    setIsAgregarAclaracionOpen(true)
                  }}
                  onVerPdf={() => setIsPdfCompiladoOpen(true)}
                  onVerViatico={selectedGasto.esViatico && selectedGasto.viaticoId ? () => setIsDetallesViaticoOpen(true) : undefined}
                  onCreateViatico={() => setIsCrearViaticoOpen(true)}
                  onEditarViatico={selectedGasto.esViatico && selectedGasto.viaticoId ? () => {
                    setViaticoAEditar(selectedGasto.viaticoId!)
                    setIsCrearViaticoOpen(true)
                  } : undefined}
                  onEliminarViatico={selectedGasto.esViatico && selectedGasto.viaticoId ? () => {
                    setViaticoAEliminar(selectedGasto.viaticoId!)
                    setIsEliminarViaticoOpen(true)
                  } : undefined}
                  isViatico={selectedGasto.esViatico || false}
                />
              </GastoDetailPanel.Header>

              <GastoDetailPanel.Content>
                {/* Contenedor de requisitos originales */}
                <GastoDetailPanel.RequisitosSection 
                  title="Requisitos para rendición"
                  progress={(() => {
                    const requisitosListos = selectedGasto.documentosRequeridos.filter(d => d.subido).length
                    const totalRequisitos = selectedGasto.documentosRequeridos.length
                    const porcentaje = totalRequisitos > 0 ? (requisitosListos / totalRequisitos) * 100 : 0
                    const estaCompleto = requisitosListos === totalRequisitos && totalRequisitos > 0
                    return (
                      <>
                        <div className="bg-muted h-2 w-[60px] rounded-full overflow-hidden">
                          <div
                            className={cn("h-full transition-all", estaCompleto ? "bg-green-600" : "bg-slate-500")}
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{requisitosListos}/{totalRequisitos} listos</span>
                      </>
                    )
                  })()}
                >
                  <div className="flex flex-col">
                    {selectedGasto.documentosRequeridos.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() =>
                          setSelectedDocumento({
                            gastoId: selectedGasto.id,
                            documentoId: doc.id,
                          })
                        }
                        className="flex gap-4 items-center p-2 border-b text-left hover:bg-muted/50"
                      >
                        <div className="shrink-0">
                          {doc.subido ? (
                            doc.tieneAdvertencia ? (
                              <AlertTriangle className="size-5 text-amber-700" />
                            ) : (
                              <CheckCircle2 className="size-5 text-green-700" />
                            )
                          ) : (
                            <Circle className="size-5 text-foreground" />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col gap-0.5">
                          <p
                            className={cn(
                              "text-base font-medium",
                              doc.subido && !doc.tieneAdvertencia && "text-green-700",
                              doc.tieneAdvertencia && "text-amber-700"
                            )}
                          >
                            {doc.nombre}
                          </p>
                        </div>
                        <div className="border border-border rounded-lg size-16 shrink-0 flex items-center justify-center">
                          {doc.subido ? (
                            <img
                              src="http://localhost:3845/assets/9ff77ba719ccd2be171a187b745984e910a84958.png"
                              alt=""
                              className="size-full object-cover rounded-lg"
                            />
                          ) : (
                            <Button variant="outline" size="icon" className="h-10 w-10">
                              <Upload className="size-5" />
                            </Button>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </GastoDetailPanel.RequisitosSection>
                
                {/* Contenedor de documentos adicionales y aclaraciones - siempre visible */}
                <GastoDetailPanel.AdicionalesSection title="Anexos">
                  <div className="flex flex-col">
                    {/* Documentos adicionales */}
                    {selectedGasto.documentosAdicionales?.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex gap-4 items-center p-2 border-b hover:bg-muted/50"
                      >
                        <button
                          onClick={() => {
                            setSelectedDocumento({
                              gastoId: selectedGasto.id,
                              documentoId: doc.id,
                              esDocumentoAdicional: true,
                            })
                          }}
                          className="flex gap-4 items-center flex-1 text-left"
                        >
                          <div className="shrink-0">
                            <FileText className="size-5 text-foreground" />
                          </div>
                          <div className="flex-1 flex flex-col gap-0.5">
                            <p className="text-base font-medium text-foreground">
                              {doc.titulo}
                            </p>
                            {doc.nombreArchivo && (
                              <p className="text-xs text-muted-foreground">
                                {doc.nombreArchivo}
                              </p>
                            )}
                          </div>
                        </button>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-40 p-1" align="end">
                            <div className="flex flex-col gap-0">
                              <button
                                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent text-sm text-foreground"
                                onClick={() => {
                                  setEditingDocumentoId(doc.id)
                                  setIsAgregarDocumentoOpen(true)
                                }}
                              >
                                Editar
                              </button>
                              <button
                                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent text-sm text-destructive"
                                onClick={() => {
                                  setGrupos((prevGrupos) => {
                                    const newGrupos = prevGrupos.map((grupo) => {
                                      if (grupo.id === selectedGrupo) {
                                        const newGastos = grupo.gastos.map((gasto) => {
                                          if (gasto.id === selectedGasto?.id) {
                                            return {
                                              ...gasto,
                                              documentosAdicionales: gasto.documentosAdicionales?.filter(
                                                (d) => d.id !== doc.id
                                              ) || [],
                                            }
                                          }
                                          return gasto
                                        })
                                        return { ...grupo, gastos: newGastos }
                                      }
                                      return grupo
                                    })
                                    
                                    const updatedGasto = newGrupos
                                      .find((g) => g.id === selectedGrupo)
                                      ?.gastos.find((g) => g.id === selectedGasto?.id)
                                    
                                    if (updatedGasto) {
                                      setSelectedGasto(updatedGasto)
                                    }
                                    
                                    return newGrupos
                                  })
                                }}
                              >
                                <Trash2 className="size-4" />
                                Eliminar
                              </button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    ))}
                  
                    {/* Aclaraciones */}
                    {selectedGasto.aclaraciones?.map((aclaracion) => (
                      <div
                        key={aclaracion.id}
                        className="flex gap-4 items-center p-2 border-b hover:bg-muted/50"
                      >
                        <div className="flex gap-4 items-center flex-1">
                          <div className="shrink-0">
                            <MessageSquare className="size-5 text-foreground" />
                          </div>
                          <div className="flex-1 flex flex-col gap-0.5">
                            <p className="text-base font-medium text-foreground">
                              {aclaracion.titulo}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {aclaracion.contenido}
                            </p>
                          </div>
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-40 p-1" align="end">
                            <div className="flex flex-col gap-0">
                              <button
                                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent text-sm text-foreground"
                                onClick={() => {
                                  setEditingAclaracionId(aclaracion.id)
                                  setIsAgregarAclaracionOpen(true)
                                }}
                              >
                                Editar
                              </button>
                              <button
                                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent text-sm text-destructive"
                                onClick={() => {
                                  setGrupos((prevGrupos) => {
                                    const newGrupos = prevGrupos.map((grupo) => {
                                      if (grupo.id === selectedGrupo) {
                                        const newGastos = grupo.gastos.map((gasto) => {
                                          if (gasto.id === selectedGasto?.id) {
                                            return {
                                              ...gasto,
                                              aclaraciones: gasto.aclaraciones?.filter(
                                                (a) => a.id !== aclaracion.id
                                              ) || [],
                                            }
                                          }
                                          return gasto
                                        })
                                        return { ...grupo, gastos: newGastos }
                                      }
                                      return grupo
                                    })
                                    
                                    const updatedGasto = newGrupos
                                      .find((g) => g.id === selectedGrupo)
                                      ?.gastos.find((g) => g.id === selectedGasto?.id)
                                    
                                    if (updatedGasto) {
                                      setSelectedGasto(updatedGasto)
                                    }
                                    
                                    return newGrupos
                                  })
                                }}
                              >
                                <Trash2 className="size-4" />
                                Eliminar
                              </button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    ))}
                    
                    {/* Botones para agregar - siempre visibles */}
                    <div className="flex flex-col gap-2 p-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          setEditingDocumentoId(null)
                          setIsAgregarDocumentoOpen(true)
                        }}
                      >
                        <Plus className="size-4" />
                        Agregar documento
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          setEditingAclaracionId(null)
                          setIsAgregarAclaracionOpen(true)
                        }}
                      >
                        <Plus className="size-4" />
                        Agregar aclaración
                      </Button>
                    </div>
                  </div>
                </GastoDetailPanel.AdicionalesSection>

              </GastoDetailPanel.Content>
            </GastoDetailPanel>
          )}
        </div>
      </div>

      {/* Modal de requisito */}
      {selectedDocumento && selectedGasto && (
        <RequisitoDocumentModal
          open={!!selectedDocumento}
          onOpenChange={(open: boolean) => {
            if (!open) setSelectedDocumento(null)
          }}
          nombre={
            selectedDocumento.esDocumentoAdicional
              ? selectedGasto.documentosAdicionales?.find(
                  (d) => d.id === selectedDocumento.documentoId
                )?.titulo || ""
              : selectedGasto.documentosRequeridos.find(
                  (d) => d.id === selectedDocumento.documentoId
                )?.nombre || ""
          }
          documentoSubido={
            selectedDocumento.esDocumentoAdicional
              ? true
              : selectedGasto.documentosRequeridos.find(
                  (d) => d.id === selectedDocumento.documentoId
                )?.subido || false
          }
          tieneAdvertencia={
            selectedDocumento.esDocumentoAdicional
              ? false
              : selectedGasto.documentosRequeridos.find(
                  (d) => d.id === selectedDocumento.documentoId
                )?.tieneAdvertencia || false
          }
          validaciones={
            selectedDocumento.esDocumentoAdicional
              ? []
              : selectedGasto.documentosRequeridos.find(
                  (d) => d.id === selectedDocumento.documentoId
                )?.validaciones || []
          }
          documentoUrl={
            selectedDocumento.esDocumentoAdicional
              ? selectedGasto.documentosAdicionales?.find(
                  (d) => d.id === selectedDocumento.documentoId
                )?.documentoUrl
              : selectedGasto.documentosRequeridos.find(
                  (d) => d.id === selectedDocumento.documentoId
                )?.documentoUrl
          }
          nombreArchivo={
            selectedDocumento.esDocumentoAdicional
              ? selectedGasto.documentosAdicionales?.find(
                  (d) => d.id === selectedDocumento.documentoId
                )?.nombreArchivo
              : selectedGasto.documentosRequeridos.find(
                  (d) => d.id === selectedDocumento.documentoId
                )?.nombreArchivo
          }
          fechaCarga={
            selectedDocumento.esDocumentoAdicional
              ? selectedGasto.documentosAdicionales?.find(
                  (d) => d.id === selectedDocumento.documentoId
                )?.fechaCarga
              : selectedGasto.documentosRequeridos.find(
                  (d) => d.id === selectedDocumento.documentoId
                )?.fechaCarga
          }
          mostrarAnalisis={!selectedDocumento.esDocumentoAdicional}
          onUpload={(file: File) => {
            // Aquí se manejaría la carga del archivo
            console.log("Upload file:", file)
            setSelectedDocumento(null)
          }}
          onSave={() => {
            // Aquí se manejaría el guardado
            console.log("Save")
            setSelectedDocumento(null)
          }}
        />
      )}

      {/* Modal de PDF compilado */}
      {selectedGasto && (
        <PdfCompiladoModal
          open={isPdfCompiladoOpen}
          onOpenChange={setIsPdfCompiladoOpen}
          nombreArchivo={`${selectedGasto.tipoGasto.toLowerCase().replace(/\s+/g, "-")}-${selectedGasto.actividad.toLowerCase().replace(/\s+/g, "-")}-1.pdf`}
          documentosUrls={selectedGasto.documentosRequeridos
            .filter((doc) => doc.subido && doc.documentoUrl)
            .map((doc) => doc.documentoUrl!)
          }
          aclaraciones={selectedGasto.aclaraciones || []}
        />
      )}

      {/* Modal de agregar aclaración */}
      {selectedGasto && (
        <AgregarAclaracionModal
          open={isAgregarAclaracionOpen}
          onOpenChange={setIsAgregarAclaracionOpen}
          titulo={
            editingAclaracionId
              ? selectedGasto.aclaraciones?.find((a) => a.id === editingAclaracionId)?.titulo || ""
              : ""
          }
          contenido={
            editingAclaracionId
              ? selectedGasto.aclaraciones?.find((a) => a.id === editingAclaracionId)?.contenido || ""
              : ""
          }
          onSave={(titulo, contenido) => {
            setGrupos((prevGrupos) => {
              const newGrupos = prevGrupos.map((grupo) => {
                if (grupo.id === selectedGrupo) {
                  const newGastos = grupo.gastos.map((gasto) => {
                    if (gasto.id === selectedGasto?.id) {
                      const aclaraciones = gasto.aclaraciones || []
                      if (editingAclaracionId) {
                        // Editar aclaración existente
                        const updatedAclaraciones = aclaraciones.map((a) =>
                          a.id === editingAclaracionId
                            ? { ...a, titulo, contenido }
                            : a
                        )
                        return { ...gasto, aclaraciones: updatedAclaraciones }
                      } else {
                        // Agregar nueva aclaración
                        const nuevaAclaracion: Aclaracion = {
                          id: `aclaracion-${Date.now()}`,
                          titulo,
                          contenido,
                        }
                        return {
                          ...gasto,
                          aclaraciones: [...aclaraciones, nuevaAclaracion],
                        }
                      }
                    }
                    return gasto
                  })
                  return { ...grupo, gastos: newGastos }
                }
                return grupo
              })
              
              const updatedGasto = newGrupos
                .find((g) => g.id === selectedGrupo)
                ?.gastos.find((g) => g.id === selectedGasto?.id)
              
              if (updatedGasto) {
                setSelectedGasto(updatedGasto)
              }
              
              setEditingAclaracionId(null)
              return newGrupos
            })
          }}
        />
      )}

      {/* Modal de agregar documento */}
      {selectedGasto && (
        <AgregarDocumentoModal
          open={isAgregarDocumentoOpen}
          onOpenChange={setIsAgregarDocumentoOpen}
          titulo={
            editingDocumentoId
              ? selectedGasto.documentosAdicionales?.find((d) => d.id === editingDocumentoId)?.titulo || ""
              : ""
          }
          archivo={
            editingDocumentoId
              ? selectedGasto.documentosAdicionales?.find((d) => d.id === editingDocumentoId)?.archivo || undefined
              : undefined
          }
          onSave={(titulo, archivo) => {
            setGrupos((prevGrupos) => {
              const newGrupos = prevGrupos.map((grupo) => {
                if (grupo.id === selectedGrupo) {
                  const newGastos = grupo.gastos.map((gasto) => {
                    if (gasto.id === selectedGasto?.id) {
                      const documentosAdicionales = gasto.documentosAdicionales || []
                      if (editingDocumentoId) {
                        // Editar documento existente
                        const updatedDocumentos = documentosAdicionales.map((d) =>
                          d.id === editingDocumentoId
                            ? { ...d, titulo, archivo }
                            : d
                        )
                        return { ...gasto, documentosAdicionales: updatedDocumentos }
                      } else {
                        // Agregar nuevo documento
                        const nuevoDocumento: DocumentoAdicional = {
                          id: `doc-adicional-${Date.now()}`,
                          titulo,
                          archivo,
                          nombreArchivo: archivo.name,
                          fechaCarga: new Date().toLocaleDateString("es-CL"),
                        }
                        return {
                          ...gasto,
                          documentosAdicionales: [...documentosAdicionales, nuevoDocumento],
                        }
                      }
                    }
                    return gasto
                  })
                  return { ...grupo, gastos: newGastos }
                }
                return grupo
              })
              
              const updatedGasto = newGrupos
                .find((g) => g.id === selectedGrupo)
                ?.gastos.find((g) => g.id === selectedGasto?.id)
              
              if (updatedGasto) {
                setSelectedGasto(updatedGasto)
              }
              
              setEditingDocumentoId(null)
              return newGrupos
            })
          }}
        />
      )}

      {/* Dialog para agregar grupo */}
      <AgregarGrupoDialog
        open={isAgregarGrupoOpen}
        onOpenChange={setIsAgregarGrupoOpen}
        proyectos={proyectos}
        actividades={actividades}
        onSave={handleAgregarGrupo}
      />

      {/* Dialog para mover actividad */}
      {actividadAMover && (
        <MoverActividadDialog
          open={isMoverActividadOpen}
          onOpenChange={setIsMoverActividadOpen}
          grupos={grupos}
          actividadNombre={actividadAMover.nombre}
          grupoActualId={selectedGrupo}
          onMover={handleMoverActividad}
        />
      )}

      {/* Modal para crear gasto de AR */}
      <CrearViaticoModal
        open={isCrearViaticoOpen}
        onOpenChange={(open) => {
          setIsCrearViaticoOpen(open)
          if (!open) setActividadParaAgregarGasto(null)
        }}
        gastosDisponibles={grupoActual?.gastos.filter(g => !g.esViatico) || []}
        beneficiariosDisponibles={beneficiariosDisponibles}
        onGuardar={handleGuardarViatico}
        actividadOrigen={actividadParaAgregarGasto?.actividad}
      />

      {/* Modal de detalles del viático */}
      <DetallesViaticoModal
        open={isDetallesViaticoOpen}
        onOpenChange={setIsDetallesViaticoOpen}
        viatico={selectedGasto?.esViatico && selectedGasto.viaticoId 
          ? viaticos.find(v => v.id === selectedGasto.viaticoId) || null
          : null}
        beneficiariosDisponibles={beneficiariosDisponibles}
        onEditar={(viaticoId) => {
          setViaticoAEditar(viaticoId)
          setIsDetallesViaticoOpen(false)
          setIsCrearViaticoOpen(true)
        }}
        onEliminar={(viaticoId) => {
          setViaticoAEliminar(viaticoId)
          setIsDetallesViaticoOpen(false)
          setIsEliminarViaticoOpen(true)
        }}
      />

      {/* Dialog para eliminar grupo */}
      <Dialog open={isEliminarGrupoOpen} onOpenChange={setIsEliminarGrupoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar grupo y mover los gastos a la bandeja de gastos</DialogTitle>
            <DialogDescription>
              Si eliminas el grupo los gastos se moveran con toda su información y documentación hacía la página de bandeja de gastos, podrás moverlos a otro grupo cuando quieras
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEliminarGrupoOpen(false)
                setGrupoAEliminar(null)
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleEliminarGrupo}
            >
              Eliminar y mover gastos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para eliminar viático */}
      <Dialog open={isEliminarViaticoOpen} onOpenChange={setIsEliminarViaticoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar viático y reestablecer gastos individuales</DialogTitle>
            <DialogDescription>
              Si eliminas el viático, los gastos volveran a aparecer individualmente
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEliminarViaticoOpen(false)
                setViaticoAEliminar(null)
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (viaticoAEliminar) {
                  handleEliminarViatico(viaticoAEliminar)
                  setSelectedGasto(null)
                  setIsEliminarViaticoOpen(false)
                  setViaticoAEliminar(null)
                }
              }}
            >
              Eliminar viático
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de informe de cierre */}
      <InformeCierreModal
        open={isInformeCierreOpen}
        onOpenChange={setIsInformeCierreOpen}
        nombreArchivo="informe-cierre.pdf"
        pdfUrl="http://localhost:3845/assets/075f59aeb7f1e24458d70e299802f5aa2618a799.png"
      />

      {/* Dialog de filtros de federaciones */}
      <Dialog open={isFiltrosDialogOpen} onOpenChange={setIsFiltrosDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrar por federaciones</DialogTitle>
            <DialogDescription>
              Selecciona las federaciones para filtrar los gastos
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4 max-h-[400px] overflow-y-auto">
            {todasLasFederaciones.map((federacion) => (
              <div
                key={federacion}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                onClick={() => {
                  setSelectedFederaciones(prev => {
                    const newSet = new Set(prev)
                    if (newSet.has(federacion)) {
                      newSet.delete(federacion)
                    } else {
                      newSet.add(federacion)
                    }
                    return newSet
                  })
                }}
              >
                <Checkbox
                  checked={selectedFederaciones.has(federacion)}
                  onCheckedChange={(checked) => {
                    setSelectedFederaciones(prev => {
                      const newSet = new Set(prev)
                      if (checked) {
                        newSet.add(federacion)
                      } else {
                        newSet.delete(federacion)
                      }
                      return newSet
                    })
                  }}
                />
                <label className="text-sm font-medium cursor-pointer flex-1">
                  {federacion}
                </label>
              </div>
            ))}
          </div>
          <DialogFooter className="justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedFederaciones(new Set())
                setIsFiltrosDialogOpen(false)
              }}
            >
              Quitar filtros
            </Button>
            <Button onClick={() => setIsFiltrosDialogOpen(false)}>
              Mostrar resultados
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
