"use client";

import React from 'react';

export default function SocialProof() {
  return (
    <section className="editorial-section" style={{ padding: '4rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>
        <span className="mono-text" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
          1,200+ Creators
        </span>
        <span className="mono-text" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
          45,000+ Videos Generated
        </span>
        <span className="mono-text" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
          4.8/5 Avg Rating
        </span>
      </div>
    </section>
  );
}
