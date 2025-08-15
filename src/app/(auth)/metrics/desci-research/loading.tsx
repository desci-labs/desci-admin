import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between space-x-4">
        <Skeleton className="h-5 w-64" />
        <div className="flex items-center justify-end gap-3">
          {/* Date filter skeleton */}
          <Skeleton className="h-10 w-48" />
          {/* Interval selector skeleton */}
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Chart grid skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Chats chart skeleton */}
        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="pt-4">
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        {/* Unique Users chart skeleton */}
        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="pt-4">
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        {/* User Sessions chart skeleton */}
        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="pt-4">
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        {/* User Sessions Duration chart skeleton */}
        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="pt-4">
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Devices chart skeleton */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Chart area skeleton */}
            <Skeleton className="h-64 w-full" />

            {/* Legend skeleton */}
            <div className="flex flex-wrap gap-4 pt-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
