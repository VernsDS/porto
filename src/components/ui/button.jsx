import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all active:translate-y-0.5 disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-ink text-cream hover:bg-mint',
        outline: 'border-2 border-ink/30 hover:border-mint hover:text-mint',
        ghost: 'hover:bg-ink/10',
      },
      size: { default: 'h-11 px-5', sm: 'h-9 px-3', lg: 'h-12 px-7 text-base' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)
export function Button({ className, variant, size, as: Comp = 'button', ...props }) {
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
