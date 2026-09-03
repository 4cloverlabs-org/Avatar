"use client";

import React from 'react';
import Link from 'next/link';
import { Twitter, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
   return (
      <footer className="footer" style={{ width: '100%' }}>
         <div className="grid-container" style={{ padding: '6rem 2rem 2rem' }}>
            <div className="col-4">
            <Link href="/" className="nav-logo" style={{ marginBottom: '1rem', display: 'block', fontSize: '1.5rem', fontWeight: 700 }}>
               AnClone
            </Link>
            <p className="mono-text" style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>The premier AI video generation platform for modern creators.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
               <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                 <Twitter size={20} />
               </a>
               <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                 <Youtube size={20} />
               </a>
               <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                 <Instagram size={20} />
               </a>
            </div>
         </div>

         <div className="col-2">
            <h4 style={{ fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>Product</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)', transition: 'color 0.2s' }}>Avatars</Link>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)', transition: 'color 0.2s' }}>Voice</Link>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)', transition: 'color 0.2s' }}>Automation</Link>
            </div>
         </div>

         <div className="col-2">
            <h4 style={{ fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)', transition: 'color 0.2s' }}>About</Link>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)', transition: 'color 0.2s' }}>Careers</Link>
            </div>
         </div>

         <div className="col-2">
            <h4 style={{ fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)', transition: 'color 0.2s' }}>Help Center</Link>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)', transition: 'color 0.2s' }}>Docs</Link>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)', transition: 'color 0.2s' }}>Contact</Link>
            </div>
         </div>

         <div className="col-2">
            <h4 style={{ fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <Link href="/privacy" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)', transition: 'color 0.2s' }}>Privacy</Link>
               <Link href="#" className="mono-text" style={{ textDecoration: 'none', color: 'var(--text-muted)', transition: 'color 0.2s' }}>Terms</Link>
            </div>
         </div>

         <div className="col-12 mt-4" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem', marginTop: '4rem', display: 'flex', justifyContent: 'space-between' }}>
            <span className="mono-text" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>© 2026 AnClone. All rights reserved.</span>
         </div>
         </div>
      </footer>
   );
}
