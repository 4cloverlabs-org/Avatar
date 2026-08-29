"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const lines = [
  "analyzing facial landmarks...",
  "extracting vocal tone...",
  "mapping micro-expressions...",
  "rendering digital twin...",
  "sync complete — 100%"
];

export default function TerminalLog() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (isFading) return;

    if (currentLineIndex >= lines.length) {
      setIsTyping(false);
      const restartTimeout = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          setCurrentLineIndex(0);
          setDisplayedText('');
          setIsFading(false);
          setIsTyping(true);
        }, 500); 
      }, 2000);
      return () => clearTimeout(restartTimeout);
    }

    const currentFullText = lines[currentLineIndex];

    if (displayedText.length < currentFullText.length) {
      setIsTyping(true);
      const typingTimeout = setTimeout(() => {
        setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
      }, 30);
      return () => clearTimeout(typingTimeout);
    } else {
      setIsTyping(false);
      const linePauseTimeout = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setDisplayedText('');
        setIsTyping(true);
      }, 400);
      return () => clearTimeout(linePauseTimeout);
    }
  }, [currentLineIndex, displayedText, isFading]);

  return (
    <div 
      style={{ 
        flex: 1,
        backgroundColor: '#FFFFFF', 
        color: 'var(--text-main)', 
        fontFamily: 'monospace',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        borderRight: '1px solid var(--border-subtle)',
        fontSize: '0.85rem',
        textTransform: 'lowercase',
        borderTopLeftRadius: 'var(--radius-lg)',
        borderBottomLeftRadius: 'var(--radius-lg)'
      }}
    >
      <AnimatePresence>
        {!isFading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {lines.slice(0, currentLineIndex).map((line, idx) => {
              const isLastLine = idx === lines.length - 1;
              return (
                <div key={idx} style={{ color: isLastLine ? '#000000' : 'var(--text-muted)' }}>
                  {'> '}{line}
                </div>
              );
            })}
            
            {currentLineIndex < lines.length && (
              <div style={{ color: currentLineIndex === lines.length - 1 ? '#000000' : 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                {'> '}{displayedText}
                <motion.span 
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  style={{ display: 'inline-block', marginLeft: '4px' }}
                >
                  ▮
                </motion.span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
