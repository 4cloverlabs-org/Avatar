"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: '1.5rem',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 50,
        pointerEvents: 'none'
      }}
    >
      <nav 
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '100px',
          padding: '0.5rem 0.5rem 0.5rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '2.5rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
          pointerEvents: 'auto'
        }}
      >
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
          AnClone
        </Link>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="#how-it-works" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>How It Works</Link>
          <Link href="#pricing" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Pricing</Link>
          <Link href="#faq" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>FAQ</Link>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link href="/login" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500, padding: '0.5rem 1rem', borderRadius: '100px', transition: 'background-color 0.2s' }} className="hover-bg-subtle">Log In</Link>
          <Link href="/login" style={{ textDecoration: 'none', background: 'var(--text-main)', color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 500, padding: '0.5rem 1.25rem', borderRadius: '100px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            Start Free
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
