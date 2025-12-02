import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

const SidebarNavRoot = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"nav">
>(({ className, ...props }, ref) => {
  return (
    <nav
      ref={ref}
      className={cn(
        "bg-sidebar border-r border-border flex flex-col gap-3 h-full items-start p-2 shrink-0 w-60",
        className
      )}
      {...props}
    />
  )
})
SidebarNavRoot.displayName = "SidebarNavRoot"

const SidebarNavList = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-2 grow items-start pt-3 px-0 pb-0 w-full",
        className
      )}
      {...props}
    />
  )
})
SidebarNavList.displayName = "SidebarNavList"

const SidebarNavItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof Link> & {
    active?: boolean
  }
>(({ className, active, children, ...props }, ref) => {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "h-auto justify-start px-4 py-2 w-full",
        active && "bg-accent text-accent-foreground",
        className
      )}
      asChild
    >
      <Link ref={ref} {...props}>
        {children}
      </Link>
    </Button>
  )
})
SidebarNavItem.displayName = "SidebarNavItem"

const SidebarNavItemLabel = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("grow text-left", className)}
      {...props}
    />
  )
})
SidebarNavItemLabel.displayName = "SidebarNavItemLabel"

const SidebarNavItemBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Badge>
>(({ className, ...props }, ref) => {
  return (
    <Badge
      ref={ref}
      variant="outline"
      className={cn("ml-auto", className)}
      {...props}
    />
  )
})
SidebarNavItemBadge.displayName = "SidebarNavItemBadge"

export const SidebarNav = {
  Root: SidebarNavRoot,
  List: SidebarNavList,
  Item: SidebarNavItem,
  ItemLabel: SidebarNavItemLabel,
  ItemBadge: SidebarNavItemBadge,
}


