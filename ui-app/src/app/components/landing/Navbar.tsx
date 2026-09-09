"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#ai-engine', label: 'AI Engine' },
  { href: '/#autopilot', label: 'Autopilot' },
  { href: '/#features', label: 'Features' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>{`
        .navbar-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .navbar-toggle {
          display: none;
        }
        @media (max-width: 1024px) {
          .navbar-links {
            display: none;
          }
          .navbar-toggle {
            display: flex;
          }
        }
      `}</style>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: '1.5rem',
          left: '0',
          right: '0',
          width: '100%',
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
            borderRadius: isOpen ? '24px' : '100px',
            padding: '0.5rem 0.5rem 0.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            width: '90%',
            maxWidth: '1200px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            pointerEvents: 'auto',
            transition: 'border-radius 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', color: 'var(--text-main)', fontSize: '1.4rem', fontWeight: 600, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, fill: 'var(--text-main)', stroke: 'none' }}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" fill="none" />
              </svg>
              AnClone
            </Link>

            <div className="navbar-links">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 400, transition: 'color 0.2s' }}>{link.label}</Link>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link href="/login" className="navbar-links" style={{ textDecoration: 'none', background: '#111827', color: '#ffffff', fontSize: '0.9rem', fontWeight: 500, padding: '0.5rem 1.25rem', borderRadius: '100px', border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'opacity 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'} onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>
                Login
              </Link>
              <button
                className="navbar-toggle"
                onClick={() => setIsOpen((v) => !v)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1px solid rgba(0,0,0,0.08)',
                  background: '#FFFFFF',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={{ overflow: 'hidden', width: '100%' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '1rem 0.5rem 0.5rem' }}>
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      style={{
                        textDecoration: 'none',
                        color: 'var(--text-main)',
                        fontSize: '1rem',
                        fontWeight: 500,
                        padding: '0.85rem 1rem',
                        borderRadius: '12px',
                        transition: 'background 0.2s'
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    style={{
                      textDecoration: 'none',
                      background: '#111827',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: 500,
                      padding: '0.85rem 1rem',
                      borderRadius: '100px',
                      textAlign: 'center',
                      marginTop: '0.5rem'
                    }}
                  >
                    Login
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>
    </>
  );
}
