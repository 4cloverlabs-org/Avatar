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
          background: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '100px',
          padding: '0.5rem 0.5rem 0.5rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '90%',
          maxWidth: '1200px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          pointerEvents: 'auto'
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 600, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, fill: 'var(--text-main)', stroke: 'none' }}>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" fill="none" />
          </svg>
          AnClone
        </Link>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="#features" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 400, transition: 'color 0.2s' }}>Features</Link>
          <Link href="#solutions" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 400, transition: 'color 0.2s' }}>Solutions</Link>
          <Link href="#use-cases" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 400, transition: 'color 0.2s' }}>Use cases</Link>
          <Link href="#pricing" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 400, transition: 'color 0.2s' }}>Pricing</Link>
          <Link href="#resources" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 400, transition: 'color 0.2s' }}>Resources</Link>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link href="/login" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500, padding: '0.5rem 1rem', borderRadius: '100px', transition: 'background-color 0.2s' }} className="hover-bg-subtle">
            Log in
          </Link>
          <Link href="/signup" style={{ textDecoration: 'none', background: 'transparent', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500, padding: '0.5rem 1.25rem', borderRadius: '100px', border: '1px solid rgba(0, 0, 0, 0.15)', transition: 'background-color 0.2s' }}>
            Sign up
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
