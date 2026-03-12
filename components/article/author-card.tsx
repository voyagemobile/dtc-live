import Image from 'next/image'
import Link from 'next/link'
import type { GhostAuthor } from '@/lib/types'

interface AuthorCardProps {
  author: GhostAuthor
}

function AuthorInitials({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-surface text-lg font-bold text-text-muted"
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="border-t border-border pt-8 mt-12">
      <div className="flex items-start gap-5">
        {author.profile_image ? (
          <Link
            href={`/author/${author.slug}`}
            className="shrink-0"
            aria-label={`View all posts by ${author.name}`}
          >
            <Image
              src={author.profile_image}
              alt={author.name}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          </Link>
        ) : (
          <AuthorInitials name={author.name} />
        )}

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-text-caption">
            Written by
          </p>
          <Link
            href={`/author/${author.slug}`}
            className="mt-1 inline-block font-heading text-xl font-bold text-text-headline transition-colors duration-150 hover:text-primary"
          >
            {author.name}
          </Link>

          {author.bio && (
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {author.bio}
            </p>
          )}

          {author.website && (
            <a
              href={author.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${author.name}'s website (opens in new tab)`}
              className="mt-2 inline-block text-sm text-text-caption transition-colors duration-150 hover:text-primary"
            >
              {author.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
