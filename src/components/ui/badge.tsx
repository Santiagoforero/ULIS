import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-accent/10 text-accent border-accent/20',
        secondary:
          'border-transparent bg-muted text-muted-foreground border-border',
        success:
          'border-transparent bg-success/15 text-[oklch(0.35_0.12_145)] border-success/25',
        warning:
          'border-transparent bg-warning/20 text-[oklch(0.35_0.08_75)] border-warning/30',
        destructive:
          'border-transparent bg-destructive/15 text-destructive border-destructive/25',
        outline: 'text-foreground border-border bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
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
