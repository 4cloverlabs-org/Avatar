"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useInView, motion, AnimatePresence } from 'framer-motion';
import FunnelChart from './FunnelChart';
import ViewerRetentionChart from './ViewerRetentionChart';

const testimonials = [
  {
    id: 1,
    quote: "Managing social media for multiple brands used to require endless filming days. Now, we create consistent, high-quality talking-head videos on autopilot. It's transformed our agency.",
    name: "James Carter",
    title: "Agency Owner",
    avatar: "https://i.pravatar.cc/150?u=jamesc",
  },
  {
    id: 2,
    quote: "I was skeptical about AI video, but the lip sync and expressions are incredibly lifelike. It took 10 minutes to set up my digital twin and it's saved me 20 hours this month alone.",
    name: "Alex Rivera",
    title: "Content Creator",
    avatar: "https://i.pravatar.cc/150?u=alexr",
  },
  {
    id: 3,
    quote: "I used to spend days recording and editing course videos. With Avatar, I just type my script and get a studio-quality video in minutes. It's like having a full production team.",
    name: "Elena Rodriguez",
    title: "Course Creator",
    avatar: "https://i.pravatar.cc/150?u=elena",
  },
  {
    id: 4,
    quote: "The ability to generate personalized outreach videos for 500+ clients a day without speaking a single word has doubled our conversion rate.",
    name: "David Chen",
    title: "Head of Sales",
    avatar: "https://i.pravatar.cc/150?u=davidc",
  },
  {
    id: 5,
    quote: "We now broadcast daily updates in 12 different languages using the same avatar. The translation combined with perfectly synced lip movements is unparalleled.",
    name: "Aisha Patel",
    title: "Media Director",
    avatar: "https://i.pravatar.cc/150?u=aishap",
  },
  {
    id: 6,
    quote: "Being able to update my workout library by just editing text has given me so much time back. My followers can't even tell the difference.",
    name: "Marcus Johnson",
    title: "Fitness Coach",
    avatar: "https://i.pravatar.cc/150?u=marcusj",
  }
];

export default function FeaturesGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [cards, setCards] = useState(testimonials);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCards((prev) => {
        const newCards = [...prev];
        const front = newCards.shift();
        if (front) newCards.push(front);
        return newCards;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} id="features" className="editorial-section grid-container" style={{ padding: '6rem 0' }}>
      <div className="col-12">
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
        }}>
          
          {/* Row 1 */}
          <div className="features-split-row">
            <div className="features-split-left">
              <h3 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.75rem)', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0', fontFamily: 'var(--font-heading)' }}>
                Automated Audience Growth
              </h3>
              <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>
                Our AI engine works around the clock to optimize your content delivery, ensuring that your message reaches the right people at the exact right moment.
              </p>
            </div>
            <div className="features-split-right" style={{ minHeight: '400px', backgroundColor: '#FFFFFF' }}>
              <FunnelChart inView={inView} />
            </div>
          </div>

          {/* Row 2 */}
          <div className="features-split-row">
            <div className="features-split-left">
              <h3 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.75rem)', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0', fontFamily: 'var(--font-heading)' }}>
                Sustain Long-Term Engagement
              </h3>
              <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>
                Keep your audience captivated with continuous, high-quality interactions. Deliver personalized experiences that create loyal followers who keep coming back.
              </p>
            </div>
            <div className="features-split-right" style={{ minHeight: '400px', backgroundColor: '#FFFFFF' }}>
              <ViewerRetentionChart inView={inView} />
            </div>
          </div>

          {/* Row 3 */}
          <div className="features-split-row">
            <div className="features-split-left">
              <h3 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.75rem)', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0', fontFamily: 'var(--font-heading)' }}>
                Loved by creators.
              </h3>
              <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>
                See how professionals are using Avatar to scale their content without stepping into a studio.
              </p>
            </div>
            <div 
              className="features-split-right" 
              style={{ backgroundColor: 'transparent', overflow: 'hidden', height: '560px', position: 'relative' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', position: 'absolute', top: '1.5rem', left: 0, padding: '0 1.5rem', boxSizing: 'border-box' }}>
                <AnimatePresence mode="popLayout">
                  {cards.slice(0, 3).map((t) => (
                    <motion.div 
                      key={t.id} 
                      layout
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -50, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      style={{ 
                        display: 'flex', 
                        gap: '1.25rem', 
                        padding: '1.5rem', 
                        backgroundColor: '#FFFFFF', 
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        width: '100%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                        boxSizing: 'border-box'
                      }}>
                      <img src={t.avatar} alt={t.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0 0 0.5rem 0' }}>
                          <span style={{ fontWeight: 600, color: '#111827', fontSize: '1rem' }}>{t.name}</span>
                          <span style={{ color: '#6B7280', fontSize: '0.85rem' }}>{t.title}</span>
                        </div>
                        <p style={{ color: '#4B5563', margin: 0, lineHeight: 1.5, fontSize: '0.95rem' }}>
                          "{t.quote}"
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
