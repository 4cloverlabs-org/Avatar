"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    company: "CourseCraft",
    platform: "youtube",
    companyIcon: null,
    quote: "I used to spend days recording and editing course videos. With Avatar, I just type my script and get a studio-quality video in minutes. It's like having a full production team.",
    name: "Elena Rodriguez",
    title: "Course Creator",
    avatar: "https://i.pravatar.cc/150?u=elena",
  },
  {
    id: 2,
    company: "GrowthX",
    platform: "instagram",
    companyIcon: null,
    quote: "Our marketing team can now iterate on video ads as quickly as we do on copy. We simply input the campaign messaging, and Avatar generates variants instantly. It's magic.",
    name: "Michael Chang",
    title: "Growth Lead",
    avatar: "https://i.pravatar.cc/150?u=michael",
  },
  {
    id: 3,
    company: "SocialScale",
    platform: "tiktok",
    companyIcon: null,
    quote: "Managing social media for multiple brands used to require endless filming days. Now, we create consistent, high-quality talking-head videos on autopilot. It's transformed our agency.",
    name: "Sarah Jenkins",
    title: "Agency Owner",
    avatar: "https://i.pravatar.cc/150?u=sarahj",
  },
  {
    id: 4,
    company: "TechReview",
    platform: "youtube",
    quote: "I was skeptical about AI video, but the lip sync and expressions are incredibly lifelike. It took 10 minutes to set up my digital twin and it's saved me 20 hours this month alone.",
    name: "Alex Rivera",
    title: "Content Creator",
    avatar: "https://i.pravatar.cc/150?u=alexr",
  }
];

const socialIcons: Record<string, React.ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
    </svg>
  )
};

