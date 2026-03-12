import { Container } from '@/components/ui/container'

type SkeletonVariant = 'compact' | 'standard' | 'featured' | 'hero'

interface ArticleCardSkeletonProps {
  variant?: SkeletonVariant
  className?: string
}

function Bone({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-surface ${className}`} />
  )
}

/**
 * Skeleton placeholder that mirrors ArticleCard layout variants.
 * Used inside Suspense fallbacks for loading states.
 */
export function ArticleCardSkeleton({
  variant = 'standard',
  className = '',
}: ArticleCardSkeletonProps) {
  if (variant === 'hero') {
    return (
      <div className={`relative overflow-hidden rounded-sm ${className}`}>
        <Bone className="aspect-[21/9] w-full" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
          <Bone className="mb-3 h-5 w-20" />
          <Bone className="mb-2 h-10 w-3/4" />
          <Bone className="mb-4 h-10 w-1/2" />
          <Bone className="mb-4 h-5 w-2/3" />
          <Bone className="h-4 w-48" />
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`flex gap-5 ${className}`}>
        <Bone className="h-[100px] w-[140px] shrink-0 sm:h-[110px] sm:w-[160px]" />
        <div className="flex flex-1 flex-col justify-center">
          <Bone className="mb-2 h-4 w-16" />
          <Bone className="mb-1.5 h-5 w-full" />
          <Bone className="mb-2 h-5 w-3/4" />
          <Bone className="h-3 w-32" />
        </div>
      </div>
    )
  }

  if (variant === 'featured') {
    return (
      <div className={`flex flex-col ${className}`}>
        <Bone className="aspect-[16/10] w-full rounded-sm" />
        <div className="mt-5">
          <Bone className="mb-3 h-4 w-20" />
          <Bone className="mb-2 h-7 w-full" />
          <Bone className="mb-3 h-7 w-3/4" />
          <Bone className="mb-4 h-5 w-full" />
          <Bone className="h-3 w-40" />
        </div>
      </div>
    )
  }

  // standard
  return (
    <div className={`flex flex-col ${className}`}>
      <Bone className="aspect-[3/2] w-full rounded-sm" />
      <div className="mt-4">
        <Bone className="mb-2 h-4 w-16" />
        <Bone className="mb-1.5 h-5 w-full" />
        <Bone className="mb-2 h-5 w-2/3" />
        <Bone className="mb-3 h-4 w-full" />
        <Bone className="h-3 w-36" />
      </div>
    </div>
  )
}

/**
 * Pre-composed skeleton groups matching page section layouts.
 */
export function HeroSkeleton() {
  return <ArticleCardSkeleton variant="hero" />
}

export function FeaturedGridSkeleton() {
  return (
    <section className="py-12 lg:py-16">
      <Container size="wide">
        <div className="mb-8 flex items-center gap-4">
          <Bone className="h-7 w-32" />
          <div className="h-px flex-1 bg-border" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <ArticleCardSkeleton variant="featured" />
          </div>
          <div className="flex flex-col gap-8 lg:col-span-5">
            <ArticleCardSkeleton variant="standard" />
            <ArticleCardSkeleton variant="standard" />
          </div>
        </div>
      </Container>
    </section>
  )
}

export function LatestFeedSkeleton() {
  return (
    <section className="bg-surface py-12 lg:py-16">
      <Container size="wide">
        <div className="mb-8 flex items-center gap-4">
          <Bone className="h-7 w-24" />
          <div className="h-px flex-1 bg-border" aria-hidden="true" />
        </div>
        <div className="space-y-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <ArticleCardSkeleton variant="compact" />
              {i < 4 && <div className="mt-8 border-t border-border" />}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export function CategorySectionSkeleton() {
  return (
    <section className="py-12 lg:py-16">
      <Container size="wide">
        <div className="mb-8 flex items-end justify-between border-b-2 border-primary pb-3">
          <Bone className="h-7 w-32" />
          <Bone className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <ArticleCardSkeleton variant="standard" />
          <ArticleCardSkeleton variant="standard" />
          <ArticleCardSkeleton variant="standard" />
        </div>
      </Container>
    </section>
  )
}
