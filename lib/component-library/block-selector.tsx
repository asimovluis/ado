import * as React from "react"
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
>((props, ref) => {
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
          "h-10 w-full justify-between bg-background border-input rounded-md",
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
}


