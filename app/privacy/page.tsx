import type { Metadata } from 'next'
import { Container } from '@/components/ui/container'

export const metadata: Metadata = {
  title: 'Privacy Policy | DTC Live',
  description: 'Privacy Policy for DTC Live.',
}

export default function PrivacyPage() {
  return (
    <Container size="narrow" className="py-16">
      <h1 className="font-heading text-4xl font-bold text-text-headline">Privacy Policy</h1>
      <p className="mt-2 text-sm text-text-caption">Last updated: March 13, 2026</p>

      <div className="prose mt-10 max-w-none text-text-body prose-headings:font-heading prose-headings:text-text-headline prose-h2:mt-10 prose-h2:text-xl prose-p:leading-relaxed prose-a:text-primary">
        <h2>1. Introduction</h2>
        <p>
          DTC Live (&quot;dtc.live&quot;, &quot;the Site&quot;), operated by DTC Live Media (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), respects your privacy and is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights.
        </p>

        <h2>2. Information We Collect</h2>
        <h3>Information you provide</h3>
        <ul>
          <li><strong>Email address:</strong> When you subscribe to our newsletter through the Site.</li>
          <li><strong>Contact information:</strong> If you reach out to us via email.</li>
        </ul>

        <h3>Information collected automatically</h3>
        <ul>
          <li><strong>Usage data:</strong> Pages visited, time spent on pages, referral sources, and general browsing behavior.</li>
          <li><strong>Device data:</strong> Browser type, operating system, screen resolution, and language preferences.</li>
          <li><strong>IP address:</strong> Used for analytics and approximate geographic location.</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Deliver newsletter content and editorial updates you have subscribed to.</li>
          <li>Analyze Site usage to improve content, design, and user experience.</li>
          <li>Respond to your inquiries or requests.</li>
          <li>Maintain the security and integrity of the Site.</li>
        </ul>

        <h2>4. Analytics</h2>
        <p>
          We use analytics services to understand how visitors use the Site. These tools collect information about your visits, including pages viewed, time on site, and how you arrived at the Site. This data is aggregated and anonymized where possible.
        </p>

        <h2>5. Cookies</h2>
        <p>
          The Site may use cookies and similar technologies to enhance your experience. Cookies are small text files stored on your device. You can control cookies through your browser settings. Disabling cookies may limit some functionality of the Site.
        </p>
        <p>We use cookies for:</p>
        <ul>
          <li><strong>Essential cookies:</strong> Required for the Site to function properly.</li>
          <li><strong>Analytics cookies:</strong> Help us understand Site usage patterns.</li>
        </ul>

        <h2>6. Data Sharing</h2>
        <p>
          We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We may share data with:
        </p>
        <ul>
          <li><strong>Service providers:</strong> Trusted third parties that help us operate the Site (hosting, email delivery, analytics), bound by confidentiality obligations.</li>
          <li><strong>Legal requirements:</strong> When required by law, regulation, or legal process.</li>
        </ul>

        <h2>7. Data Retention</h2>
        <p>
          We retain your email address for as long as you remain subscribed to our newsletter. If you unsubscribe, we will remove your email from our active mailing list. Anonymized analytics data may be retained indefinitely for trend analysis.
        </p>

        <h2>8. Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access, correct, or delete your personal data.</li>
          <li>Opt out of communications at any time via the unsubscribe link in our emails.</li>
          <li>Request information about what data we hold about you.</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:contact@dtc.live">contact@dtc.live</a>.
        </p>

        <h2>9. Data Security</h2>
        <p>
          We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
        </p>

        <h2>10. Children&apos;s Privacy</h2>
        <p>
          The Site is not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, contact us and we will take steps to delete it.
        </p>

        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &quot;Last updated&quot; date. We encourage you to review this page periodically.
        </p>

        <h2>12. Contact</h2>
        <p>
          If you have questions or concerns about this Privacy Policy, contact us at{' '}
          <a href="mailto:contact@dtc.live">contact@dtc.live</a>.
        </p>
      </div>
    </Container>
  )
}
