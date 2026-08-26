"use client";

import React from 'react';
import Link from 'next/link';

export default function Footer() {
   return (
      <footer className="grid-container" style={{ padding: '4rem 2rem 2rem' }}>
         <div className="col-4">
            <Link href="/" className="nav-logo" style={{ marginBottom: '1rem', display: 'block' }}>
               AnClone.
            </Link>
            <p className="mono-text" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>SYSTEM v1.0.0</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
               <a href="#" className="mono-text" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>[X]</a>
               <a href="#" className="mono-text" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>[YT]</a>
               <a href="#" className="mono-text" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>[IG]</a>
            </div>
         </div>

         <div className="col-2">
            <h4 className="mono-text mb-2">PRODUCT</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>AVATARS</Link>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>VOICE</Link>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>AUTOMATION</Link>
            </div>
         </div>

         <div className="col-2">
            <h4 className="mono-text mb-2">COMPANY</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>ABOUT</Link>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>CAREERS</Link>
            </div>
         </div>

         <div className="col-2">
            <h4 className="mono-text mb-2">RESOURCES</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>HELP CENTER</Link>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>DOCS</Link>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>CONTACT</Link>
            </div>
         </div>

         <div className="col-2">
            <h4 className="mono-text mb-2">LEGAL</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <Link href="/privacy" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>PRIVACY</Link>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>TERMS</Link>
            </div>
         </div>

         <div className="col-12 mt-4" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <span className="mono-text" style={{ color: 'var(--text-muted)' }}>© 2026 ANCLONE.</span>
         </div>
      </footer>
   );
}
