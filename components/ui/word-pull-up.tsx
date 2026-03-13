"use client";
import { cn } from "@/lib/utils";

interface WordPullUpProps {
  words: string;
  className?: string;
}

/**
 * Simple CSS-animated text reveal. Each word fades in and slides up
 * with a staggered delay. Uses pure CSS animations to avoid
 * framer-motion hydration timing issues.
 */
function WordPullUp({ words, className }: WordPullUpProps) {
  const wordArray = words.split(" ");

  return (
    <p
      className={cn(
        "font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm",
        className,
      )}
    >
      {wordArray.map((word, i) => (
        <span
          key={i}
          className="inline-block animate-word-pull-up opacity-0"
          style={{
            paddingRight: "0.3em",
            animationDelay: `${i * 0.04}s`,
            animationFillMode: "forwards",
          }}
        >
          {word === "" ? <span>&nbsp;</span> : word}
        </span>
      ))}
    </p>
  );
}

export { WordPullUp };
