"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { History, MessageSquare } from "lucide-react"
import { ViabilizacionStatusSelector, type ViabilizacionStatus } from "@/components/composite/viabilizacion-status-selector"
import { cn } from "@/lib/utils"

interface FormField {
  label: string
  value: string | React.ReactNode
}

interface FormCardProps {
  id: string
  title: string
  fields: FormField[]
  viabilizacionStatus?: ViabilizacionStatus
  onViabilizacionStatusChange?: (status: ViabilizacionStatus) => void
  onEdit?: () => void
  onComment?: (blockId: string) => void
  className?: string
}

export function FormCard({ 
  id,
  title, 
  fields,
  viabilizacionStatus,
  onViabilizacionStatusChange,
  onEdit, 
  onComment,
  className 
}: FormCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card className={cn("relative gap-6 w-[600px]", className)}>
        <CardHeader>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-2 grow min-w-0">
                <CardTitle className="text-lg font-bold leading-7">
                  {title}
                </CardTitle>
              </div>
              <CardAction className="absolute right-2 top-2 flex gap-1 shrink-0">
                {viabilizacionStatus && onViabilizacionStatusChange && (
                  <ViabilizacionStatusSelector
                    status={viabilizacionStatus}
                    onStatusChange={onViabilizacionStatusChange}
                  />
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Button variant="ghost" size="icon" onClick={() => onComment?.(id)}>
                    <MessageSquare className="size-5" />
                  </Button>
                </motion.div>
              </CardAction>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 px-6">
          {fields.map((field, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.2, 
                delay: index * 0.03,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="flex flex-col gap-1"
            >
              <p className="text-sm font-medium text-muted-foreground leading-5">
                {field.label}
              </p>
              <div className="text-base leading-6 text-foreground">
                {typeof field.value === "string" ? (
                  <p>{field.value}</p>
                ) : (
                  field.value
                )}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
