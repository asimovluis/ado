// Este archivo contiene los snippets de código completos para cada componente
// Se usa en la página de documentación para mostrar el código completo

export const componentCodeSnippets: Record<string, string> = {
  "page-header": `import * as React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const PageHeaderRoot = React.forwardRef<
  HTMLHeaderElement,
  React.ComponentProps<"header">
>(({ className, ...props }, ref) => {
  return (
    <header
      ref={ref}
      className={cn(
        "border-b border-border bg-background flex items-center gap-5 p-4 w-full",
        className
      )}
      {...props}
    />
  )
})
PageHeaderRoot.displayName = "PageHeaderRoot"

const PageHeaderBack = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & {
    text?: string
  }
>(({ className, text = "Volver", ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      className={cn("gap-1.5", className)}
      {...props}
    >
      <ArrowLeft className="size-5" />
      <span>{text}</span>
    </Button>
  )
})
PageHeaderBack.displayName = "PageHeaderBack"

const PageHeaderContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-0 grow min-w-0", className)}
      {...props}
    />
  )
})
PageHeaderContent.displayName = "PageHeaderContent"

const PageHeaderSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "text-sm font-medium text-foreground leading-5",
        className
      )}
      {...props}
    />
  )
})
PageHeaderSubtitle.displayName = "PageHeaderSubtitle"

const PageHeaderTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<"h1">
>(({ className, ...props }, ref) => {
  return (
    <h1
      ref={ref}
      className={cn(
        "text-base font-semibold text-foreground leading-6",
        className
      )}
      {...props}
    />
  )
})
PageHeaderTitle.displayName = "PageHeaderTitle"

const PageHeaderActions = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
})
PageHeaderActions.displayName = "PageHeaderActions"

export const PageHeader = {
  Root: PageHeaderRoot,
  Back: PageHeaderBack,
  Content: PageHeaderContent,
  Subtitle: PageHeaderSubtitle,
  Title: PageHeaderTitle,
  Actions: PageHeaderActions,
}`,

  "block-selector": `import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const BlockSelectorRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Popover>
>(({ className, ...props }, ref) => {
  return <Popover {...props} />
})
BlockSelectorRoot.displayName = "BlockSelectorRoot"

const BlockSelectorTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & {
    selectedLabel?: string
    placeholder?: string
  }
>(({ className, selectedLabel, placeholder = "Seleccionar bloque", ...props }, ref) => {
  return (
    <PopoverTrigger asChild>
      <Button
        ref={ref}
        variant="outline"
        role="combobox"
        className={cn(
          "h-10 w-full justify-between bg-[#000000] border-input rounded-md",
          className
        )}
        {...props}
      >
        <span className="text-sm font-medium text-accent-foreground truncate">
          {selectedLabel || placeholder}
        </span>
        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
  )
})
BlockSelectorTrigger.displayName = "BlockSelectorTrigger"

const BlockSelectorContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof PopoverContent>
>(({ className, ...props }, ref) => {
  return (
    <PopoverContent
      ref={ref}
      className={cn("w-[var(--radix-popover-trigger-width)] p-1", className)}
      {...props}
    />
  )
})
BlockSelectorContent.displayName = "BlockSelectorContent"

const BlockSelectorList = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
})
BlockSelectorList.displayName = "BlockSelectorList"

const BlockSelectorItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    isSelected?: boolean
  }
>(({ className, isSelected, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors",
        isSelected && "bg-accent",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
BlockSelectorItem.displayName = "BlockSelectorItem"

const BlockSelectorItemLabel = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  )
})
BlockSelectorItemLabel.displayName = "BlockSelectorItemLabel"

const BlockSelectorItemCheck = React.forwardRef<
  SVGSVGElement,
  React.ComponentProps<typeof Check>
>(({ className, ...props }, ref) => {
  return (
    <Check
      ref={ref}
      className={cn("size-4 text-foreground shrink-0", className)}
      {...props}
    />
  )
})
BlockSelectorItemCheck.displayName = "BlockSelectorItemCheck"

export const BlockSelector = {
  Root: BlockSelectorRoot,
  Trigger: BlockSelectorTrigger,
  Content: BlockSelectorContent,
  List: BlockSelectorList,
  Item: BlockSelectorItem,
  ItemLabel: BlockSelectorItemLabel,
  ItemCheck: BlockSelectorItemCheck,
}`,

  "sidebar-nav": `import * as React from "react"
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
}`,

  "form-card": `import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const formCardVariants = cva(
  "relative gap-6 w-[600px]",
  {
    variants: {
      variant: {
        default: "",
        viabilizado: "bg-green-100 shadow-[0_2px_8px_rgba(34,197,94,0.1)]",
        "pre-viabilizado": "bg-cyan-50 shadow-[0_2px_8px_rgba(103,232,249,0.1)]",
        "no-viabilizado": "bg-orange-50 shadow-[0_2px_8px_rgba(251,146,60,0.1)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const FormCardRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    VariantProps<typeof formCardVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card
        className={cn(formCardVariants({ variant }), className)}
        {...props}
      />
    </motion.div>
  )
})
FormCardRoot.displayName = "FormCardRoot"

const FormCardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CardHeader>
>(({ className, ...props }, ref) => {
  return (
    <CardHeader
      ref={ref}
      className={cn(className)}
      {...props}
    />
  )
})
FormCardHeader.displayName = "FormCardHeader"

const FormCardTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CardTitle>
>(({ className, ...props }, ref) => {
  return (
    <CardTitle
      ref={ref}
      className={cn("text-lg font-bold leading-7", className)}
      {...props}
    />
  )
})
FormCardTitle.displayName = "FormCardTitle"

const FormCardAction = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CardAction>
>(({ className, ...props }, ref) => {
  return (
    <CardAction
      ref={ref}
      className={cn("absolute right-2 top-2 flex gap-1 shrink-0", className)}
      {...props}
    />
  )
})
FormCardAction.displayName = "FormCardAction"

const FormCardCommentButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
    >
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn(className)}
        {...props}
      >
        <MessageSquare className="size-5" />
      </Button>
    </motion.div>
  )
})
FormCardCommentButton.displayName = "FormCardCommentButton"

const FormCardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CardContent>
>(({ className, ...props }, ref) => {
  return (
    <CardContent
      ref={ref}
      className={cn("flex flex-col gap-3 px-6", className)}
      {...props}
    />
  )
})
FormCardContent.displayName = "FormCardContent"

const FormCardField = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    index?: number
  }
>(({ className, index = 0, children, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.2,
        delay: index * 0.03,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
})
FormCardField.displayName = "FormCardField"

const FormCardFieldLabel = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "text-sm font-medium text-muted-foreground leading-5",
        className
      )}
      {...props}
    />
  )
})
FormCardFieldLabel.displayName = "FormCardFieldLabel"

const FormCardFieldValue = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-base leading-6 text-foreground", className)}
      {...props}
    />
  )
})
FormCardFieldValue.displayName = "FormCardFieldValue"

const FormCardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "border-t border-border flex items-center justify-end pt-3 px-6 pb-0",
        className
      )}
      {...props}
    />
  )
})
FormCardFooter.displayName = "FormCardFooter"

export const FormCard = {
  Root: FormCardRoot,
  Header: FormCardHeader,
  Title: FormCardTitle,
  Action: FormCardAction,
  CommentButton: FormCardCommentButton,
  Content: FormCardContent,
  Field: FormCardField,
  FieldLabel: FormCardFieldLabel,
  FieldValue: FormCardFieldValue,
  Footer: FormCardFooter,
}`,

  "anchor-nav": `import * as React from "react"
import { Button } from "@/components/ui/button"
import { BadgeCheck, Check, XOctagon, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const AnchorNavRoot = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"nav">
>(({ className, ...props }, ref) => {
  return (
    <nav
      ref={ref}
      className={cn(
        "flex flex-col gap-1 items-start shrink-0 sticky top-4 p-4 self-start",
        className
      )}
      {...props}
    />
  )
})
AnchorNavRoot.displayName = "AnchorNavRoot"

const AnchorNavItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & {
    active?: boolean
  }
>(({ className, active, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      className={cn(
        "h-auto justify-start px-3 py-2 w-auto text-left transition-colors",
        active
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
})
AnchorNavItem.displayName = "AnchorNavItem"

const AnchorNavItemLabel = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("text-sm whitespace-nowrap", className)}
      {...props}
    />
  )
})
AnchorNavItemLabel.displayName = "AnchorNavItemLabel"

const AnchorNavItemIcon = React.forwardRef<
  SVGSVGElement,
  React.ComponentProps<typeof BadgeCheck> & {
    variant?: "viabilizado" | "pre-viabilizado" | "no-viabilizado" | "default"
  }
>(({ className, variant = "default", ...props }, ref) => {
  if (variant === "viabilizado") {
    return (
      <BadgeCheck
        ref={ref}
        className={cn("size-4 text-[var(--teal-700)] shrink-0", className)}
        {...props}
      />
    )
  }
  if (variant === "pre-viabilizado") {
    return (
      <Check
        ref={ref}
        className={cn("size-4 text-[var(--teal-700)] shrink-0", className)}
        {...props}
      />
    )
  }
  if (variant === "no-viabilizado") {
    return (
      <XOctagon
        ref={ref}
        className={cn("size-4 text-amber-600 shrink-0", className)}
        {...props}
      />
    )
  }
  return (
    <Circle
      ref={ref}
      className={cn("size-4 text-muted-foreground shrink-0", className)}
      {...props}
    />
  )
})
AnchorNavItemIcon.displayName = "AnchorNavItemIcon"

export const AnchorNav = {
  Root: AnchorNavRoot,
  Item: AnchorNavItem,
  ItemLabel: AnchorNavItemLabel,
  ItemIcon: AnchorNavItemIcon,
}`,

  "itinerary-timeline": `import * as React from "react"
import { cn } from "@/lib/utils"

const ItineraryTimelineRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
})
ItineraryTimelineRoot.displayName = "ItineraryTimelineRoot"

const ItineraryTimelineSection = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex gap-4 items-start", className)}
      {...props}
    />
  )
})
ItineraryTimelineSection.displayName = "ItineraryTimelineSection"

const ItineraryTimelineSectionLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-start shrink-0 w-[92px]",
        className
      )}
      {...props}
    />
  )
})
ItineraryTimelineSectionLabel.displayName = "ItineraryTimelineSectionLabel"

const ItineraryTimelineSectionLabelText = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "font-medium leading-6 not-italic relative shrink-0 text-base text-foreground text-right tracking-normal w-full",
        className
      )}
      {...props}
    />
  )
})
ItineraryTimelineSectionLabelText.displayName = "ItineraryTimelineSectionLabelText"

const ItineraryTimelineSectionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "basis-0 flex flex-col grow items-start min-h-px min-w-px relative shrink-0",
        className
      )}
      {...props}
    />
  )
})
ItineraryTimelineSectionContent.displayName = "ItineraryTimelineSectionContent"

const ItineraryTimelineItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    isLast?: boolean
  }
>(({ className, isLast, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex gap-4 items-start relative shrink-0 w-full", className)}
      {...props}
    >
      {children}
    </div>
  )
})
ItineraryTimelineItem.displayName = "ItineraryTimelineItem"

const ItineraryTimelineItemMarker = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showLine?: boolean
  }
>(({ className, showLine = true, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "box-border flex flex-col gap-[3px] items-center pb-0 pt-1 px-0 relative self-stretch shrink-0 w-4",
        className
      )}
      {...props}
    >
      <div className="bg-white border-2 border-foreground border-solid h-4 rounded-full shrink-0 w-full" />
      {showLine && (
        <div className="basis-0 bg-foreground grow min-h-px min-w-px shrink-0 w-0.5" />
      )}
    </div>
  )
})
ItineraryTimelineItemMarker.displayName = "ItineraryTimelineItemMarker"

const ItineraryTimelineItemContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "basis-0 box-border flex flex-col font-normal grow items-start leading-6 min-h-px min-w-px not-italic pb-10 pt-0 px-0 relative shrink-0 text-base tracking-normal",
        className
      )}
      {...props}
    />
  )
})
ItineraryTimelineItemContent.displayName = "ItineraryTimelineItemContent"

const ItineraryTimelineItemCity = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("relative shrink-0 text-foreground w-full", className)}
      {...props}
    />
  )
})
ItineraryTimelineItemCity.displayName = "ItineraryTimelineItemCity"

const ItineraryTimelineItemDate = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("relative shrink-0 text-muted-foreground w-full", className)}
      {...props}
    />
  )
})
ItineraryTimelineItemDate.displayName = "ItineraryTimelineItemDate"

export const ItineraryTimeline = {
  Root: ItineraryTimelineRoot,
  Section: ItineraryTimelineSection,
  SectionLabel: ItineraryTimelineSectionLabel,
  SectionLabelText: ItineraryTimelineSectionLabelText,
  SectionContent: ItineraryTimelineSectionContent,
  Item: ItineraryTimelineItem,
  ItemMarker: ItineraryTimelineItemMarker,
  ItemContent: ItineraryTimelineItemContent,
  ItemCity: ItineraryTimelineItemCity,
  ItemDate: ItineraryTimelineItemDate,
}`,

  "chat-panel": `import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Paperclip, Send, Link as LinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const ChatPanelRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ x: 380, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 380, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "border-l border-border bg-sidebar flex flex-col h-full shrink-0 w-[380px]",
        className
      )}
      {...props}
    />
  )
})
ChatPanelRoot.displayName = "ChatPanelRoot"

const ChatPanelHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-sidebar flex gap-2 items-start p-2 relative shrink-0 w-full",
        className
      )}
      {...props}
    />
  )
})
ChatPanelHeader.displayName = "ChatPanelHeader"

const ChatPanelTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<"h3">
>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        "text-base font-semibold text-foreground leading-6",
        className
      )}
      {...props}
    />
  )
})
ChatPanelTitle.displayName = "ChatPanelTitle"

const ChatPanelCloseButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("shrink-0 size-10", className)}
      {...props}
    >
      <X className="size-5" />
    </Button>
  )
})
ChatPanelCloseButton.displayName = "ChatPanelCloseButton"

const ChatPanelToolbar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-sidebar flex flex-col gap-2 items-center p-2 relative shrink-0 w-full",
        className
      )}
      {...props}
    />
  )
})
ChatPanelToolbar.displayName = "ChatPanelToolbar"

const ChatPanelMessages = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-sidebar flex flex-col grow min-h-0 overflow-y-auto p-2",
        className
      )}
      {...props}
    />
  )
})
ChatPanelMessages.displayName = "ChatPanelMessages"

const ChatPanelMessagesList = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-center", className)}
      {...props}
    />
  )
})
ChatPanelMessagesList.displayName = "ChatPanelMessagesList"

const ChatPanelDateSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2 px-2 py-6", className)}
      {...props}
    />
  )
})
ChatPanelDateSeparator.displayName = "ChatPanelDateSeparator"

const ChatPanelDateLabel = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <div className="bg-white/90 flex items-center justify-center px-2 py-1 rounded-xl">
      <p
        ref={ref}
        className={cn(
          "text-sm font-semibold text-foreground leading-5",
          className
        )}
        {...props}
      />
    </div>
  )
})
ChatPanelDateLabel.displayName = "ChatPanelDateLabel"

const ChatPanelMessage = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    isOwn?: boolean
    index?: number
  }
>(({ className, isOwn, index = 0, children, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(
        "flex flex-col gap-2 p-2 w-full",
        isOwn ? "items-end" : "items-start",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
})
ChatPanelMessage.displayName = "ChatPanelMessage"

const ChatPanelMessageBubble = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    isOwn?: boolean
  }
>(({ className, isOwn, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "border border-border/10 flex flex-col gap-2 max-w-[540px] p-3 rounded-lg",
        isOwn
          ? "bg-[var(--chat-bubble-own)] rounded-bl-xl rounded-tl-xl rounded-tr-xl"
          : "bg-[var(--chat-bubble-other)] rounded-br-xl rounded-tl-xl rounded-tr-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
ChatPanelMessageBubble.displayName = "ChatPanelMessageBubble"

const ChatPanelMessageSender = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-base font-semibold text-foreground leading-6", className)}
      {...props}
    />
  )
})
ChatPanelMessageSender.displayName = "ChatPanelMessageSender"

const ChatPanelMessageContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
})
ChatPanelMessageContent.displayName = "ChatPanelMessageContent"

const ChatPanelMessageText = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-base leading-6 text-foreground", className)}
      {...props}
    />
  )
})
ChatPanelMessageText.displayName = "ChatPanelMessageText"

const ChatPanelMessageLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a">
>(({ className, children, ...props }, ref) => {
  return (
    <a
      ref={ref}
      className={cn(
        "flex items-start gap-1.5 py-2 text-sm font-medium text-foreground underline",
        className
      )}
      {...props}
    >
      <LinkIcon className="size-5 shrink-0" />
      <span>{children}</span>
    </a>
  )
})
ChatPanelMessageLink.displayName = "ChatPanelMessageLink"

const ChatPanelMessageList = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn("list-disc list-inside space-y-0", className)}
      {...props}
    />
  )
})
ChatPanelMessageList.displayName = "ChatPanelMessageList"

const ChatPanelMessageTimestamp = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "text-xs font-semibold text-muted-foreground text-right leading-4",
        className
      )}
      {...props}
    />
  )
})
ChatPanelMessageTimestamp.displayName = "ChatPanelMessageTimestamp"

const ChatPanelFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("bg-sidebar flex flex-col gap-3 items-start p-2", className)}
      {...props}
    />
  )
})
ChatPanelFooter.displayName = "ChatPanelFooter"

const ChatPanelInputGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex gap-2 items-center w-full", className)}
      {...props}
    />
  )
})
ChatPanelInputGroup.displayName = "ChatPanelInputGroup"

const ChatPanelAttachmentButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(className)}
      {...props}
    >
      <Paperclip className="size-5" />
    </Button>
  )
})
ChatPanelAttachmentButton.displayName = "ChatPanelAttachmentButton"

const ChatPanelInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      placeholder="Escribe un mensaje..."
      className={cn("grow h-10", className)}
      {...props}
    />
  )
})
ChatPanelInput.displayName = "ChatPanelInput"

const ChatPanelSendButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="default"
      size="icon"
      className={cn("bg-primary", className)}
      {...props}
    >
      <Send className="size-5" />
    </Button>
  )
})
ChatPanelSendButton.displayName = "ChatPanelSendButton"

export const ChatPanel = {
  Root: ChatPanelRoot,
  Header: ChatPanelHeader,
  Title: ChatPanelTitle,
  CloseButton: ChatPanelCloseButton,
  Toolbar: ChatPanelToolbar,
  Messages: ChatPanelMessages,
  MessagesList: ChatPanelMessagesList,
  DateSeparator: ChatPanelDateSeparator,
  DateLabel: ChatPanelDateLabel,
  Message: ChatPanelMessage,
  MessageBubble: ChatPanelMessageBubble,
  MessageSender: ChatPanelMessageSender,
  MessageContent: ChatPanelMessageContent,
  MessageText: ChatPanelMessageText,
  MessageLink: ChatPanelMessageLink,
  MessageList: ChatPanelMessageList,
  MessageTimestamp: ChatPanelMessageTimestamp,
  Footer: ChatPanelFooter,
  InputGroup: ChatPanelInputGroup,
  AttachmentButton: ChatPanelAttachmentButton,
  Input: ChatPanelInput,
  SendButton: ChatPanelSendButton,
}`,

  "estilos-globales": `@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --color-teal-700: var(--teal-700);
  --color-teal-700-foreground: var(--teal-700-foreground);
  --color-chat-bubble-own: var(--chat-bubble-own);
  --color-chat-bubble-other: var(--chat-bubble-other);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.5rem;
  --background: #ffffff;
  --foreground: #020618;
  --card: #ffffff;
  --card-foreground: #020618;
  --popover: #ffffff;
  --popover-foreground: #020618;
  --primary: #244997;
  --primary-foreground: #f8fafc;
  --secondary: #f1f5f9;
  --secondary-foreground: #0f172b;
  --muted: #f1f5f9;
  --muted-foreground: #62748e;
  --accent: #f1f5f9;
  --accent-foreground: #0f172b;
  --destructive: #e7000b;
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #244997;
  --chart-1: #f97316;
  --chart-2: #06b6d4;
  --chart-3: #274754;
  --chart-4: #fbbf24;
  --chart-5: #f59e0b;
  --sidebar: #f8fafc;
  --sidebar-foreground: #020618;
  --sidebar-primary: #244997;
  --sidebar-primary-foreground: #f8fafc;
  --sidebar-accent: #f1f5f9;
  --sidebar-accent-foreground: #0f172b;
  --sidebar-border: #e2e8f0;
  --sidebar-ring: #244997;
  --teal-50: #f0fdfa;
  --teal-700: #00786f;
  --teal-700-foreground: #f8fafc;
  --chat-bubble-own: #f0fdfa;
  --chat-bubble-other: #ffffff;
}

.dark {
  --background: #020618;
  --foreground: #f8fafc;
  --card: #0f172b;
  --card-foreground: #f8fafc;
  --popover: #0f172b;
  --popover-foreground: #f8fafc;
  --primary: #3b5fa8;
  --primary-foreground: #f8fafc;
  --secondary: #1e293b;
  --secondary-foreground: #f1f5f9;
  --muted: #1e293b;
  --muted-foreground: #94a3b8;
  --accent: #1e293b;
  --accent-foreground: #f1f5f9;
  --destructive: #ff3333;
  --border: rgba(30, 41, 59, 0.3);
  --input: rgba(30, 41, 59, 0.4);
  --ring: #3b5fa8;
  --chart-1: #fb923c;
  --chart-2: #22d3ee;
  --chart-3: #38bdf8;
  --chart-4: #fcd34d;
  --chart-5: #fbbf24;
  --sidebar: #0f172b;
  --sidebar-foreground: #f1f5f9;
  --sidebar-primary: #3b5fa8;
  --sidebar-primary-foreground: #f8fafc;
  --sidebar-accent: #1e293b;
  --sidebar-accent-foreground: #f1f5f9;
  --sidebar-border: rgba(30, 41, 59, 0.3);
  --sidebar-ring: #3b5fa8;
  --teal-50: #0f172b;
  --teal-700: #00a693;
  --teal-700-foreground: #f8fafc;
  --chat-bubble-own: #0f172b;
  --chat-bubble-other: #1e293b;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}`,
}

