"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X, Plus, Download, Upload, CheckCircle2, Circle, AlertTriangle, MoreVertical, MessageSquare, FileText, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface GastoDetailPanelProps {
  children: React.ReactNode
  className?: string
}

const GastoDetailPanel = React.forwardRef<HTMLDivElement, GastoDetailPanelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("border-l border-border w-[380px] shrink-0 flex flex-col h-full relative overflow-y-auto", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
GastoDetailPanel.displayName = "GastoDetailPanel"

interface GastoDetailPanelHeaderProps extends React.ComponentProps<"div"> {
  onClose?: () => void
}

const GastoDetailPanelHeader = React.forwardRef<HTMLDivElement, GastoDetailPanelHeaderProps>(
  ({ className, onClose, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-5 p-3 border-b bg-background relative", className)}
        {...props}
      >
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 absolute top-[8px] right-[8px] z-10"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        )}
        {children}
      </div>
    )
  }
)
GastoDetailPanelHeader.displayName = "GastoDetailPanelHeader"

interface GastoDetailPanelContentProps extends React.ComponentProps<"div"> {}

const GastoDetailPanelContent = React.forwardRef<HTMLDivElement, GastoDetailPanelContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-8 p-4", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
GastoDetailPanelContent.displayName = "GastoDetailPanelContent"

interface GastoDetailPanelInfoProps extends React.ComponentProps<"div"> {}

const GastoDetailPanelInfo = React.forwardRef<HTMLDivElement, GastoDetailPanelInfoProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
GastoDetailPanelInfo.displayName = "GastoDetailPanelInfo"

interface GastoDetailPanelActionsProps extends React.ComponentProps<"div"> {
  onAddDocument?: () => void
  onAddAclaracion?: () => void
  onVerPdf?: () => void
}

const GastoDetailPanelActions = React.forwardRef<HTMLDivElement, GastoDetailPanelActionsProps>(
  ({ className, onAddDocument, onAddAclaracion, onVerPdf, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 shrink-0">
                <Plus className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1" align="end">
              <div className="flex flex-col gap-0">
                <button className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent text-sm font-semibold text-foreground">
                  Agregar
                </button>
                <div className="h-px bg-border my-1" />
                <button
                  className="flex items-center gap-2 pl-8 pr-2 py-1.5 rounded-sm hover:bg-accent text-sm text-foreground relative"
                  onClick={onAddDocument}
                >
                  <Upload className="size-4 absolute left-2" />
                  Documento adicional
                </button>
                <button
                  className="flex items-center gap-2 pl-8 pr-2 py-1.5 rounded-sm hover:bg-accent text-sm text-foreground relative"
                  onClick={onAddAclaracion}
                >
                  <MessageSquare className="size-4 absolute left-2" />
                  Observaciones
                </button>
              </div>
            </PopoverContent>
          </Popover>
          <div className="flex gap-2 flex-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onVerPdf}
            >
              Ver PDF
            </Button>
            <Button size="sm" className="flex-1 gap-1.5">
              <Download className="size-4" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </div>
    )
  }
)
GastoDetailPanelActions.displayName = "GastoDetailPanelActions"

interface RequisitosSectionProps extends React.ComponentProps<"div"> {
  title?: string
}

const RequisitosSection = React.forwardRef<HTMLDivElement, RequisitosSectionProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-3", className)}
        {...props}
      >
        {title && (
          <p className="text-base font-medium text-foreground">
            {title}
          </p>
        )}
        <div className="border rounded-lg">
          {children}
        </div>
      </div>
    )
  }
)
RequisitosSection.displayName = "RequisitosSection"

interface AdicionalesSectionProps extends React.ComponentProps<"div"> {
  title?: string
}

const AdicionalesSection = React.forwardRef<HTMLDivElement, AdicionalesSectionProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-3", className)}
        {...props}
      >
        {title && (
          <p className="text-base font-medium text-foreground">
            {title}
          </p>
        )}
        <div className="border rounded-lg">
          {children}
        </div>
      </div>
    )
  }
)
AdicionalesSection.displayName = "AdicionalesSection"

const GastoDetailPanelRoot = GastoDetailPanel as typeof GastoDetailPanel & {
  Header: typeof GastoDetailPanelHeader
  Content: typeof GastoDetailPanelContent
  Info: typeof GastoDetailPanelInfo
  Actions: typeof GastoDetailPanelActions
  RequisitosSection: typeof RequisitosSection
  AdicionalesSection: typeof AdicionalesSection
}

GastoDetailPanelRoot.Header = GastoDetailPanelHeader
GastoDetailPanelRoot.Content = GastoDetailPanelContent
GastoDetailPanelRoot.Info = GastoDetailPanelInfo
GastoDetailPanelRoot.Actions = GastoDetailPanelActions
GastoDetailPanelRoot.RequisitosSection = RequisitosSection
GastoDetailPanelRoot.AdicionalesSection = AdicionalesSection

export { GastoDetailPanelRoot as GastoDetailPanel }

