import * as React from "react"
import { Button } from "@/components/ui/button"
import { Check, BadgeCheck, XOctagon } from "lucide-react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

export type ViabilizacionStatus = "pre-viabilizado" | "viabilizado" | "no-viabilizado" | null

const viabilizacionStatusVariants = cva(
  "h-8 border-2 transition-colors hover:opacity-90",
  {
    variants: {
      variant: {
        viabilizado: "bg-[var(--teal-700)] border-[var(--teal-700)] text-primary-foreground",
        "pre-viabilizado": "bg-teal-100 border-[var(--teal-700)] text-foreground",
        "no-viabilizado": "bg-amber-50 border-amber-500 text-foreground",
        default: "bg-background border-border text-foreground hover:bg-accent",
      },
      size: {
        icon: "gap-0 px-2 w-8",
        full: "gap-1.5 px-3 w-[140px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "full",
    },
  }
)

const ViabilizacionStatusSelectorRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex gap-1", className)}
      {...props}
    />
  )
})
ViabilizacionStatusSelectorRoot.displayName = "ViabilizacionStatusSelectorRoot"

type VariantType = "viabilizado" | "pre-viabilizado" | "no-viabilizado" | "default"

const ViabilizacionStatusSelectorButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & {
    variant?: VariantType
    iconVariant?: "viabilizado" | "pre-viabilizado" | "no-viabilizado"
    hideLabel?: boolean
  }
>(({ className, variant = "default", iconVariant, hideLabel = false, children, ...props }, ref) => {
  const getIcon = () => {
    if (iconVariant === "viabilizado") {
      return <BadgeCheck className="size-4" />
    }
    if (iconVariant === "pre-viabilizado") {
      return <Check className="size-4" />
    }
    if (iconVariant === "no-viabilizado") {
      return <XOctagon className="size-4" />
    }
    return null
  }

  const getIconClass = (v: VariantType): string => {
    if (v === "viabilizado") return "text-primary-foreground"
    if (v === "pre-viabilizado") return "text-[var(--teal-700)]"
    if (v === "no-viabilizado") return "text-amber-600"
    return "text-foreground"
  }
  
  const iconClass = getIconClass(variant)

  return (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      className={cn(
        viabilizacionStatusVariants({ 
          variant: variant === "default" ? "default" : variant,
          size: hideLabel ? "icon" : "full"
        }),
        className
      )}
      {...props}
    >
      {getIcon() && (
        <span className={cn(iconClass)}>
          {getIcon()}
        </span>
      )}
      {!hideLabel && children}
    </Button>
  )
})
ViabilizacionStatusSelectorButton.displayName = "ViabilizacionStatusSelectorButton"

export const ViabilizacionStatusSelector = {
  Root: ViabilizacionStatusSelectorRoot,
  Button: ViabilizacionStatusSelectorButton,
}


