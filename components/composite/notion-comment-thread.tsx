"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, Link as LinkIcon, Edit2, X, Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "@/prototype-logic/types"

interface NotionCommentThreadProps {
  messages: ChatMessage[]
  onSend?: (message: string) => void
  onEdit?: (messageId: string, updatedContent: string) => void
  onDelete?: (messageId: string) => void
  onFocus?: () => void
  onBlur?: () => void
  threadId?: string
  className?: string
}

export function NotionCommentThread({ 
  messages, 
  onSend,
  onEdit,
  onDelete,
  onFocus,
  onBlur,
  threadId,
  className 
}: NotionCommentThreadProps) {
  const [inputValue, setInputValue] = useState("")
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.currentTarget.blur()
    }
  }

  const handleStartEdit = (message: ChatMessage) => {
    const content = typeof message.content === "string" ? message.content : ""
    setEditingMessageId(message.id)
    setEditValue(content)
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditValue("")
  }

  const handleSaveEdit = () => {
    if (editingMessageId && editValue.trim() && onEdit) {
      onEdit(editingMessageId, editValue.trim())
      setEditingMessageId(null)
      setEditValue("")
    }
  }

  const handleEditKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      handleSaveEdit()
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleCancelEdit()
    }
  }

  const commentCount = messages.length

  return (
    <div 
      className={cn("relative w-full", className)}
      onFocus={onFocus}
      onBlur={onBlur}
      tabIndex={-1}
      data-thread-id={threadId}
    >
      {/* Thread siempre visible */}
      <div
        className={cn(
          "w-full max-h-[400px]",
          "bg-background border border-border rounded-lg shadow-lg",
          "flex flex-col overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            Comentarios {commentCount > 0 && `(${commentCount})`}
          </h3>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay comentarios aún
            </p>
          ) : (
            messages.map((message) => {
              const isEditing = editingMessageId === message.id
              const canEdit = typeof message.content === "string" && onEdit
              
              return (
                <div
                  key={message.id}
                  className="flex flex-col gap-1.5 p-2 rounded-md bg-muted/30 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1.5 grow min-w-0">
                      {message.sender && (
                        <p className="text-xs font-semibold text-foreground">
                          {message.sender}
                        </p>
                      )}
                      {isEditing ? (
                        <div className="flex gap-2 items-start">
                          <Textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleEditKeyPress}
                            className="grow h-[180px] text-sm resize-none"
                            autoFocus
                          />
                          <div className="flex flex-col gap-2 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={handleSaveEdit}
                              disabled={!editValue.trim()}
                            >
                              <Check className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={handleCancelEdit}
                            >
                              <X className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          {message.links?.map((link, linkIndex) => (
                            <a
                              key={linkIndex}
                              href={link.href}
                              className="flex items-start gap-1.5 py-1 text-xs font-medium text-foreground underline"
                            >
                              <LinkIcon className="size-3 shrink-0 mt-0.5" />
                              <span>{link.label}</span>
                            </a>
                          ))}
                          <div className="text-sm leading-5 text-foreground">
                            {typeof message.content === "string" ? (
                              <p>{message.content}</p>
                            ) : (
                              message.content
                            )}
                          </div>
                          {message.lists?.map((list, listIndex) => (
                            <ul key={listIndex} className="list-disc list-inside space-y-0 text-sm">
                              {list.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ))}
                        </div>
                      )}
                    </div>
                    {!isEditing && (
                      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleStartEdit(message)}
                            title="Editar comentario"
                          >
                            <Edit2 className="size-3" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onDelete(message.id)}
                            title="Eliminar comentario"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  {!isEditing && (
                    <p className="text-xs text-muted-foreground">
                      {message.timestamp}
                    </p>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Input para nuevo comentario */}
        {onSend && (
          <div className="p-3 border-t border-border">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Agregar comentario..."
                className="grow h-8 text-sm"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                onKeyDown={handleKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              <Button
                variant="default"
                size="icon"
                className="bg-primary h-8 w-8 shrink-0"
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                <Send className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

