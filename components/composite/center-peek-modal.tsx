"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CenterPeekModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export function CenterPeekModal({
  open,
  onOpenChange,
  children,
  className,
}: CenterPeekModalProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false)
        }
      }}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 animate-in fade-in-0"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative z-50 w-[90vw] h-[90vh] bg-background rounded-xl shadow-lg border border-border flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

interface CenterPeekModalHeaderProps extends React.ComponentProps<"div"> {
  onClose?: () => void
}

function CenterPeekModalHeader({
  className,
  onClose,
  children,
  ...props
}: CenterPeekModalHeaderProps) {
  return (
    <div
      className={cn("flex items-center justify-end px-6 pt-6 pb-2", className)}
      {...props}
    >
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      )}
      {children}
    </div>
  )
}

type CenterPeekModalContentProps = React.ComponentProps<"div">

function CenterPeekModalContent({
  className,
  ...props
}: CenterPeekModalContentProps) {
  return (
    <div
      className={cn("flex-1 overflow-hidden min-h-0", className)}
      {...props}
    />
  )
}

type CenterPeekModalFooterProps = React.ComponentProps<"div">

function CenterPeekModalFooter({
  className,
  ...props
}: CenterPeekModalFooterProps) {
  return (
    <div
      className={cn("flex items-center justify-end gap-2 px-6 pb-6 pt-3", className)}
      {...props}
    />
  )
}

CenterPeekModal.Header = CenterPeekModalHeader
CenterPeekModal.Content = CenterPeekModalContent
CenterPeekModal.Footer = CenterPeekModalFooter

