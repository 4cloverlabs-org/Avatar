"use client";

import React from 'react';

export default function SocialProof() {
  return (
    <section className="brutalist-section" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
        <span className="mono-text" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          [ 1,200+ CREATORS ]
        </span>
        <span className="mono-text" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          [ 45,000+ VIDEOS GENERATED ]
        </span>
        <span className="mono-text" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          [ 4.8/5 AVG RATING ]
        </span>
      </div>
    </section>
  );
}
