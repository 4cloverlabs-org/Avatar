"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    { q: "IS THIS ACTUALLY MY REAL VOICE?", a: "It's an AI-generated clone trained on your real voice. Once trained with a short sample, it can synthesize speech from text while maintaining your unique tone, pacing, and inflections." },
    { q: "WHAT HAPPENS TO MY VIDEO/AUDIO AFTER I UPLOAD IT?", a: "Your raw training data is heavily encrypted and stored securely. It is never used to train shared models. You retain full ownership and can delete your data permanently at any time from your dashboard." },
    { q: "CAN I STOP OR PAUSE AUTOMATIC POSTING ANYTIME?", a: "Yes. You have full control over the autopilot queue. You can pause generation, require manual approval for every post, or disconnect platforms with a single click." },
    { q: "DO I NEED EDITING EXPERIENCE?", a: "None at all. If you can type a script or select a topic, our engine handles the rest—including generating the video, syncing the audio, and even publishing." },
    { q: "IS THERE A LIMIT ON HOW MANY AVATARS I CAN CREATE?", a: "This depends on your plan. Starter includes 1 custom avatar, Creator includes 3, and Pro gives you up to 10 unique avatars for different brands or team members." },
    { q: "CAN SOMEONE TELL IT'S AI-GENERATED?", a: "Our engine achieves 98% lip-sync accuracy and captures micro-expressions natively. While experts might notice upon deep inspection, it passes as completely natural on mobile feeds like TikTok and Shorts." },
    { q: "CAN I USE MY OWN AUDIO?", a: "Yes! You can upload custom audio tracks, and our engine will perfectly lip-sync your avatar to the provided audio." },
    { q: "WHICH PLATFORMS ARE SUPPORTED?", a: "We support direct auto-publishing to YouTube, TikTok, Instagram, and LinkedIn. You can connect all of them and set platform-specific scheduling." },
    { q: "WHAT LANGUAGES ARE SUPPORTED?", a: "Currently, our voice synthesis supports over 29 languages, including English, Spanish, French, German, Japanese, and Mandarin, all preserving your original vocal timbre." },
    { q: "CAN I USE THIS FOR COMMERCIAL/CLIENT WORK?", a: "Yes. All paid plans include full commercial rights to the generated videos. Pro and Enterprise plans also include white-labeling features for agency use." },
    { q: "DO YOU OFFER REFUNDS IF I'M NOT SATISFIED?", a: "Yes. We offer a 14-day money-back guarantee. If the avatar quality doesn't meet your expectations within your first 14 days, you get a full refund, no questions asked." }
  ];

  return (
    <section id="faq" className="brutalist-section grid-container">
      <div className="col-12 panel-header" style={{ borderBottom: 'none', marginBottom: '0' }}>
        <span>06</span>
      </div>
      <div className="col-12 mb-4">
        <hr className="h-rule" style={{ marginBottom: '1rem' }} />
        <h2 className="editorial-h2">FAQ</h2>
      </div>
      
      <div className="col-12" style={{ display: 'flex', flexDirection: 'column' }}>
         {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
               <button 
                 onClick={() => setOpenIndex(openIndex === i ? null : i)}
                 style={{ 
                    width: '100%', 
                    padding: '2rem 0', 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--text-main)', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    fontFamily: 'var(--font-geist-sans)'
                 }}
               >
                  {faq.q}
                  <span className="mono-text">{openIndex === i ? '[-]' : '[+]'}</span>
               </button>
               <AnimatePresence>
                 {openIndex === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mono-text" style={{ paddingBottom: '2rem', color: 'var(--text-muted)', lineHeight: 1.6, textTransform: 'none', fontSize: '1rem' }}>
                         {faq.a}
                      </div>
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>
         ))}
      </div>
    </section>
  );
}
