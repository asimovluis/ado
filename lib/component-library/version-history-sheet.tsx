import * as React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Check, BadgeCheck, XOctagon } from "lucide-react"
import { cn } from "@/lib/utils"

export type ViabilizacionResponse = "viabilizado" | "viabilizado-con-indicaciones" | "no-viabilizado" | null

const VersionHistorySheetRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Sheet>
>(({ className, ...props }, ref) => {
  return <Sheet {...props} />
})
VersionHistorySheetRoot.displayName = "VersionHistorySheetRoot"

const VersionHistorySheetContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SheetContent>
>(({ className, ...props }, ref) => {
  return (
    <SheetContent
      ref={ref}
      side="right"
      className={cn("p-4 w-[300px] sm:w-[440px] overflow-y-auto", className)}
      {...props}
    />
  )
})
VersionHistorySheetContent.displayName = "VersionHistorySheetContent"

const VersionHistorySheetHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SheetHeader>
>(({ className, ...props }, ref) => {
  return (
    <SheetHeader
      ref={ref}
      className={cn(className)}
      {...props}
    />
  )
})
VersionHistorySheetHeader.displayName = "VersionHistorySheetHeader"

const VersionHistorySheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<typeof SheetTitle>
>(({ className, ...props }, ref) => {
  return (
    <SheetTitle
      ref={ref}
      className={cn(className)}
      {...props}
    />
  )
})
VersionHistorySheetTitle.displayName = "VersionHistorySheetTitle"

const VersionHistorySheetList = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2 mt-6", className)}
      {...props}
    />
  )
})
VersionHistorySheetList.displayName = "VersionHistorySheetList"

const VersionHistorySheetItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    isCurrent?: boolean
  }
>(({ className, isCurrent, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-2 p-4 rounded-lg border cursor-pointer transition-colors",
        isCurrent
          ? "border-primary bg-accent"
          : "border-border bg-background hover:bg-accent/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
VersionHistorySheetItem.displayName = "VersionHistorySheetItem"

const VersionHistorySheetItemHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-between gap-2", className)}
      {...props}
    />
  )
})
VersionHistorySheetItemHeader.displayName = "VersionHistorySheetItemHeader"

const VersionHistorySheetItemVersion = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("text-base font-semibold text-foreground", className)}
      {...props}
    />
  )
})
VersionHistorySheetItemVersion.displayName = "VersionHistorySheetItemVersion"

const VersionHistorySheetItemBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Badge>
>(({ className, ...props }, ref) => {
  return (
    <Badge
      ref={ref}
      variant="secondary"
      className={cn("text-xs", className)}
      {...props}
    />
  )
})
VersionHistorySheetItemBadge.displayName = "VersionHistorySheetItemBadge"

const VersionHistorySheetItemCurrentIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "size-5 rounded-full bg-primary flex items-center justify-center shrink-0",
        className
      )}
      {...props}
    >
      <Check className="size-3 text-primary-foreground" />
    </div>
  )
})
VersionHistorySheetItemCurrentIndicator.displayName = "VersionHistorySheetItemCurrentIndicator"

const VersionHistorySheetItemContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
})
VersionHistorySheetItemContent.displayName = "VersionHistorySheetItemContent"

const VersionHistorySheetItemDate = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
VersionHistorySheetItemDate.displayName = "VersionHistorySheetItemDate"

const VersionHistorySheetItemStatus = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    variant?: ViabilizacionResponse
  }
>(({ className, variant, children, ...props }, ref) => {
  const getIcon = () => {
    if (variant === "viabilizado") {
      return <BadgeCheck className="size-5 text-[var(--teal-700)]" />
    }
    if (variant === "viabilizado-con-indicaciones") {
      return <BadgeCheck className="size-5 text-blue-700" />
    }
    if (variant === "no-viabilizado") {
      return <XOctagon className="size-5 text-destructive" />
    }
    return null
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {getIcon()}
      {children}
    </div>
  )
})
VersionHistorySheetItemStatus.displayName = "VersionHistorySheetItemStatus"

const VersionHistorySheetItemStatusLabel = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
})
VersionHistorySheetItemStatusLabel.displayName = "VersionHistorySheetItemStatusLabel"

export const VersionHistorySheet = {
  Root: VersionHistorySheetRoot,
  Content: VersionHistorySheetContent,
  Header: VersionHistorySheetHeader,
  Title: VersionHistorySheetTitle,
  List: VersionHistorySheetList,
  Item: VersionHistorySheetItem,
  ItemHeader: VersionHistorySheetItemHeader,
  ItemVersion: VersionHistorySheetItemVersion,
  ItemBadge: VersionHistorySheetItemBadge,
  ItemCurrentIndicator: VersionHistorySheetItemCurrentIndicator,
  ItemContent: VersionHistorySheetItemContent,
  ItemDate: VersionHistorySheetItemDate,
  ItemStatus: VersionHistorySheetItemStatus,
  ItemStatusLabel: VersionHistorySheetItemStatusLabel,
}


