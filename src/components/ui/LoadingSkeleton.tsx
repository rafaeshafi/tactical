import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded bg-[#1e3329]', className)} />
  )
}

export function TeamPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#1e3329]" />
        <div className="space-y-2">
          <div className="h-8 w-48 rounded bg-[#1e3329]" />
          <div className="h-4 w-32 rounded bg-[#1e3329]" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="h-96 rounded-xl bg-[#1e3329]" />
        <div className="lg:col-span-2 space-y-4">
          <div className="h-40 rounded-xl bg-[#1e3329]" />
          <div className="h-56 rounded-xl bg-[#1e3329]" />
        </div>
      </div>
    </div>
  )
}
