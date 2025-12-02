"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/composite/page-header"
import { SidebarNav } from "@/components/composite/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { X, Plus, Download, Upload, CheckCircle2, Circle, AlertTriangle, MoreVertical, MessageSquare, FileText, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { RequisitoDocumentModal } from "@/components/composite/requisito-document-modal"
import { PdfCompiladoModal } from "@/components/composite/pdf-compilado-modal"
import { AgregarAclaracionModal } from "@/components/composite/agregar-aclaracion-modal"
import { AgregarDocumentoModal } from "@/components/composite/agregar-documento-modal"
import { GastoDetailPanel } from "@/components/composite/gasto-detail-panel"
import { AgregarGrupoDialog } from "@/components/composite/agregar-grupo-dialog"
import { MoverActividadDialog } from "@/components/composite/mover-actividad-dialog"
import { proyectos, actividades } from "@/lib/data/actividades-db"

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
  costoUnitario: number
  cantidad: number
  costoTotal: number
  estado: "incompleto" | "listo"
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
}

const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

// Datos mock iniciales
const gruposIniciales: GrupoActividad[] = [
    {
      id: "grupo-1",
      nombre: "Proyecto 1 AR",
      cantidadGastos: 12,
      cantidadActividades: 3, // Competencia en España, Copa Mundial de Atletismo, Campeonato Sudamericano
      gastos: [
        {
          id: "gasto-1",
          tipoGasto: "Alojamiento",
          descripcion: "Habitación doble (16 al 25 de agosto) x 190.000 por dia",
          actividad: "Competencia en España",
          costoUnitario: 999999,
          cantidad: 10,
          costoTotal: 999999999,
          estado: "incompleto",
          documentosRequeridos: [
            {
              id: "doc-1",
              nombre: "Planilla de detalle de items",
              subido: true,
              documentoUrl: "http://localhost:3845/assets/075f59aeb7f1e24458d70e299802f5aa2618a799.png",
              nombreArchivo: "planilla-items.pdf",
              fechaCarga: "Cargado el 15 ago 2025",
              validaciones: [
                { id: "v1", nombre: "Fecha acorde con la actividad", cumplida: true },
                { id: "v2", nombre: "Monto dentro del rango", cumplida: true },
                { id: "v3", nombre: "Formato correcto", cumplida: true },
              ],
            },
            { id: "doc-2", nombre: "Comprobante de egreso", subido: false },
            {
              id: "doc-3",
              nombre: "Cartola bancaria",
              subido: true,
              tieneAdvertencia: true,
              documentoUrl: "http://localhost:3845/assets/075f59aeb7f1e24458d70e299802f5aa2618a799.png",
              nombreArchivo: "cartola-bancaria.pdf",
              fechaCarga: "Cargado el 14 ago 2025",
              validaciones: [
                { id: "v1", nombre: "Fecha acorde con la actividad", cumplida: false },
                { id: "v2", nombre: "Monto dentro del rango", cumplida: true },
              ],
            },
            { id: "doc-4", nombre: "Copia cedible", subido: false },
            { id: "doc-5", nombre: "Cédula de identidad", subido: false },
          ],
        },
        {
          id: "gasto-2",
          tipoGasto: "Alojamiento",
          descripcion: "Habitación doble (16 al 25 de agosto) x 190.000 por dia",
          actividad: "Competencia en España",
          costoUnitario: 999999,
          cantidad: 10,
          costoTotal: 999999999,
          estado: "listo",
          documentosRequeridos: [
            { id: "doc-1", nombre: "Planilla de detalle de items", subido: true },
            { id: "doc-2", nombre: "Comprobante de egreso", subido: true },
          ],
        },
        {
          id: "gasto-3",
          tipoGasto: "Pasajes",
          descripcion: "Vuelos Santiago - Madrid ida y vuelta",
          actividad: "Competencia en España",
          costoUnitario: 850000,
          cantidad: 8,
          costoTotal: 6800000,
          estado: "incompleto",
          documentosRequeridos: [
            { id: "doc-1", nombre: "Planilla de detalle de items", subido: false },
          ],
        },
        {
          id: "gasto-4",
          tipoGasto: "Alimentación",
          descripcion: "Viáticos diarios para 8 deportistas x 10 días",
          actividad: "Competencia en España",
          costoUnitario: 25000,
          cantidad: 80,
          costoTotal: 2000000,
          estado: "incompleto",
          documentosRequeridos: [
            { id: "doc-1", nombre: "Planilla de detalle de items", subido: false },
          ],
        },
        {
          id: "gasto-5",
          tipoGasto: "Transporte",
          descripcion: "Traslados aeropuerto - hotel - estadio",
          actividad: "Copa Mundial de Atletismo",
          costoUnitario: 45000,
          cantidad: 12,
          costoTotal: 540000,
          estado: "listo",
          documentosRequeridos: [
            { id: "doc-1", nombre: "Planilla de detalle de items", subido: true },
            { id: "doc-2", nombre: "Comprobante de egreso", subido: true },
          ],
        },
        {
          id: "gasto-6",
          tipoGasto: "Equipamiento",
          descripcion: "Uniforme oficial y zapatillas de competencia",
          actividad: "Copa Mundial de Atletismo",
          costoUnitario: 120000,
          cantidad: 15,
          costoTotal: 1800000,
          estado: "incompleto",
          documentosRequeridos: [
            { id: "doc-1", nombre: "Planilla de detalle de items", subido: true },
            { id: "doc-2", nombre: "Comprobante de egreso", subido: false },
          ],
        },
        {
          id: "gasto-7",
          tipoGasto: "Alojamiento",
          descripcion: "Hotel 4 estrellas cerca del estadio (5 noches)",
          actividad: "Copa Mundial de Atletismo",
          costoUnitario: 95000,
          cantidad: 15,
          costoTotal: 1425000,
          estado: "listo",
          documentosRequeridos: [
            { id: "doc-1", nombre: "Planilla de detalle de items", subido: true },
            { id: "doc-2", nombre: "Comprobante de egreso", subido: true },
          ],
        },
        {
          id: "gasto-8",
          tipoGasto: "Pasajes",
          descripcion: "Vuelos Santiago - París ida y vuelta",
          actividad: "Copa Mundial de Atletismo",
          costoUnitario: 920000,
          cantidad: 15,
          costoTotal: 13800000,
          estado: "incompleto",
          documentosRequeridos: [
            { id: "doc-1", nombre: "Planilla de detalle de items", subido: false },
          ],
        },
        {
          id: "gasto-9",
          tipoGasto: "Seguro médico",
          descripcion: "Seguro de viaje y cobertura médica internacional",
          actividad: "Campeonato Sudamericano",
          costoUnitario: 35000,
          cantidad: 20,
          costoTotal: 700000,
          estado: "listo",
          documentosRequeridos: [
            { id: "doc-1", nombre: "Planilla de detalle de items", subido: true },
            { id: "doc-2", nombre: "Comprobante de egreso", subido: true },
          ],
        },
        {
          id: "gasto-10",
          tipoGasto: "Inscripciones",
          descripcion: "Inscripción de atletas y técnicos al campeonato",
          actividad: "Campeonato Sudamericano",
          costoUnitario: 150000,
          cantidad: 20,
          costoTotal: 3000000,
          estado: "incompleto",
          documentosRequeridos: [
            { id: "doc-1", nombre: "Planilla de detalle de items", subido: true },
            { id: "doc-2", nombre: "Comprobante de egreso", subido: false },
          ],
        },
        {
          id: "gasto-11",
          tipoGasto: "Alimentación",
          descripcion: "Viáticos diarios para 20 deportistas x 7 días",
          actividad: "Campeonato Sudamericano",
          costoUnitario: 28000,
          cantidad: 140,
          costoTotal: 3920000,
          estado: "incompleto",
          documentosRequeridos: [
            { id: "doc-1", nombre: "Planilla de detalle de items", subido: false },
          ],
        },
        {
          id: "gasto-12",
          tipoGasto: "Transporte local",
          descripcion: "Traslados hotel - estadio - hotel durante competencia",
          actividad: "Campeonato Sudamericano",
          costoUnitario: 38000,
          cantidad: 40,
          costoTotal: 1520000,
          estado: "listo",
          documentosRequeridos: [
            { id: "doc-1", nombre: "Planilla de detalle de items", subido: true },
            { id: "doc-2", nombre: "Comprobante de egreso", subido: true },
          ],
        },
      ],
    },
    {
      id: "grupo-2",
      nombre: "Proyecto 2 AR",
      cantidadGastos: 7,
      cantidadActividades: 1,
      gastos: [
        {
          id: "gasto-5",
          tipoGasto: "Alojamiento",
          descripcion: "Habitación doble (16 al 25 de agosto) x 190.000 por dia",
          actividad: "Nombre de la actividad",
          costoUnitario: 999999,
          cantidad: 10,
          costoTotal: 999999999,
          estado: "incompleto",
          documentosRequeridos: [
            { id: "doc-1", nombre: "Planilla de detalle de items", subido: false },
          ],
        },
      ],
    },
  ]

