import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-[8px] border px-2.5 py-0.5 text-[10px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        paid: "bg-[#e8f5f0] text-[#115746] border-[#b2d8cc]",
        pending: "bg-[#FDF4D7] text-[#8a6f00] border-[#e8d98a]",
        disputed: "bg-[#fff8f6] text-[#FA4812] border-[#fecaca]",
        invoiced: "bg-[#fff3e0] text-[#c2410c] border-[#fed7aa]",
        vetted: "bg-[#e8f5f0] text-[#115746] border-[#b2d8cc] text-[9px] px-[6px] py-[2px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
