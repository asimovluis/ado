"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/composite/page-header"
import { SidebarNav } from "@/components/composite/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MoreVertical, Send } from "lucide-react"

const STORAGE_KEY = "ado-observaciones-generales"

export default function ObservacionesGeneralesPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [observaciones, setObservaciones] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  const sidebarItems = [
    { id: "sobre-actividad", label: "Sobre la actividad", active: pathname === "/sobre-actividad", href: "/sobre-actividad" },
    { id: "beneficiarios", label: "Beneficiarios", active: pathname === "/beneficiarios", href: "/beneficiarios" },
    { id: "gastos", label: "Gastos", active: pathname === "/gastos", href: "/gastos" },
    { id: "viajes", label: "Viajes", active: pathname === "/viajes", href: "/viajes" },
    { id: "observaciones-generales", label: "Observaciones generales", active: pathname === "/observaciones-generales", href: "/observaciones-generales" },
  ]

  useEffect(() => {
    setIsMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setObservaciones(stored)
      } catch (e) {
        console.error("Error parsing stored data:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, observaciones)
    }
  }, [observaciones, isMounted])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <span>Mundial de atletismo y carreras</span>
            <Badge variant="secondary">En revisión</Badge>
          </div>
        }
        backButtonText="Proyectos"
        onBack={() => router.push("/proyectos")}
        rightActions={
          <>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <Button variant="default" className="gap-1.5">
                <span>Enviar</span>
                <Send className="size-5" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <Button variant="ghost" size="icon">
                <MoreVertical className="size-5" />
              </Button>
            </motion.div>
          </>
        }
      />
      <div className="flex grow overflow-hidden">
        <SidebarNav items={sidebarItems} />
        <main className="flex grow flex-col gap-2 overflow-y-auto px-4 py-2">
          <div className="flex flex-col gap-10 items-center w-full">
            <div className="flex items-center px-0 py-3 w-full max-w-[920px]">
              <h2 className="text-2xl font-medium text-foreground leading-8">
                Observaciones generales
              </h2>
            </div>
            <div className="flex flex-col gap-3 items-center w-full">
              <Card className="relative gap-6 w-full max-w-[920px]">
                <CardHeader>
                  <CardTitle className="text-lg font-bold leading-7">
                    Observaciones generales
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Escribe tus observaciones generales aquí..."
                    className="min-h-[200px]"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

