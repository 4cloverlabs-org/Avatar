"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      name: "Starter",
      description: "Best for trying things out.",
      monthlyPrice: "29",
      yearlyPrice: "24",
      features: [
        "30 mins video/mo",
        "1 custom avatar",
        "1 voice clone",
        "1 platform connection"
      ],
      ctaText: "Get Started",
      highlight: false
    },
    {
      name: "Creator",
      description: "Best for solo creators posting weekly.",
      monthlyPrice: "89",
      yearlyPrice: "69",
      features: [
        "Everything in Starter, plus:",
        "120 mins video/mo",
        "3 custom avatars",
        "3 platform connections",
        "Auto-publishing",
        "No watermark"
      ],
      ctaText: "Start Free Trial",
      highlight: true,
      tag: "POPULAR"
    },
    {
      name: "Pro / Agency",
      description: "Best for professional teams.",
      monthlyPrice: "249",
      yearlyPrice: "199",
      features: [
        "Everything in Creator, plus:",
        "600 mins video/mo",
        "10 custom avatars",
        "Unlimited platforms",
        "White-label",
        "Priority render"
      ],
      ctaText: "Get Started",
      highlight: false
    },
    {
      name: "Enterprise",
      description: "Best for large organizations.",
      monthlyPrice: "Custom",
      yearlyPrice: "Custom",
      features: [
        "Everything in Pro, plus:",
        "Unlimited generation",
        "API Access",
        "SSO Security",
        "Account Manager"
      ],
      ctaText: "Contact Sales",
      highlight: false
    }
  ];

  const wrapperVariants: Variants = {
    rest: { y: 0 },
    hover: { y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }
  };

  const topAreaVariants: Variants = {
    rest: {
      backgroundColor: "#F9FAFB",
      borderBottomColor: "#E5E7EB",
      color: "#000000",
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.05)"
    },
    hover: {
      backgroundColor: "#2A2A2A",
      borderBottomColor: "#3A3A3A",
      color: "#FFFFFF",
      boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.12)"
    }
  };

  const buttonVariants: Variants = {
    rest: {
      backgroundColor: "#000000",
      color: "#FFFFFF",
      scale: 1
    },
    hover: {
      backgroundColor: "#FFFFFF",
      color: "#000000",
      scale: 1.02
    }
  };

  const slipVariants: Variants = {
    rest: {
      y: 0,
      opacity: 0,
      rotate: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    hover: {
      y: "90%", // Drop down to reveal features below the top card
      opacity: 1,
      rotate: -1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  };

  return (
    <section className="editorial-section grid-container" id="pricing" style={{ paddingBottom: '20vh' }}>
      <div className="col-12 mb-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="editorial-h2" style={{ textAlign: 'center' }}>Simple Pricing</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: '#E5E7EB', padding: '0.25rem', borderRadius: '100px', marginTop: '1rem' }}>
           <button onClick={() => setIsYearly(false)} style={{ background: !isYearly ? '#FFFFFF' : 'transparent', color: 'var(--text-main)', border: 'none', borderRadius: '100px', padding: '0.5rem 1.25rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', boxShadow: !isYearly ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s ease' }}>Monthly</button>
           <button onClick={() => setIsYearly(true)} style={{ background: isYearly ? '#FFFFFF' : 'transparent', color: 'var(--text-main)', border: 'none', borderRadius: '100px', padding: '0.5rem 1.25rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', boxShadow: isYearly ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             Yearly
             <span style={{ backgroundColor: '#000000', color: '#FFF', padding: '2px 8px', borderRadius: '100px', fontSize: '0.7rem' }}>Save 20%</span>
           </button>
        </div>
      </div>

      {plans.map((plan, i) => (
        <motion.div 
          key={plan.name}
          className="col-3"
          initial="rest"
          whileHover="hover"
          animate="rest"
          variants={wrapperVariants}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            position: 'relative',
            zIndex: plan.highlight ? 10 : 1
          }}
        >
          {plan.tag && (
             <div style={{ position: 'absolute', top: '-0.75rem', right: '1rem', background: '#000000', color: '#FFFFFF', padding: '4px 10px', fontSize: '0.7rem', fontWeight: 600, borderRadius: '100px', zIndex: 20 }}>
               {plan.tag}
             </div>
          )}

          {/* Top Card Area (Ticket) */}
          <motion.div 
            variants={topAreaVariants}
            style={{ 
              padding: '2rem', 
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              borderRadius: '24px',
              position: 'relative',
              zIndex: 2
            }}>
            <div>
              <div className="mono-text" style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                {plan.name}
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.25rem', minHeight: '40px' }}>
                {plan.description}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
              <AnimatePresence mode="popLayout">
                <motion.span 
                  key={isYearly ? 'yearly' : 'monthly'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="editorial-h2" 
                  style={{ fontSize: plan.monthlyPrice === "Custom" ? '2.5rem' : '3.5rem', lineHeight: 1, margin: 0 }}
                >
                  {plan.monthlyPrice !== "Custom" ? "$" : ""}{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </motion.span>
              </AnimatePresence>
              {plan.monthlyPrice !== "Custom" && (
                <span style={{ fontSize: '1rem', opacity: 0.7, marginBottom: '6px' }}>/mo</span>
              )}
            </div>

            <motion.button 
              variants={buttonVariants}
              whileTap={{ scale: 0.98 }}
              style={{ 
                width: '100%', 
                padding: '0.875rem', 
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
            >
              {plan.ctaText}
            </motion.button>
          </motion.div>

          {/* Bottom Card Area (Slip / Features) */}
          <motion.div 
            variants={slipVariants}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              padding: '2rem', 
              paddingTop: '3rem',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              borderRadius: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              zIndex: 1,
              display: 'flex', 
              flexDirection: 'column' 
            }}>
            <ul className="mono-text" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', opacity: 0.9 }}>
              {plan.features.map((feature, idx) => {
                const isHeading = feature.includes('Everything in');
                return (
                  <li key={idx} style={{ 
                    display: 'flex', 
                    gap: '0.75rem', 
                    fontWeight: isHeading ? 700 : 400,
                    opacity: isHeading ? 1 : 0.8
                  }}>
                    {!isHeading && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {feature}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      ))}
    </section>
  );
}

