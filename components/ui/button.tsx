import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-bold font-heading rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
    
    const variants = {
      default: "bg-mlh-red border-mlh-red text-white hover:bg-white hover:text-mlh-red active:translate-y-0.5 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]",
      outline: "bg-transparent border-slate-300 text-slate-700 hover:border-mlh-blue hover:text-mlh-blue active:translate-y-0.5",
      secondary: "bg-mlh-yellow border-mlh-yellow text-slate-900 hover:bg-white hover:text-mlh-yellow active:translate-y-0.5 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
    }

    const sizes = {
      default: "h-11 px-6 text-sm",
      sm: "h-9 px-4 text-xs",
      lg: "h-12 px-8 text-base"
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
