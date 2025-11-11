"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Paperclip, Send, Link as LinkIcon } from "lucide-react"
import { ViabilizacionStatusSelector, type ViabilizacionStatus } from "@/components/composite/viabilizacion-status-selector"
import { BlockSelector, type BlockOption } from "@/components/composite/block-selector"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  sender?: string
  content: string | React.ReactNode
  timestamp: string
  isOwn?: boolean
  links?: Array<{ label: string; href?: string }>
  lists?: Array<{ items: string[] }>
}

interface ChatPanelProps {
  title?: string
  viabilizacionStatus?: ViabilizacionStatus
  onViabilizacionStatusChange?: (status: ViabilizacionStatus) => void
  messages: ChatMessage[]
  onClose?: () => void
  onSend?: (message: string) => void
  className?: string
  // Nuevas props para selector de bloques
  blocks?: BlockOption[]
  selectedBlockId?: string | null
  onBlockSelect?: (blockId: string) => void
}

export function ChatPanel({ 
  title,
  viabilizacionStatus,
  onViabilizacionStatusChange,
  messages, 
  onClose, 
  onSend,
  className,
  blocks,
  selectedBlockId,
  onBlockSelect,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("")

  const handleSend = () => {
    if (inputValue.trim() && onSend) {
      onSend(inputValue.trim())
      setInputValue("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <motion.div
      initial={{ x: 380, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 380, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={cn("border-l border-border bg-sidebar flex flex-col h-full shrink-0 w-[380px]", className)}
    >
      <div className="bg-sidebar flex gap-2 items-start p-2 relative shrink-0 w-full">
        <div className="flex flex-col gap-2 grow min-w-0">
          <h3 className="text-base font-semibold text-foreground leading-6">
            Comentarios
          </h3>
        </div>
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="shrink-0 size-10"
          >
            <X className="size-5" />
          </Button>
        )}
      </div>
      <div className="bg-sidebar flex flex-col gap-2 items-center p-2 relative shrink-0 w-full">
        {blocks && onBlockSelect && (
          <BlockSelector
            blocks={blocks}
            selectedBlockId={selectedBlockId || null}
            onSelect={onBlockSelect}
            className="w-full"
          />
        )}
        {false && viabilizacionStatus && onViabilizacionStatusChange && (
          <div className="w-fit">
            <ViabilizacionStatusSelector
              status={viabilizacionStatus}
              onStatusChange={onViabilizacionStatusChange}
            />
          </div>
        )}
      </div>
      <div className="bg-sidebar flex flex-col grow min-h-0 overflow-y-auto p-2">
        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-2 px-2 py-6">
            <div className="bg-white/90 flex items-center justify-center px-2 py-1 rounded-xl">
              <p className="text-sm font-semibold text-foreground leading-5">
                Martes, 21 de octubre 2025
              </p>
            </div>
          </div>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.2, 
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1]
              }}
              className={cn(
                "flex flex-col gap-2 p-2 w-full",
                message.isOwn ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "border border-border/10 flex flex-col gap-2 max-w-[540px] p-3 rounded-lg",
                  message.isOwn
                    ? "bg-[var(--chat-bubble-own)] rounded-bl-xl rounded-tl-xl rounded-tr-xl"
                    : "bg-[var(--chat-bubble-other)] rounded-br-xl rounded-tl-xl rounded-tr-xl"
                )}
              >
                {message.sender && (
                  <p className="text-base font-semibold text-foreground leading-6">
                    {message.sender}
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  {message.links?.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="flex items-start gap-1.5 py-2 text-sm font-medium text-foreground underline"
                    >
                      <LinkIcon className="size-5 shrink-0" />
                      <span>{link.label}</span>
                    </a>
                  ))}
                  <div className="text-base leading-6 text-foreground">
                    {typeof message.content === "string" ? (
                      <p>{message.content}</p>
                    ) : (
                      message.content
                    )}
                  </div>
                  {message.lists?.map((list, listIndex) => (
                    <ul key={listIndex} className="list-disc list-inside space-y-0">
                      {list.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
                <p className="text-xs font-semibold text-muted-foreground text-right leading-4">
                  {message.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="bg-sidebar flex flex-col gap-3 items-start p-2">
        <div className="flex gap-2 items-center w-full">
          <Button variant="ghost" size="icon">
            <Paperclip className="size-5" />
          </Button>
          <Input 
            placeholder="Input Value" 
            className="grow h-10"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button 
            variant="default" 
            size="icon" 
            className="bg-primary"
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            <Send className="size-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
