import * as React from "react"
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Paperclip, Send, Link as LinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const ChatPanelRoot = React.forwardRef<
  HTMLDivElement,
  Omit<HTMLMotionProps<"div">, "ref">
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
  Omit<HTMLMotionProps<"div">, "ref"> & {
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
}


