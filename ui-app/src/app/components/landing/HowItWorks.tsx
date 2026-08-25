"use client";

import React from 'react';
import { motion } from 'framer-motion';
import TerminalLog from './TerminalLog';
import AudioWaveform from './AudioWaveform';

export default function HowItWorks() {
  return (
    <section className="brutalist-section grid-container">
      <div className="col-12 panel-header" style={{ borderBottom: 'none', marginBottom: '0' }}>
        <span>01</span>
      </div>
      <div className="col-12 mb-4">
        <hr className="h-rule" style={{ marginBottom: '1rem' }} />
        <h2 className="editorial-h2">DIGITAL IDENTITY</h2>
      </div>

      <div className="col-4">
        <p className="mono-text mb-4" style={{ color: 'var(--text-muted)' }}>
          We map your exact facial movements, micro-expressions, and vocal tone to create a 1:1 digital twin.
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: 'monospace', textTransform: 'uppercase' }}>
          <li style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
            ✓ Face Mapping <br />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'none' }}>468-point facial landmark tracking</span>
          </li>
          <li style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
            ✓ Voice Cloning <br />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'none' }}>Natural tone from 60 seconds of audio</span>
          </li>
          <li style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
            ✓ Expression Sync <br />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'none' }}>Micro-expressions matched frame by frame</span>
          </li>
          <li style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
            ✓ Motion Capture <br />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'none' }}>Head tilts, blinks, and gestures preserved</span>
          </li>
        </ul>

        <p className="mono-text mt-4" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '0.75rem' }}>
          [ PRIVACY: Your source video is encrypted and never used to train shared models. ]
        </p>
      </div>

      <div className="col-8">
        <div className="dashboard-placeholder" style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <div className="dashboard-bar">
            <span>AI AVATAR GENERATION</span>
            <span style={{ color: 'var(--text-muted)' }}>PROCESSING</span>
          </div>
          <div className="dashboard-content" style={{ padding: 0, display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'stretch' }}>
            {/* Top Half: Video */}
            <div style={{ flex: 1, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', minHeight: '250px', width: '100%' }}>
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src="/videos/avatar_split.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Bottom Half: Terminal & Waveform */}
            <div style={{ display: 'flex', flexDirection: 'row', minHeight: '200px', width: '100%' }}>
              <TerminalLog />
              <AudioWaveform />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
