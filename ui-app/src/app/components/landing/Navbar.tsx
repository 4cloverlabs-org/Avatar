"use client";

import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="brutalist-nav">
      <Link href="/" className="nav-logo">
        AnClone.
      </Link>

      <div className="nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="#how-it-works" className="nav-link">How It Works</Link>
        <Link href="#pricing" className="nav-link">Pricing</Link>
        <Link href="#faq" className="nav-link">FAQ</Link>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <span className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--success-color, #00ff00)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>


        </span>
        <Link href="/login" className="nav-link">Log In</Link>
        <Link href="/login" className="nav-cta">
          Start Free
        </Link>
      </div>
    </nav>
  );
}
