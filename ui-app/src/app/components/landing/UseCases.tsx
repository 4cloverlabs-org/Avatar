"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const niches = [
  { 
    id: 'fitness', 
    label: 'FITNESS', 
    description: 'Turn workouts, tips, and routines into scroll-stopping short-form content.' 
  },
  { 
    id: 'finance', 
    label: 'FINANCE', 
    description: 'Simplify complex money topics into content your audience understands and saves.' 
  },
  { 
    id: 'realestate', 
    label: 'REAL ESTATE', 
    description: 'Turn properties and market insights into content that attracts serious buyers.' 
  },
  { 
    id: 'saas', 
    label: 'SAAS', 
    description: 'Turn product updates and features into content that gets people interested.' 
  },
  { 
    id: 'ecommerce', 
    label: 'E-COMMERCE', 
    description: 'Create product content that makes people stop, discover, and buy.' 
  },
  { 
    id: 'coaching', 
    label: 'COACHING', 
    description: 'Turn your expertise into thought-provoking content that builds authority.' 
  }
];

// Motion Variants
const previewVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // refined spring-like easeOut
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.3,
      ease: [0.7, 0, 0.84, 0] as [number, number, number, number] // smooth easeIn
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

const cardStyle = {
  background: '#FFFFFF',
  borderRadius: '20px',
  padding: '3.5rem 3rem',
  boxShadow: '0 12px 48px -12px rgba(0,0,0,0.04)',
  display: 'flex',
  flexDirection: 'column' as const,
  height: '100%',
  minHeight: '420px',
  border: '1px solid rgba(0,0,0,0.02)'
};

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 500,
  color: '#A3A3A3',
  letterSpacing: '0.1em',
  marginBottom: '2.5rem'
};

