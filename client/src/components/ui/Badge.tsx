import * as React from "react"
import { cn } from "../../utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline';
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    secondary: "border-transparent bg-[var(--muted)] text-[var(--muted-foreground)]",
    outline: "text-[var(--muted-foreground)] border border-[var(--border)]",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
