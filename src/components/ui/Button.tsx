import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[12px] text-sm font-semibold shadow-sm transition-all duration-150 hover:-translate-y-px active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#115746]/25 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:translate-y-0",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-b from-[#14624f] to-[#0f4e3f] text-white hover:shadow-md hover:brightness-105",
        outline: "border-[1.5px] border-[#115746] bg-white text-[#115746] hover:bg-[#115746] hover:text-white",
        orange: "bg-gradient-to-b from-[#fb5222] to-[#f23e0a] text-white shadow-[0_2px_8px_rgba(250,72,18,0.28)] hover:brightness-105",
        wa: "bg-[#f0fff4] text-[#25d366] border-[1.5px] border-[#25d366] hover:bg-[#25d366] hover:text-white",
        danger: "bg-[#fff8f6] text-[#FA4812] border-[1.5px] border-[#FA4812] hover:bg-[#FA4812] hover:text-white",
        plain: "bg-white text-[#888] border-[1.5px] border-[#e0e0e0] hover:bg-gray-50",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
