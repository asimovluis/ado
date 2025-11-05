"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/composite/page-header"
import { SidebarNav } from "@/components/composite/sidebar-nav"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, MoreVertical, ArrowRight, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function ActividadesPage() {
  const router = useRouter()
  const sidebarItems = [
    { id: "antecedentes", label: "Antecedentes", active: false, href: "/" },
    { id: "actividades", label: "Actividades", badge: "3", active: true, href: "/actividades" },
    { id: "viajes", label: "Viajes", badge: "3", href: "/viajes" },
  ]

  const activities = [
    {
      id: "1",
      title: "Participación mundial en carrera de atletismo",
      description:
        "Este evento consiste en la participación a nivel mundial en una competencia de atletismo, donde atletas de diversas naciones se reúnen para competir en diferentes disciplinas.",
      href: "/actividades/1",
    },
    {
      id: "2",
      title: "Carreras de prueba en Italia y Francia",
      description:
        "Este evento consiste en la participación a nivel mundial en una competencia de atletismo, donde atletas de diversas naciones se reúnen para competir en diferentes disciplinas.",
      href: "/actividades/2",
    },
    {
      id: "3",
      title: "Participación mundial en carrera de atletismo",
      description:
        "Este evento consiste en la participación a nivel mundial en una competencia de atletismo, donde atletas de diversas naciones se reúnen para competir en diferentes disciplinas.",
      href: "/actividades/3",
    },
  ]

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
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center px-0 py-3 w-[600px]"
            >
              <h2 className="text-2xl font-medium text-foreground leading-8">
                Actividades
              </h2>
            </motion.div>
            <div className="flex flex-col gap-3 items-center w-full">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="w-[600px]"
                >
                  <Item variant="muted" asChild className="p-6 gap-6 rounded-xl border border-border">
                    <Link href={activity.href}>
                      <ItemContent className="gap-5">
                        <div className="flex gap-2 items-start w-full">
                          <ItemTitle className="text-lg font-bold leading-7 underline grow">
                            {activity.title}
                          </ItemTitle>
                          <ItemActions className="pt-0.5 shrink-0">
                            <ChevronRight className="size-6" />
                          </ItemActions>
                        </div>
                        <ItemDescription className="text-base font-medium leading-6 text-foreground">
                          {activity.description}
                        </ItemDescription>
                      </ItemContent>
                    </Link>
                  </Item>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center justify-between px-0 py-3 w-[600px]"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              >
                <Button variant="secondary" className="gap-1.5">
                  <span>Viajes</span>
                  <ArrowRight className="size-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

