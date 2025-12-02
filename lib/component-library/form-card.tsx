import * as React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
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
  Omit<HTMLMotionProps<"div">, "ref"> & {
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
}