export default function Testimonials() {
  const [cards, setCards] = useState(testimonials);
  const [isHovered, setIsHovered] = useState(false);
  
  const shuffleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const shuffle = () => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const frontCard = newCards.shift();
      if (frontCard) newCards.push(frontCard);
      return newCards;
    });
  };

  useEffect(() => {
    if (!isHovered) {
      shuffleTimerRef.current = setInterval(() => {
        shuffle();
      }, 4000);
    }
    
    return () => {
      if (shuffleTimerRef.current) {
        clearInterval(shuffleTimerRef.current);
      }
    };
  }, [isHovered]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y > threshold || info.offset.y < -threshold || info.offset.x > threshold || info.offset.x < -threshold) {
      shuffle();
    }
  };

  return (
    <section 
      style={{ 
        padding: '6rem 1rem', 
        backgroundColor: '#f3f4f6', 
        position: 'relative', 
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center',
        fontFamily: '"Bricolage Grotesque", sans-serif'
      }}
    >
      <div style={{ 
        maxWidth: '80rem', 
        margin: '0 auto', 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4rem',
        flexWrap: 'wrap-reverse'
      }}>
        
        {/* Left side: Testimonials Container */}
        <div style={{ position: 'relative', flex: '1.5', minWidth: '350px', maxWidth: '750px' }}>
          {/* Lanyard Strap Background Layer (static) */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%) rotate(-10deg)',
            width: '50px',
            height: '140px',
            background: 'linear-gradient(180deg, rgba(220,220,220,0.2) 0%, rgba(200,200,200,0.8) 100%)',
            borderRadius: '4px',
            zIndex: 0,
            boxShadow: '2px 4px 10px rgba(0,0,0,0.05)'
          }} />

        <div style={{ 
          position: 'relative', 
          height: '600px', 
          width: '100%', 
          maxWidth: '750px', 
          margin: '40px auto 0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          perspective: '1000px',
          zIndex: 10
        }}>
          {cards.map((testimonial, index) => {
            const isFront = index === 0;
            
            // Framer component logic
            const scaleStep = 0.06;
            const dimStep = 0.15;
            
            const scale = 1 - index * scaleStep;
            const brightness = Math.max(0.1, 1 - index * dimStep);
            const baseZ = cards.length - index;
            const yOffset = index * -25; // Negative offset to shift back cards up
            
            const spring = { type: "spring" as const, stiffness: 170, damping: 26 };

            return (
              <motion.div
                key={testimonial.id}
                style={{
                  position: 'absolute',
                  top: '100px', // Shifted down a bit so the top-stacked cards don't clip the lanyard too much
                  width: '100%',
                  maxWidth: '680px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: index === 0 
                    ? '0 20px 40px -10px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.1)' 
                    : '0 4px 10px rgba(0,0,0,0.05), 0 0 1px rgba(0,0,0,0.1)',
                  padding: '44px 56px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '440px',
                  cursor: isFront ? 'grab' : 'auto',
                  boxSizing: 'border-box'
                }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                drag={isFront ? "y" : false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                whileDrag={isFront ? {
                  zIndex: cards.length,
                  cursor: "grabbing",
                  scale: 1 - index * scaleStep + 0.05,
                  rotate: 2
                } : {}}
                animate={{
                  y: yOffset,
                  scale: scale,
                  filter: `brightness(${brightness})`,
                  zIndex: baseZ,
                }}
                transition={spring}
              >
                {/* Lanyard Hole */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '44px',
                  height: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#d1d5db',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                }} />
                
                {/* Lanyard Strap Front (only visible on front card to look like it loops through) */}
                {isFront && (
                  <div style={{
                    position: 'absolute',
                    top: '-60px',
                    left: '50%',
                    transform: 'translateX(-50%) rotate(-10deg)',
                    width: '50px',
                    height: '80px',
                    background: 'linear-gradient(180deg, rgba(240,240,240,0.9) 0%, rgba(220,220,220,0.95) 100%)',
                    borderRadius: '4px',
                    zIndex: 20,
                    boxShadow: 'inset 0 0 2px rgba(255,255,255,0.5), 0 4px 6px -2px rgba(0,0,0,0.1)',
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 90%)'
                  }} />
                )}
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '24px', borderBottom: '1px solid #e5e7eb', position: 'relative', zIndex: 10 }}>
                  
                  {/* User Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      style={{ 
                        width: '72px', 
                        height: '72px', 
                        borderRadius: '50%', 
                        backgroundColor: '#F3F4F6', 
                        objectFit: 'cover'
                      }} 
                    />
                    <div>
                      <h4 style={{ fontWeight: '600', color: '#111827', margin: 0, fontSize: '1.4rem' }}>
                        {testimonial.name}
                      </h4>
                      <p style={{ fontSize: '1.1rem', color: '#6b7280', margin: 0 }}>
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                  
                  {/* Social Platform Icon */}
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div 
                      style={{ 
                        padding: '12px', 
                        backgroundColor: 'transparent',
                        color: '#111827',
                        display: 'flex',
                        flexShrink: 0
                      }}
                      aria-label={`${testimonial.platform} Icon`}
                    >
                      {testimonial.platform && socialIcons[testimonial.platform] ? socialIcons[testimonial.platform] : socialIcons.instagram}
                    </div>
                  </div>
                </div>

                {/* Quote Icon */}
                <div style={{ 
                  color: '#111827', 
                  marginBottom: '16px',
                  marginTop: '32px'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Text */}
                <p style={{ 
                  color: '#4b5563', 
                  fontSize: '1.15rem', 
                  lineHeight: '1.6', 
                  marginBottom: 'auto', 
                  fontWeight: 400,
                  letterSpacing: '-0.01em'
                }}>
                  {testimonial.quote}
                </p>

                {/* Bottom spacer instead of Footer */}
                <div style={{ marginTop: '1.5rem' }} />
              </motion.div>
            );
          })}
        </div>
        </div>

        {/* Right side: Title */}
        <div style={{ flex: '1', minWidth: '300px', textAlign: 'left' }}>
          <h2 style={{ fontSize: '4rem', fontWeight: 500, letterSpacing: '-0.03em', color: '#1f2937', margin: '0 0 1.5rem 0', lineHeight: 1.1 }}>
            Loved by <br/>creators.
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#6B7280', maxWidth: '42rem' }}>
            See how professionals are using Avatar to scale their content without stepping into a studio.
          </p>
        </div>

      </div>
    </section>
  );
}
