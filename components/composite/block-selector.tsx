"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BlockOption {
  id: string
  label: string
}

interface BlockSelectorProps {
  blocks: BlockOption[]
  selectedBlockId: string | null
  onSelect: (blockId: string) => void
  className?: string
}

export function BlockSelector({
  blocks,
  selectedBlockId,
  onSelect,
  className,
}: BlockSelectorProps) {
  const selectedBlock = blocks.find((block) => block.id === selectedBlockId)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "h-10 w-full justify-between bg-background border-input rounded-md",
            className
          )}
        >
          <span className="text-sm font-medium text-accent-foreground truncate">
            {selectedBlock?.label || "Seleccionar bloque"}
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1">
        <div className="flex flex-col">
          {blocks.map((block) => (
            <button
              key={block.id}
              onClick={() => onSelect(block.id)}
              className={cn(
                "flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors",
                selectedBlockId === block.id && "bg-accent"
              )}
            >
              <span className="font-medium text-foreground">{block.label}</span>
              {selectedBlockId === block.id && (
                <Check className="size-4 text-foreground shrink-0" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