export default function RendicionesPage() {
  const router = useRouter()
  const [selectedGrupo, setSelectedGrupo] = useState<string>("grupo-1")
  const [selectedMes, setSelectedMes] = useState<string>("Ene")
  const [selectedTab, setSelectedTab] = useState<string>("todos")
  const [sortBy, setSortBy] = useState<"actividades" | "tipo-gasto">("actividades")
  
  // Datos mock con estado
  const [grupos, setGrupos] = useState<GrupoActividad[]>(gruposIniciales)
  
  const [selectedGasto, setSelectedGasto] = useState<Gasto | null>(
    gruposIniciales[0]?.gastos[0] || null
  )
  
  // Sincronizar selectedGasto cuando cambian los grupos
  useEffect(() => {
    if (selectedGasto) {
      const updatedGasto = grupos
        .find((g) => g.id === selectedGrupo)
        ?.gastos.find((g) => g.id === selectedGasto.id)
      if (updatedGasto) {
        setSelectedGasto(updatedGasto)
      }
    }
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

  const grupoActual = grupos.find((g) => g.id === selectedGrupo)
  
  // Calcular gastos listos y totales del grupo seleccionado
  const gastosListos = grupoActual?.gastos.filter((g) => g.estado === "listo").length || 0
  const totalGastos = grupoActual?.gastos.length || 0
  const progreso = totalGastos > 0 ? (gastosListos / totalGastos) * 100 : 0

  // Filtrar gastos según el tab seleccionado
  const gastosFiltrados = grupoActual?.gastos.filter((gasto) => {
    if (selectedTab === "incompletos") return gasto.estado === "incompleto"
    if (selectedTab === "listos") return gasto.estado === "listo"
    return true
  }) || []

  // Agrupar por actividad
  const gastosPorActividad = gastosFiltrados.reduce((acc, gasto) => {
    if (!acc[gasto.actividad]) {
      acc[gasto.actividad] = []
    }
    acc[gasto.actividad].push(gasto)
    return acc
  }, {} as Record<string, Gasto[]>)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Función para manejar la creación de un nuevo grupo
  const handleAgregarGrupo = (nombre: string, actividadIds: string[]) => {
    // Obtener los nombres de las actividades seleccionadas
    const nombresActividades = actividadIds
      .map(id => actividades.find(a => a.id === id)?.nombre)
      .filter((nombre): nombre is string => !!nombre)

    // Buscar gastos que pertenezcan a estas actividades en todos los grupos
    const gastosDelGrupo: Gasto[] = []
    
    grupos.forEach(grupo => {
      grupo.gastos.forEach(gasto => {
        if (nombresActividades.includes(gasto.actividad)) {
          gastosDelGrupo.push(gasto)
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
    }

    setGrupos(prev => [...prev, nuevoGrupo])
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
          return {
            ...grupo,
            gastos: gastosRestantes,
            cantidadGastos: gastosRestantes.length,
            cantidadActividades: actividadesRestantes,
          }
        }
        if (grupo.id === grupoDestinoId) {
          const nuevasActividades = new Set([...grupo.gastos, ...gastosAMover].map(g => g.actividad)).size
          return {
            ...grupo,
            gastos: [...grupo.gastos, ...gastosAMover],
            cantidadGastos: grupo.gastos.length + gastosAMover.length,
            cantidadActividades: nuevasActividades,
          }
        }
        return grupo
      })
    })

    setActividadAMover(null)
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <PageHeader
        title="Rendiciones"
        backButtonText="Proyectos"
        onBack={() => router.push("/")}
        federacionName="Atletismo"
        currentVersion={undefined}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="bg-sidebar border-r border-border flex flex-col h-full shrink-0 w-60">
          <div className="flex flex-col gap-2 grow items-start p-2 pt-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-1.5 h-auto py-2"
              onClick={() => setIsAgregarGrupoOpen(true)}
            >
              <Plus className="size-4" />
              <span>Agregar un grupo</span>
            </Button>
            <div className="flex flex-col gap-2 w-full">
              {grupos.map((grupo) => (
                <Button
                  key={grupo.id}
                  variant={selectedGrupo === grupo.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-between h-auto px-4 py-2",
                    selectedGrupo === grupo.id && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => setSelectedGrupo(grupo.id)}
                >
                  <span className="text-left">{grupo.nombre}</span>
                  <Badge variant="secondary">
                    {grupo.cantidadActividades ?? 
                      new Set(grupo.gastos.map(g => g.actividad)).size}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-y-auto gap-10">
            {/* Header sticky */}
            <div className="bg-background sticky top-0 z-10 flex flex-col gap-4 p-4 pb-0 border-b">
              <div className="flex items-center gap-5">
                <h2 className="text-2xl font-medium">Gastos</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {gastosListos}/{totalGastos} listos
                  </span>
                  <div className="bg-slate-300 h-2 w-20 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-700 h-full transition-all"
                      style={{ width: `${progreso}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Toggles de meses */}
              <div className="flex gap-1 items-center">
                {meses.map((mes) => (
                  <button
                    key={mes}
                    onClick={() => setSelectedMes(mes)}
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

              {/* Tabs y Sort */}
              <div className="flex items-center justify-between border-b border-input pb-0">
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-auto">
                  <TabsList className="h-10 bg-transparent p-0">
                    <TabsTrigger
                      value="todos"
                      className="h-10 px-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
                    >
                      Todos
                    </TabsTrigger>
                    <TabsTrigger
                      value="incompletos"
                      className="h-10 px-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
                    >
                      Incompletos
                    </TabsTrigger>
                    <TabsTrigger
                      value="listos"
                      className="h-10 px-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
                    >
                      Listos
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex gap-1 items-center">
                  <button
                    onClick={() => setSortBy("actividades")}
                    className={cn(
                      "h-9 px-2.5 rounded-md text-sm font-medium transition-colors",
                      sortBy === "actividades"
                        ? "bg-muted text-foreground"
                        : "text-foreground hover:bg-accent"
                    )}
                  >
                    Por actividades
                  </button>
                  <button
                    onClick={() => setSortBy("tipo-gasto")}
                    className={cn(
                      "h-9 px-2.5 rounded-md text-sm font-medium transition-colors",
                      sortBy === "tipo-gasto"
                        ? "bg-muted text-foreground"
                        : "text-foreground hover:bg-accent"
                    )}
                  >
                    Por Tipo de gasto
                  </button>
                </div>
              </div>
            </div>

            {/* Listado de gastos agrupados por actividad */}
            <div className="flex flex-col gap-6 p-4">
              {Object.entries(gastosPorActividad).map(([actividad, gastos]) => (
                <div key={actividad} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between py-3">
                    <h3 className="text-xl font-medium">{actividad}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {gastos.length} gastos
                      </span>
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
                  </div>

                  <div className="flex flex-col border-t">
                    {gastos.map((gasto, index) => (
                      <button
                        key={gasto.id}
                        onClick={() => setSelectedGasto(gasto)}
                        className={cn(
                          "flex gap-4 items-start p-2 border-b transition-colors text-left",
                          selectedGasto?.id === gasto.id
                            ? "bg-accent"
                            : index === 0 && selectedGasto === null
                            ? "bg-accent"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <div className="flex-1 flex gap-2 min-w-[200px] p-3">
                          <div className="flex-1 flex flex-col gap-1">
                            <h4 className="text-base font-semibold">{gasto.tipoGasto}</h4>
                            <Badge
                              variant={gasto.estado === "listo" ? "default" : "outline"}
                              className={cn(
                                "w-fit",
                                gasto.estado === "listo" && "bg-teal-700 text-white border-teal-700"
                              )}
                            >
                              {gasto.estado === "listo" ? "Listo" : "Incompleto"}
                            </Badge>
                            <p className="text-sm text-foreground line-clamp-2">
                              {gasto.descripcion}
                            </p>
                          </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center p-3">
                          <p className="text-sm text-muted-foreground">{gasto.actividad}</p>
                        </div>
                        <div className="flex-1 flex items-center justify-end p-3">
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(gasto.costoUnitario)}
                          </p>
                        </div>
                        <div className="w-16 flex items-center justify-end p-3">
                          <p className="text-sm text-muted-foreground">{gasto.cantidad}</p>
                        </div>
                        <div className="flex-1 flex items-center justify-end min-w-[128px] p-3">
                          <p className="text-sm font-medium">{formatCurrency(gasto.costoTotal)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel derecho */}
          {selectedGasto && (
            <GastoDetailPanel>
              <GastoDetailPanel.Header onClose={() => setSelectedGasto(null)}>
                <GastoDetailPanel.Info>
                  <p className="text-sm text-muted-foreground">{selectedGasto.actividad}</p>
                  <h3 className="text-lg font-semibold">{selectedGasto.tipoGasto}</h3>
                  <p className="text-sm text-foreground line-clamp-2">
                    {selectedGasto.descripcion}
                  </p>
                  <p className="text-sm font-semibold">{formatCurrency(selectedGasto.costoTotal)}</p>
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
                >
                  <p className="text-xs font-medium">
                    {selectedGasto.documentosRequeridos.filter((d) => d.subido).length}/
                    {selectedGasto.documentosRequeridos.length} requisitos listos
                  </p>
                </GastoDetailPanel.Actions>
              </GastoDetailPanel.Header>

              <GastoDetailPanel.Content>
                {/* Contenedor de requisitos originales */}
                <GastoDetailPanel.RequisitosSection title="Requisitos para rendición">
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
                <GastoDetailPanel.AdicionalesSection title="Información adicional">
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
    </div>
  )
}
