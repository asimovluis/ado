"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface SidebarNavItem {
  id: string
  label: string
  active?: boolean
  badge?: string | number
  href?: string
}

interface SidebarNavProps {
  items: SidebarNavItem[]
  className?: string
}

export function SidebarNav({ items, className }: SidebarNavProps) {
  return (
    <nav className={cn("bg-sidebar border-r border-border flex flex-col gap-3 h-full items-start p-2 shrink-0 w-60", className)}>
      <div className="flex flex-col gap-2 grow items-start pt-3 px-0 pb-0 w-full">
        {items.map((item) => {
          const href = item.href || (item.id === "antecedentes" ? "/" : `/${item.id}`)
          
          return (
            <Button
              key={item.id}
              variant={item.active ? "secondary" : "ghost"}
              className={cn(
                "h-auto justify-start px-4 py-2 w-full",
                item.active && "bg-accent text-accent-foreground"
              )}
              asChild
            >
              <Link href={href}>
                <span className="grow text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="outline" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
