"use client"

import { cn } from "@/lib/utils"

interface ItineraryItem {
  city: string
  date: string
}

interface ItinerarySection {
  label: "Salida" | "Regreso" | "Actividad intermedia"
  items: ItineraryItem[]
}

interface ItineraryTimelineProps {
  sections: ItinerarySection[]
  className?: string
}

export function ItineraryTimeline({ sections, className }: ItineraryTimelineProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="flex gap-4 items-start">
          <div className="flex flex-col items-start shrink-0 w-[92px]">
            <p className="font-medium leading-6 not-italic relative shrink-0 text-base text-foreground text-right tracking-normal w-full">
              {section.label}
            </p>
          </div>
          <div className="basis-0 flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
            {section.items.map((item, itemIndex) => {
              const isLastItem = itemIndex === section.items.length - 1
              const isLastSection = sectionIndex === sections.length - 1
              const shouldShowLine = !(isLastItem && isLastSection)

              return (
                <div key={itemIndex} className="flex gap-4 items-start relative shrink-0 w-full">
                  <div className="box-border flex flex-col gap-[3px] items-center pb-0 pt-1 px-0 relative self-stretch shrink-0 w-4">
                    <div className="bg-white border-2 border-foreground border-solid h-4 rounded-full shrink-0 w-full" />
                    {shouldShowLine && (
                      <div className="basis-0 bg-foreground grow min-h-px min-w-px shrink-0 w-0.5" />
                    )}
                  </div>
                  <div className="basis-0 box-border flex flex-col font-normal grow items-start leading-6 min-h-px min-w-px not-italic pb-10 pt-0 px-0 relative shrink-0 text-base tracking-normal">
                    <p className="relative shrink-0 text-foreground w-full">
                      {item.city}
                    </p>
                    <p className="relative shrink-0 text-muted-foreground w-full">
                      {item.date}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

