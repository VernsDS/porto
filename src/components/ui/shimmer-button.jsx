import { cn } from '../../lib/utils'
// Gaya komponen "Shimmer Button" ala 21st.dev
export function ShimmerButton({ className, children, ...props }) {
  return (
    <a
      className={cn(
        'group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-xl bg-mint px-7 font-bold text-cream whitespace-nowrap shrink-0 transition-transform duration-150 active:translate-y-0.5',
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-[160%] -skew-x-12 bg-gradient-to-r from-transparent via-white/55 to-transparent group-hover:animate-[shimmer_0.85s_cubic-bezier(0.22,1,0.36,1)]"
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </a>
  )
}
