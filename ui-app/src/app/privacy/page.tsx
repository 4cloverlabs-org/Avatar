"use client";

import React from 'react';
import Link from 'next/link';
import Footer from '../components/landing/Footer';
import PrivacyPolicyContent from '../components/PrivacyPolicyContent';
import '../landing.css';

export default function PrivacyPage() {
  return (
    <div className="landing-container">
      <nav className="brutalist-nav">
        <Link href="/" className="nav-logo">
          AnClone.
        </Link>
        <Link href="/" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </Link>
      </nav>

      <main className="grid-container" style={{ padding: '4rem 2rem', flex: 1 }}>
        <div className="col-12 panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
          
          <PrivacyPolicyContent />
        </div>
      </main>

      <Footer />
    </div>
  );
}
