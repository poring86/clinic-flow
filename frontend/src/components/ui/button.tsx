import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "border border-[#3f66ff]/60 bg-gradient-to-r from-[#2b59ff] to-[#2f8bff] text-white shadow-[0_8px_20px_rgba(38,112,255,0.35)] hover:brightness-110 active:brightness-95",
        destructive:
          "bg-destructive text-white shadow-md hover:shadow-lg hover:bg-destructive/90 active:bg-destructive/80 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/70 transition-all",
        outline:
          "border border-[#4f75ff]/65 bg-[#2c335e]/40 text-[#d5ddff] shadow-sm hover:bg-[#364178]/70 hover:border-[#6790ff]",
        secondary:
          "border border-[#a24dff]/60 bg-gradient-to-r from-[#b14ff3] to-[#c249d6] text-white shadow-[0_8px_20px_rgba(190,80,220,0.32)] hover:brightness-110 active:brightness-95",
        ghost:
          "hover:bg-accent/15 hover:text-accent-foreground dark:hover:bg-accent/20 transition-all",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