const ReelPreview = () => (
  <div style={cardStyle}>
    <div style={labelStyle}>REEL SCRIPT</div>
    <motion.h3 variants={contentVariants} style={{ fontSize: '1.75rem', fontWeight: 400, color: '#111', lineHeight: 1.25, margin: '0 0 3.5rem 0', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
      "Still doing 100 crunches for abs?"
    </motion.h3>
    <motion.div variants={contentVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
      {[
        { step: '01', name: 'Mountain Climbers', time: '30s' },
        { step: '02', name: 'Leg Raises', time: '30s' },
        { step: '03', name: 'Bicycle Crunches', time: '30s' },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#111', fontSize: '1rem', fontWeight: 400 }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span style={{color: '#B3B3B3', fontSize: '0.9rem'}}>{item.step}</span>
            <span>{item.name}</span>
          </div>
          <span style={{color: '#B3B3B3', fontSize: '0.9rem'}}>{item.time}</span>
        </div>
      ))}
    </motion.div>
    <motion.div variants={contentVariants} style={{ marginTop: '3.5rem', fontSize: '0.95rem', color: '#111', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
      Save this workout <span style={{fontSize: '1.25rem', fontWeight: 300}}>→</span>
    </motion.div>
  </div>
);

const CarouselPreview = () => (
  <div style={cardStyle}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
      <div style={labelStyle}>CAROUSEL</div>
      <div style={{ fontSize: '0.75rem', color: '#A3A3A3', letterSpacing: '0.1em', marginBottom: '2.5rem' }}>01 / 05</div>
    </div>
    <motion.h3 variants={contentVariants} style={{ fontSize: '1.85rem', fontWeight: 400, color: '#111', lineHeight: 1.25, margin: '0 0 3.5rem 0', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
      5 Money Habits<br/>That Keep You Broke
    </motion.h3>
    <motion.div variants={contentVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', flex: 1 }}>
      {[
        { step: '01', name: 'Lifestyle inflation' },
        { step: '02', name: 'No emergency fund' },
        { step: '03', name: 'Ignoring compound interest' },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '2rem', color: '#111', fontSize: '1.05rem', alignItems: 'flex-start' }}>
          <span style={{color: '#B3B3B3', fontSize: '0.9rem', marginTop: '0.15rem'}}>{item.step}</span>
          <span style={{ fontWeight: 400, lineHeight: 1.4 }}>{item.name}</span>
        </div>
      ))}
    </motion.div>
    <motion.div variants={contentVariants} style={{ marginTop: '3.5rem', fontSize: '0.95rem', color: '#111', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
      Swipe <span style={{fontSize: '1.25rem', fontWeight: 300}}>→</span>
    </motion.div>
  </div>
);

const PropertyPreview = () => (
  <div style={cardStyle}>
    <div style={labelStyle}>PROPERTY POST</div>
    <motion.div variants={contentVariants} style={{ width: '100%', height: '140px', background: '#F7F7F5', borderRadius: '12px', marginBottom: '2.5rem' }} />
    <motion.h3 variants={contentVariants} style={{ fontSize: '1.5rem', fontWeight: 400, color: '#111', margin: '0 0 0.75rem 0', fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}>
      $1.2M MODERN VILLA
    </motion.h3>
    <motion.div variants={contentVariants} style={{ fontSize: '0.75rem', color: '#A3A3A3', letterSpacing: '0.1em', marginBottom: '2.5rem' }}>4 BED &nbsp;&nbsp; 3 BATH &nbsp;&nbsp; 2,850 SQ FT</motion.div>
    <motion.div variants={contentVariants} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
      {[
        'Open-plan living', 'Private pool & garden', 'Smart home integrated'
      ].map((item, i) => (
        <div key={i} style={{ color: '#666', fontSize: '0.95rem', fontWeight: 400 }}>
          {item}
        </div>
      ))}
    </motion.div>
    <motion.div variants={contentVariants} style={{ marginTop: '2.5rem', fontSize: '0.95rem', color: '#111', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
      View Property <span style={{fontSize: '1.25rem', fontWeight: 300}}>→</span>
    </motion.div>
  </div>
);

const ProductLaunchPreview = () => (
  <div style={cardStyle}>
    <div style={labelStyle}>PRODUCT UPDATE</div>
    <motion.h3 variants={contentVariants} style={{ fontSize: '1.85rem', fontWeight: 400, color: '#111', lineHeight: 1.25, margin: '0 0 1.25rem 0', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
      AI Automations
    </motion.h3>
    <motion.p variants={contentVariants} style={{ color: '#666', fontSize: '1.1rem', margin: '0 0 3.5rem 0', lineHeight: 1.6, fontWeight: 400 }}>
      Turn repetitive workflows into automated actions seamlessly.
    </motion.p>
    <motion.div variants={contentVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
      {[
        'Save 8+ hours per week', 'No-code visual setup', 'Native tool integrations'
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '1.5rem', color: '#111', fontSize: '1.05rem', fontWeight: 400 }}>
          <span style={{color: '#D4D4D4'}}>—</span>
          <span>{item}</span>
        </div>
      ))}
    </motion.div>
    <motion.div variants={contentVariants} style={{ marginTop: '3.5rem', fontSize: '0.95rem', color: '#111', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
      Read Announcement <span style={{fontSize: '1.25rem', fontWeight: 300}}>→</span>
    </motion.div>
  </div>
);

const ProductAdPreview = () => (
  <div style={cardStyle}>
    <div style={labelStyle}>PRODUCT CAMPAIGN</div>
    <motion.div variants={contentVariants} style={{ width: '100%', height: '140px', background: '#F7F7F5', borderRadius: '12px', marginBottom: '2.5rem' }} />
    <motion.h3 variants={contentVariants} style={{ fontSize: '1.6rem', fontWeight: 400, color: '#111', margin: '0 0 1rem 0', fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}>
      SUMMER ESSENTIALS
    </motion.h3>
    <motion.p variants={contentVariants} style={{ color: '#666', fontSize: '1.05rem', margin: '0 0 2.5rem 0', lineHeight: 1.6, flex: 1, fontWeight: 400 }}>
      Minimal. Lightweight.<br/>Made for everyday wear.
    </motion.p>
    <motion.div variants={contentVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem' }}>
      <div>
        <div style={{ fontSize: '1.5rem', color: '#111', fontWeight: 400, marginBottom: '0.35rem', fontFamily: 'var(--font-heading)' }}>$49</div>
        <div style={{ fontSize: '0.75rem', color: '#A3A3A3', letterSpacing: '0.08em' }}>20% OFF THIS WEEK</div>
      </div>
    </motion.div>
    <motion.div variants={contentVariants} style={{ marginTop: '2.5rem', fontSize: '0.95rem', color: '#111', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
      Shop Collection <span style={{fontSize: '1.25rem', fontWeight: 300}}>→</span>
    </motion.div>
  </div>
);

const ThoughtLeadershipPreview = () => (
  <div style={cardStyle}>
    <div style={labelStyle}>THOUGHT LEADERSHIP</div>
    <motion.h3 variants={contentVariants} style={{ fontSize: '1.75rem', fontWeight: 400, color: '#111', lineHeight: 1.3, margin: '0 0 1.5rem 0', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
      YOU DON'T NEED<br/>MORE MOTIVATION.
    </motion.h3>
    <motion.p variants={contentVariants} style={{ color: '#666', fontSize: '1.1rem', margin: '0 0 3.5rem 0', lineHeight: 1.6, fontWeight: 400 }}>
      You need a system you can follow on the days motivation disappears.
    </motion.p>
    <motion.div variants={contentVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
      {[
        { step: '01', name: 'Make it smaller' },
        { step: '02', name: 'Make it repeatable' },
        { step: '03', name: 'Track the process' },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '2rem', color: '#111', fontSize: '1.05rem', alignItems: 'center', fontWeight: 400 }}>
          <span style={{color: '#B3B3B3', fontSize: '0.9rem'}}>{item.step}</span>
          <span>{item.name}</span>
        </div>
      ))}
    </motion.div>
    <motion.div variants={contentVariants} style={{ marginTop: '3.5rem', fontSize: '0.95rem', color: '#111', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
      3 ways to build one <span style={{fontSize: '1.25rem', fontWeight: 300}}>→</span>
    </motion.div>
  </div>
);

const PreviewComponents: Record<string, React.FC> = {
  fitness: ReelPreview,
  finance: CarouselPreview,
  realestate: PropertyPreview,
  saas: ProductLaunchPreview,
  ecommerce: ProductAdPreview,
  coaching: ThoughtLeadershipPreview
};

interface NicheData {
  id: string;
  label: string;
  description: string;
}

const NicheButton = ({ niche, isActive, onClick }: { niche: NicheData, isActive: boolean, onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '1.1rem 1.5rem',
        border: 'none',
        background: isActive ? 'rgba(0,0,0,0.02)' : isHovered ? 'rgba(0,0,0,0.01)' : 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: '0.95rem',
        fontFamily: 'var(--font-body)',
        fontWeight: isActive ? 500 : 400,
        color: isActive ? '#111' : isHovered ? '#111' : '#888',
        transition: 'all 0.3s ease',
        borderRadius: '12px',
        width: '100%'
      }}
    >
      <div 
        style={{ 
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: isActive ? '#111' : '#A3A3A3',
          opacity: isActive ? 1 : isHovered ? 0.6 : 0,
          transform: isActive ? 'scale(1)' : isHovered ? 'scale(0.9)' : 'scale(0.8)',
          transition: 'all 0.3s ease'
        }} 
      />
      {niche.label}
    </button>
  );
};

export default function UseCases() {
  const [activeNiche, setActiveNiche] = useState(niches[0].id);

  // Auto-rotate through niches, but setting state directly resets the timer automatically because of the dependency array.
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNiche(current => {
        const currentIndex = niches.findIndex(n => n.id === current);
        const nextIndex = (currentIndex + 1) % niches.length;
        return niches[nextIndex].id;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [activeNiche]);

  const currentNiche = niches.find(n => n.id === activeNiche) || niches[0];
  const ActivePreview = PreviewComponents[activeNiche] || ReelPreview;

  return (
    <section className="grid-container" style={{ padding: '8rem 0 10rem', fontFamily: 'var(--font-body)' }}>
      {/* Top Section */}
      <div className="col-12" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '5rem', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 50%', minWidth: '300px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.25rem', fontWeight: 500, lineHeight: '1.1', color: '#111', margin: 0, letterSpacing: '-0.02em' }}>
            Built For Every Niche
          </h2>
        </div>
        <div style={{ flex: '1 1 40%', minWidth: '300px', paddingTop: '0.75rem' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.15rem', lineHeight: '1.6', color: '#666', margin: 0, fontWeight: 400 }}>
            Our platform adapts to your industry. Automatically generate high-performing content tailored specifically for your target audience.
          </p>
        </div>
      </div>

      <div className="col-12" style={{ display: 'flex', flexWrap: 'wrap', gap: '6rem', alignItems: 'center' }}>
        
        {/* Left: Menu Navigation */}
        <div style={{ flex: '0 0 260px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {niches.map((niche) => (
            <NicheButton 
              key={niche.id} 
              niche={niche} 
              isActive={activeNiche === niche.id} 
              onClick={() => setActiveNiche(niche.id)} 
            />
          ))}
        </div>

        {/* Right: Preview Container */}
        <div style={{ flex: '1 1 0%', minWidth: '320px' }}>
          <div style={{ 
            background: '#F7F7F5', 
            border: '1px solid rgba(0,0,0,0.03)',
            borderRadius: '24px', 
            padding: '4rem', 
            minHeight: '520px', 
            display: 'flex', 
            flexDirection: 'column', 
            position: 'relative', 
            overflow: 'hidden'
          }}>
             
             {/* Top Right Arrow Button */}
             <div style={{ 
               position: 'absolute', 
               top: '1.5rem', 
               right: '1.5rem', 
               width: '40px', 
               height: '40px', 
               borderRadius: '50%', 
               background: '#FFFFFF', 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center', 
               cursor: 'pointer', 
               border: '1px solid rgba(0,0,0,0.04)',
               boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
             }}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
             </div>

             <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
               <AnimatePresence mode="wait">
                 <motion.div
                   key={activeNiche}
                   variants={previewVariants}
                   initial="hidden"
                   animate="show"
                   exit="exit"
                   style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column' }}
                 >
                   
                   <ActivePreview />

                   <motion.div variants={contentVariants} style={{ marginTop: '3rem', textAlign: 'center' }}>
                     <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 500, color: '#111', margin: '0 0 0.5rem 0' }}>
                       {currentNiche.label}
                     </h4>
                     <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: '#666', margin: 0, lineHeight: 1.6 }}>
                       {currentNiche.description}
                     </p>
                   </motion.div>
                   
                 </motion.div>
               </AnimatePresence>
             </div>
             
          </div>
        </div>

      </div>
    </section>
  );
}

