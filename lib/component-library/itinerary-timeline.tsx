import * as React from "react"
import { cn } from "@/lib/utils"

const ItineraryTimelineRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
})
ItineraryTimelineRoot.displayName = "ItineraryTimelineRoot"

const ItineraryTimelineSection = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex gap-4 items-start", className)}
      {...props}
    />
  )
})
ItineraryTimelineSection.displayName = "ItineraryTimelineSection"

const ItineraryTimelineSectionLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-start shrink-0 w-[92px]",
        className
      )}
      {...props}
    />
  )
})
ItineraryTimelineSectionLabel.displayName = "ItineraryTimelineSectionLabel"

const ItineraryTimelineSectionLabelText = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "font-medium leading-6 not-italic relative shrink-0 text-base text-foreground text-right tracking-normal w-full",
        className
      )}
      {...props}
    />
  )
})
ItineraryTimelineSectionLabelText.displayName = "ItineraryTimelineSectionLabelText"

const ItineraryTimelineSectionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "basis-0 flex flex-col grow items-start min-h-px min-w-px relative shrink-0",
        className
      )}
      {...props}
    />
  )
})
ItineraryTimelineSectionContent.displayName = "ItineraryTimelineSectionContent"

const ItineraryTimelineItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    isLast?: boolean
  }
>(({ className, isLast, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex gap-4 items-start relative shrink-0 w-full", className)}
      {...props}
    >
      {children}
    </div>
  )
})
ItineraryTimelineItem.displayName = "ItineraryTimelineItem"

const ItineraryTimelineItemMarker = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showLine?: boolean
  }
>(({ className, showLine = true, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "box-border flex flex-col gap-[3px] items-center pb-0 pt-1 px-0 relative self-stretch shrink-0 w-4",
        className
      )}
      {...props}
    >
      <div className="bg-white border-2 border-foreground border-solid h-4 rounded-full shrink-0 w-full" />
      {showLine && (
        <div className="basis-0 bg-foreground grow min-h-px min-w-px shrink-0 w-0.5" />
      )}
    </div>
  )
})
ItineraryTimelineItemMarker.displayName = "ItineraryTimelineItemMarker"

const ItineraryTimelineItemContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "basis-0 box-border flex flex-col font-normal grow items-start leading-6 min-h-px min-w-px not-italic pb-10 pt-0 px-0 relative shrink-0 text-base tracking-normal",
        className
      )}
      {...props}
    />
  )
})
ItineraryTimelineItemContent.displayName = "ItineraryTimelineItemContent"

const ItineraryTimelineItemCity = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("relative shrink-0 text-foreground w-full", className)}
      {...props}
    />
  )
})
ItineraryTimelineItemCity.displayName = "ItineraryTimelineItemCity"

const ItineraryTimelineItemDate = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("relative shrink-0 text-muted-foreground w-full", className)}
      {...props}
    />
  )
})
ItineraryTimelineItemDate.displayName = "ItineraryTimelineItemDate"

export const ItineraryTimeline = {
  Root: ItineraryTimelineRoot,
  Section: ItineraryTimelineSection,
  SectionLabel: ItineraryTimelineSectionLabel,
  SectionLabelText: ItineraryTimelineSectionLabelText,
  SectionContent: ItineraryTimelineSectionContent,
  Item: ItineraryTimelineItem,
  ItemMarker: ItineraryTimelineItemMarker,
  ItemContent: ItineraryTimelineItemContent,
  ItemCity: ItineraryTimelineItemCity,
  ItemDate: ItineraryTimelineItemDate,
}


