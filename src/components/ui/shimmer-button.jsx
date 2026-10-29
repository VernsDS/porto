import { cn } from '../../lib/utils'
// Gaya komponen "Shimmer Button" ala 21st.dev
export function ShimmerButton({ className, children, ...props }) {
  return (
    <a
      className={cn('group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-xl bg-mint px-7 font-bold text-cream', className)}
      {...props}
    >
      <span className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/60 group-hover:animate-[shimmer_.9s_ease]" />
      <span className="relative flex items-center gap-2">{children}</span>
    </a>
  )
}
