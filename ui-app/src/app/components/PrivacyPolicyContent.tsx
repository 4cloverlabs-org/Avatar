import React from 'react';

export default function PrivacyPolicyContent() {
  return (
    <>
      <h1 className="editorial-h2 mb-1" style={{ fontSize: '2.5rem' }}>Privacy Policy</h1>
      <p className="mono-text mb-4" style={{ color: 'var(--text-muted)' }}>Last updated: August 26, 2026</p>

      <section className="mb-4">
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
          This Privacy Policy explains how 4CloverLabs ("we," "us," or "our")
          collects, uses, stores, and protects information when you use
          AnClone (the "Service"), a platform that creates AI-generated
          avatars and voice clones and can publish content on your behalf to
          connected social media accounts.
          <br /><br />
          By using the Service, you agree to the collection and use of
          information as described in this policy.
        </p>

        <h2 className="mono-text mb-1" style={{ fontSize: '1.25rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginTop: '2rem' }}>1. Information We Collect</h2>
        
        <h3 className="mono-text mt-2 mb-1" style={{ fontSize: '1rem', color: 'var(--text-main)', marginTop: '1.5rem' }}>1.1 Account Information</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          When you sign up, we collect your name, email address, and
          authentication credentials (or OAuth identity if you sign in via a
          third-party provider).
        </p>

        <h3 className="mono-text mt-2 mb-1" style={{ fontSize: '1rem', color: 'var(--text-main)', marginTop: '1.5rem' }}>1.2 Avatar and Voice Data</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          To create your personalized AI avatar and voice clone, we collect
          and process:
        </p>
        <ul style={{ color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Video footage you upload (up to 2 minutes) of your likeness</li>
          <li>Audio recordings you upload of your voice</li>
          <li>The AI-generated avatar model and voice model derived from this footage</li>
        </ul>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          This is biometric and likeness data. We only use it to build and
          operate the avatar/voice features you explicitly request, and we do
          not use it for any other purpose without your separate consent.
        </p>

        <h3 className="mono-text mt-2 mb-1" style={{ fontSize: '1rem', color: 'var(--text-main)', marginTop: '1.5rem' }}>1.3 Content You Generate</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          We store the scripts, videos, and other content generated through
          the Service, including content created for scheduled publishing to
          your connected social accounts.
        </p>

        <h3 className="mono-text mt-2 mb-1" style={{ fontSize: '1rem', color: 'var(--text-main)', marginTop: '1.5rem' }}>1.4 Connected Social Media Accounts</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          If you connect a Meta (Facebook/Instagram) or YouTube account, we
          receive and store:
        </p>
        <ul style={{ color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Your basic public profile information from that platform</li>
          <li>An access token (and refresh token, where applicable) that
            authorizes us to publish content on your behalf</li>
          <li>Metadata about the content we publish (post IDs, timestamps,
            publish status) so we can show you the status of your scheduled posts</li>
        </ul>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          We request only the permissions/scopes necessary to publish content
          and read the minimum account information needed to operate the
          Service.
        </p>

        <h3 className="mono-text mt-2 mb-1" style={{ fontSize: '1rem', color: 'var(--text-main)', marginTop: '1.5rem' }}>1.5 Usage Data</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          We automatically collect log data such as IP address, browser type,
          device information, and how you interact with the Service, for
          security and product improvement purposes.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="mono-text mb-1" style={{ fontSize: '1.25rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>2. How We Use Your Information</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          We use the information we collect to:
        </p>
        <ul style={{ color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Create, train, and store your personal AI avatar and voice clone</li>
          <li>Generate scripts and render videos based on your selected niche and
            content plan</li>
          <li>Publish generated content to your connected social media accounts,
            at the times you schedule</li>
          <li>Authenticate you and maintain your account</li>
          <li>Provide customer support and respond to your requests</li>
          <li>Maintain the security and integrity of the Service</li>
          <li>Improve and develop the Service</li>
        </ul>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 'bold' }}>
          We do not sell your personal information, your likeness, or your
          voice data to third parties.
        </p>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 'bold' }}>
          We do not use your video, audio, avatar, or voice data to train
          general-purpose AI models beyond what is necessary to create the
          specific avatar/voice you requested, unless you separately and
          explicitly opt in to such use.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="mono-text mb-1" style={{ fontSize: '1.25rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>3. Data Storage and Retention</h2>
        <ul style={{ color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Account and content data is stored in our database, hosted on
            Railway.</li>
          <li>Raw uploaded video and audio, and generated video content, are
            stored using Cloudflare R2.</li>
          <li>Access tokens for connected social accounts are encrypted at rest
            and are never stored in plain text.</li>
          <li>Raw source video/audio used to train your avatar or voice may be
            deleted automatically after the corresponding model has been
            successfully created, typically within 7 days, unless you
            request otherwise.</li>
          <li>You may request deletion of your account and all associated data
            at any time (see Section 6).</li>
        </ul>
      </section>

      <section id="data-sharing" className="mb-4">
        <h2 className="mono-text mb-1" style={{ fontSize: '1.25rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>4. Third-Party Services</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          The Service integrates with the following third-party platforms.
          Your use of these integrations is also governed by their own
          privacy policies and terms:
        </p>
        <ul style={{ color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li><strong>Meta Platforms, Inc.</strong> (Facebook and Instagram) — used to
            publish content to your connected Instagram/Facebook account on
            your behalf, per your scheduling instructions.</li>
          <li><strong>Google / YouTube</strong> — used to publish video content to your
            connected YouTube channel on your behalf, per your scheduling
            instructions.</li>
          <li><strong>AI Providers</strong> — used for script generation, voice cloning, and rendering.</li>
          <li><strong>Cloud Hosting Providers</strong> — used for general infrastructure and application hosting.</li>
        </ul>

        <h3 className="mono-text mt-2 mb-1" style={{ fontSize: '1rem', color: 'var(--text-main)', marginTop: '1.5rem' }}>YouTube API Services Disclosure</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          This Service uses YouTube API Services. By connecting your YouTube
          account, you also agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>YouTube Terms of Service</a>. Google's Privacy Policy
          is available at <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>https://policies.google.com/privacy</a>.
        </p>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          We access YouTube data only to the extent necessary to publish
          content you have created and scheduled through the Service, and to
          display the status of that content back to you. We do not use data
          obtained through YouTube API Services to build user profiles for
          purposes unrelated to the Service's core functionality, in
          accordance with the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Google API Services User Data Policy</a>,
          including its Limited Use requirements.
        </p>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          You may revoke the Service's access to your YouTube account at any
          time via your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Google Security Settings</a>.
        </p>

        <h3 className="mono-text mt-2 mb-1" style={{ fontSize: '1rem', color: 'var(--text-main)', marginTop: '1.5rem' }}>Meta Platform Disclosure</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          We access Meta (Facebook/Instagram) data only to the extent
          necessary to publish content you have created and scheduled through
          the Service. Our use of information received from Meta APIs is
          governed by <a href="https://developers.facebook.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Meta's Platform Terms</a> and the <a href="https://developers.facebook.com/docs/app-review" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Meta Data Use Checkup</a> requirements.
        </p>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          You may revoke the Service's access to your Facebook or Instagram
          account at any time via your platform account's connected apps
          settings.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="mono-text mb-1" style={{ fontSize: '1.25rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>5. Data Security</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          We implement industry-standard technical and organizational measures
          to protect your information, including encryption of access tokens
          at rest, encrypted connections (HTTPS/TLS) for all data in transit,
          and access controls limiting who can view your data internally. No
          method of transmission or storage is 100% secure, and we cannot
          guarantee absolute security.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="mono-text mb-1" style={{ fontSize: '1.25rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>6. Your Rights and Choices</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Depending on your location, you may have the right to:
        </p>
        <ul style={{ color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your account, avatar/voice data, and
            associated content</li>
          <li>Withdraw consent for avatar/voice creation at any time</li>
          <li>Disconnect any connected social media account at any time</li>
          <li>Export a copy of your data</li>
        </ul>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          To exercise any of these rights, contact us at <a href="mailto:founder@4cloverlabs.com" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>founder@4cloverlabs.com</a>.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="mono-text mb-1" style={{ fontSize: '1.25rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>7. Children's Privacy</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          The Service is not directed to individuals under 18 years of age,
          and we do not knowingly collect personal information, video, or
          voice data from anyone under 18. If we become aware that we have
          collected such information, we will delete it promptly.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="mono-text mb-1" style={{ fontSize: '1.25rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>8. International Data Transfers</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          If you access the Service from outside your local jurisdiction, your
          information may be transferred to and processed in India
          or other countries where our service providers operate.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="mono-text mb-1" style={{ fontSize: '1.25rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>9. Changes to This Policy</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          We may update this Privacy Policy from time to time. We will notify
          you of material changes by posting the updated policy on this page
          and updating the "Last updated" date above.
        </p>
      </section>

      <section>
        <h2 className="mono-text mb-1" style={{ fontSize: '1.25rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>10. Contact Us</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          If you have questions about this Privacy Policy or how your data is
          handled, contact us at:
          <br /><br />
          <strong>4CloverLabs</strong><br />
          Email: <a href="mailto:founder@4cloverlabs.com" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>founder@4cloverlabs.com</a><br />
          Address: Hyderabad, India
        </p>
      </section>
    </>
  );
}
