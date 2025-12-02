import * as React from "react"
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
}


