import type { Metadata } from 'next'
import { Container } from '@/components/ui/container'

export const metadata: Metadata = {
  title: 'Terms of Service | DTC Live',
  description: 'Terms of Service for DTC Live.',
}

export default function TermsPage() {
  return (
    <Container size="narrow" className="py-16">
      <h1 className="font-heading text-4xl font-bold text-text-headline">Terms of Service</h1>
      <p className="mt-2 text-sm text-text-caption">Last updated: March 13, 2026</p>

      <div className="prose mt-10 max-w-none text-text-body prose-headings:font-heading prose-headings:text-text-headline prose-h2:mt-10 prose-h2:text-xl prose-p:leading-relaxed prose-a:text-primary">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using DTC Live (&quot;dtc.live&quot;, &quot;the Site&quot;), operated by DTC Live Media (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Site.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          DTC Live is a media publication providing news, analysis, strategies, and insights for the direct-to-consumer (DTC) industry. Our services include editorial content, newsletters, and related media distributed through the Site and email.
        </p>

        <h2>3. User Accounts and Newsletter</h2>
        <p>
          When you subscribe to our newsletter, you provide your email address and consent to receive periodic communications from DTC Live. You may unsubscribe at any time using the link provided in each email. We will not sell, rent, or share your email address with third parties for their marketing purposes.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          All content on DTC Live, including articles, graphics, logos, images, and design elements, is the property of DTC Live Media and is protected by applicable copyright and trademark laws. You may not reproduce, distribute, modify, or republish any content without prior written consent.
        </p>
        <p>
          You may share links to articles and quote brief excerpts for commentary, criticism, or news reporting purposes, provided proper attribution to DTC Live is given.
        </p>

        <h2>5. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use automated systems (bots, scrapers) to access or collect content from the Site without express permission.</li>
          <li>Attempt to gain unauthorized access to any part of the Site or its systems.</li>
          <li>Use the Site for any unlawful purpose or in violation of any applicable laws.</li>
          <li>Interfere with or disrupt the Site or servers connected to it.</li>
        </ul>

        <h2>6. Disclaimer of Warranties</h2>
        <p>
          The content on DTC Live is provided for informational and educational purposes only. It does not constitute professional business, financial, legal, or investment advice. We make no warranties, express or implied, regarding the accuracy, completeness, or reliability of any content.
        </p>
        <p>
          The Site is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. We do not guarantee that the Site will be uninterrupted, error-free, or free of harmful components.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, DTC Live Media shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Site, including but not limited to loss of profits, data, or business opportunities.
        </p>

        <h2>8. Third-Party Links</h2>
        <p>
          The Site may contain links to third-party websites or services. We do not endorse, control, or assume responsibility for the content, privacy policies, or practices of third-party sites. Accessing third-party links is at your own risk.
        </p>

        <h2>9. Modifications</h2>
        <p>
          We reserve the right to modify these Terms of Service at any time. Changes will be effective when posted on this page with an updated &quot;Last updated&quot; date. Your continued use of the Site after changes constitutes acceptance of the revised terms.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions.
        </p>

        <h2>11. Contact</h2>
        <p>
          If you have questions about these Terms, contact us at{' '}
          <a href="mailto:contact@dtc.live">contact@dtc.live</a>.
        </p>
      </div>
    </Container>
  )
}
