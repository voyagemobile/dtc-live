/**
 * Newsletter CTA using the official DTC Live banner design.
 * The banner image already contains the subscribe UI (input + button),
 * so no additional form is needed.
 */
export function NewsletterCTA() {
  return (
    <section className="border-y border-border">
      <div className="mx-auto max-w-[1280px] px-5 py-8">
        {/* Desktop banner */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cta-banner.png"
          alt="Subscribe to DTC Live — The intelligence every DTC operator needs to build, grow, and scale."
          className="hidden w-full rounded-lg sm:block"
        />

        {/* Mobile banner */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cta-sidebar.png"
          alt="Subscribe to DTC Live"
          className="w-full rounded-lg sm:hidden"
        />
      </div>
    </section>
  )
}
