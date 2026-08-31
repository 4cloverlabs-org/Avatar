"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    { q: "Is this actually my real voice?", a: "It's an AI-generated clone trained on your real voice. Once trained with a short sample, it can synthesize speech from text while maintaining your unique tone, pacing, and inflections." },
    { q: "What happens to my video/audio after I upload it?", a: "Your raw training data is heavily encrypted and stored securely. It is never used to train shared models. You retain full ownership and can delete your data permanently at any time from your dashboard." },
    { q: "Can I stop or pause automatic posting anytime?", a: "Yes. You have full control over the autopilot queue. You can pause generation, require manual approval for every post, or disconnect platforms with a single click." },
    { q: "Do I need editing experience?", a: "None at all. If you can type a script or select a topic, our engine handles the rest—including generating the video, syncing the audio, and even publishing." },
    { q: "Is there a limit on how many avatars I can create?", a: "This depends on your plan. Starter includes 1 custom avatar, Creator includes 3, and Pro gives you up to 10 unique avatars for different brands or team members." },
    { q: "Can someone tell it's AI-generated?", a: "Our engine achieves 98% lip-sync accuracy and captures micro-expressions natively. While experts might notice upon deep inspection, it passes as completely natural on mobile feeds like TikTok and Shorts." }
  ];

  return (
    <section id="faq" className="editorial-section" style={{ background: '#111111', color: '#ffffff' }}>
      <div className="grid-container">
        <div className="col-5 mb-4" style={{ paddingRight: '2rem' }}>
          <h2 className="editorial-h2" style={{ color: '#ffffff', textAlign: 'left', lineHeight: '1.1' }}>
            Frequently asked<br/>questions
          </h2>
        </div>
        
        <div className="col-7" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
           {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid #2a2a2a' }}>
                 <button 
                   onClick={() => setOpenIndex(openIndex === i ? null : i)}
                   style={{ 
                      width: '100%', 
                      padding: '1.5rem 0', 
                      background: 'transparent', 
                      border: 'none', 
                      color: '#ffffff', 
                      display: 'flex', 
                      justifyContent: 'flex-start', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      fontSize: '1.15rem',
                      fontWeight: 500,
                      textAlign: 'left',
                      fontFamily: 'var(--font-heading)'
                   }}
                 >
                    <span style={{ 
                      fontSize: '1.5rem', 
                      color: '#ffffff', 
                      marginRight: '1rem',
                      width: '24px',
                      display: 'inline-block',
                      textAlign: 'center'
                    }}>
                      {openIndex === i ? '−' : '+'}
                    </span>
                    {faq.q}
                 </button>
                 <AnimatePresence>
                   {openIndex === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="mono-text" style={{ 
                          paddingBottom: '1.5rem', 
                          paddingLeft: '2.5rem', // Aligned with the text, accounting for icon width + margin
                          color: '#a1a1aa', 
                          lineHeight: 1.6, 
                          textTransform: 'none', 
                          fontSize: '1rem', 
                          fontFamily: 'var(--font-body)' 
                        }}>
                           {faq.a}
                        </div>
                      </motion.div>
                   )}
                 </AnimatePresence>
              </div>
           ))}
        </div>
      </div>
    </section>
  );
}
