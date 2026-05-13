"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import { DayPicker } from "react-day-picker"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col gap-4 sm:flex-row",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-base font-semibold text-[#e7edff]",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 border-[#4f74ff]/65 bg-[#2d3563]/70 p-0 text-[#c7d4ff] opacity-100 hover:bg-[#3a4682]"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "w-9 rounded-md text-[0.82rem] font-medium text-[#93a4d9]",
        row: "mt-2 flex w-full",
        cell: cn(
          "relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20",
          props.mode === "range"
            ? "[&:has(>.day-range-start[aria-selected])]:rounded-l-2xl [&:has(>.day-range-end[aria-selected])]:rounded-r-2xl [&:has(>.day-range-start[aria-selected])]:bg-[#8b5cf6] [&:has(>.day-range-middle[aria-selected])]:bg-[#3b82f6] [&:has(>.day-range-end[aria-selected])]:bg-[#8b5cf6]"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 rounded-md p-0 font-medium text-[#dbe4ff] aria-selected:rounded-none aria-selected:opacity-100 hover:bg-[#3a4682] hover:text-white"
        ),
        day_range_start:
          "day-range-start aria-selected:rounded-l-2xl aria-selected:rounded-r-none aria-selected:!bg-[#8b5cf6] aria-selected:text-white aria-selected:shadow-[0_0_0_1px_rgba(139,92,246,0.45),0_8px_18px_rgba(59,130,246,0.3)]",
        day_range_end:
          "day-range-end aria-selected:rounded-r-2xl aria-selected:rounded-l-none aria-selected:!bg-[#8b5cf6] aria-selected:text-white aria-selected:shadow-[0_0_0_1px_rgba(139,92,246,0.45),0_8px_18px_rgba(59,130,246,0.3)]",
        day_selected:
          "text-white hover:brightness-110 focus:brightness-110",
        day_today: "bg-[#404b89] text-white",
        day_outside:
          "day-outside text-[#6f7daf] aria-selected:text-[#8a96c3]",
        day_disabled: "text-[#5f6a95] opacity-50",
        day_range_middle:
          "day-range-middle aria-selected:rounded-none aria-selected:!bg-[#3b82f6] aria-selected:text-white aria-selected:brightness-110 aria-selected:shadow-[inset_0_0_0_1px_rgba(147,197,253,0.38),0_6px_16px_rgba(59,130,246,0.35)]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
