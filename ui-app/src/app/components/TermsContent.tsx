import React from 'react';

export default function TermsContent() {
  return (
    <div style={{ lineHeight: '1.6', color: '#1a1a1a' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>Terms of Service</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Last updated: {new Date().toLocaleDateString()}</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>1. Agreement to Terms</h2>
        <p>
          By accessing and using AnClone ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>2. Use License</h2>
        <p>
          Permission is granted to temporarily access the materials (information or software) on AnClone for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginTop: '1rem' }}>
          <li>modify or copy the materials;</li>
          <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
          <li>attempt to decompile or reverse engineer any software contained on AnClone;</li>
          <li>remove any copyright or other proprietary notations from the materials; or</li>
          <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>3. Disclaimer</h2>
        <p>
          The materials on AnClone are provided on an 'as is' basis. AnClone makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>4. Limitations</h2>
        <p>
          In no event shall AnClone or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Service, even if AnClone or an authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>5. User Generated Content</h2>
        <p>
          You retain all of your ownership rights in your content. However, by submitting content to AnClone, you hereby grant AnClone a worldwide, non-exclusive, royalty-free, sublicenseable and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the content in connection with the Service.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>6. Contact Us</h2>
        <p>
          If you have questions about these Terms of Service or how your data is handled, contact us at:
        </p>
        <div style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
          <strong>4CloverLabs</strong><br/>
          Email: <a href="mailto:founder@4cloverlabs.com" style={{ color: '#0066cc', textDecoration: 'underline' }}>founder@4cloverlabs.com</a><br/>
          Address: Hyderabad, India
        </div>
      </section>
    </div>
  );
}
