"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Code2, Eye } from "lucide-react"
import { CodeViewer } from "@/components/composite/code-viewer"
import { componentPreviews } from "@/lib/component-library/previews"
import { componentCodeSnippets } from "@/lib/component-library/code-snippets"

// Componentes documentados (solo los que tienen preview + code completo)
const documentedComponents = [
  { name: "anchor-nav", category: "custom" as const },
  { name: "block-selector", category: "custom" as const },
  { name: "chat-panel", category: "custom" as const },
  { name: "form-card", category: "custom" as const },
  { name: "itinerary-timeline", category: "custom" as const },
  { name: "page-header", category: "custom" as const },
  { name: "sidebar-nav", category: "custom" as const },
  { name: "estilos-globales", category: "custom" as const },
].sort((a, b) => a.name.localeCompare(b.name))

type ViewMode = "preview" | "code"

export default function LibreriaProyectoPage() {
  // Seleccionar el primer componente que tenga preview disponible
  const getInitialComponent = () => {
    const componentWithPreview = documentedComponents.find(
      (c) => componentPreviews[c.name]
    )
    return componentWithPreview?.name || documentedComponents[0]?.name || null
  }

  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    getInitialComponent()
  )
  const [viewMode, setViewMode] = useState<ViewMode>("preview")

  const selectedComponentData = documentedComponents.find(
    (c) => c.name === selectedComponent
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar overflow-y-auto shrink-0">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-sidebar-foreground mb-4">
            Librería de Componentes
          </h2>
          <div className="flex flex-col gap-6">
            {/* Componentes Documentados */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Componentes Documentados
              </h3>
              <div className="flex flex-col gap-1">
                {documentedComponents.map((component) => (
                  <Button
                    key={component.name}
                    variant={
                      selectedComponent === component.name
                        ? "secondary"
                        : "ghost"
                    }
                    className={cn(
                      "justify-start text-left h-auto py-2 px-3",
                      selectedComponent === component.name &&
                        "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      setSelectedComponent(component.name)
                      setViewMode("preview")
                    }}
                  >
                    <span className="text-sm capitalize">
                      {component.name.replace(/-/g, " ")}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-col grow overflow-hidden">
        {selectedComponentData && (
          <>
            {/* Header con tabs Preview/Code */}
            <div className="border-b border-border bg-background p-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground capitalize">
                {selectedComponentData.name.replace(/-/g, " ")}
              </h1>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "preview" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("preview")}
                  className="gap-2"
                >
                  <Eye className="size-4" />
                  Preview
                </Button>
                <Button
                  variant={viewMode === "code" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("code")}
                  className="gap-2"
                >
                  <Code2 className="size-4" />
                  Code
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="grow overflow-y-auto p-8">
              {viewMode === "preview" ? (
                <ComponentPreview componentName={selectedComponentData.name} />
              ) : (
                <ComponentCode componentName={selectedComponentData.name} />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

// Componente para mostrar el preview
function ComponentPreview({ componentName }: { componentName: string }) {
  const preview = componentPreviews[componentName]

  if (!preview) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] border border-border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">
          Preview no disponible para: {componentName}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-border rounded-lg bg-background p-8">
        {preview.component}
      </div>
    </div>
  )
}

// Componente para mostrar el código
function ComponentCode({ componentName }: { componentName: string }) {
  const [code, setCode] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCode = async () => {
      setLoading(true)
      try {
        // Primero intentar cargar desde code snippets
        if (componentCodeSnippets[componentName]) {
          setCode(componentCodeSnippets[componentName])
          setLoading(false)
          return
        }

        // Si no está en snippets, intentar desde previews
        const preview = componentPreviews[componentName]
        if (preview) {
          setCode(preview.code)
          setLoading(false)
          return
        }

        // Si es estilos globales, usar el código del snippet
        if (componentName === "estilos-globales") {
          if (componentCodeSnippets[componentName]) {
            setCode(componentCodeSnippets[componentName])
            setLoading(false)
            return
          }
        }

        // Componente no refactorizado aún
        setCode("// Componente no refactorizado aún. El código estará disponible pronto.")
      } catch (error) {
        setCode("// Error al cargar el código")
      } finally {
        setLoading(false)
      }
    }

    loadCode()
  }, [componentName])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <p className="text-muted-foreground">Cargando código...</p>
      </div>
    )
  }

  const language = componentName === "estilos-globales" ? "css" : "tsx"

  return (
    <div className="flex flex-col gap-4">
      <CodeViewer code={code} language={language} />
      {componentName !== "estilos-globales" && componentCodeSnippets[componentName] && (
        <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
          <p className="font-medium mb-2">📦 Ubicación del archivo:</p>
          <p>
            <code className="text-xs bg-background px-1 py-0.5 rounded">
              lib/component-library/{componentName}.tsx
            </code>
          </p>
        </div>
      )}
    </div>
  )
}


