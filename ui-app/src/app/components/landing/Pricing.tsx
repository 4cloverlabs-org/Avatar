"use client";

import React, { useState } from 'react';

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



  return (
    <section className="editorial-section grid-container" id="pricing" style={{ paddingTop: '60px', paddingBottom: '20vh' }}>
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
        <div 
          key={plan.name}
          className="col-3"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            position: 'relative',
            zIndex: plan.highlight ? 10 : 1,
            filter: "drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.05))",
            height: '100%'
          }}
        >
          {plan.tag && (
             <div style={{ position: 'absolute', top: '-0.75rem', right: '1rem', background: '#000000', color: '#FFFFFF', padding: '4px 10px', fontSize: '0.7rem', fontWeight: 600, borderRadius: '100px', zIndex: 20 }}>
               {plan.tag}
             </div>
          )}

          {/* Top Card Area (Ticket) */}
          <div 
            style={{ 
              padding: '2rem', 
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              borderBottomLeftRadius: '0px',
              borderBottomRightRadius: '0px',
              position: 'relative',
              backgroundColor: '#F9FAFB',
              borderBottomColor: 'rgba(249, 250, 251, 0)',
              color: '#000000',
              zIndex: 2
            }}>
            <div>
              <div className="mono-text" style={{ fontWeight: 600, fontSize: '1.1rem', color: '#000000' }}>
                {plan.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#000000', marginTop: '0.25rem', minHeight: '40px' }}>
                {plan.description}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
              <span 
                className="editorial-h2" 
                style={{ fontSize: plan.monthlyPrice === "Custom" ? '2.5rem' : '3.5rem', lineHeight: 1, margin: 0 }}
              >
                {plan.monthlyPrice !== "Custom" ? "$" : ""}{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
              </span>
              {plan.monthlyPrice !== "Custom" && (
                <span style={{ fontSize: '1rem', opacity: 0.7, marginBottom: '6px' }}>/mo</span>
              )}
            </div>

            <button 
              style={{ 
                width: '100%', 
                padding: '0.875rem', 
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                marginTop: 'auto',
                backgroundColor: '#000000',
                color: '#FFFFFF'
              }}
            >
              {plan.ctaText}
            </button>
          </div>

          {/* Bottom Card Area (Slip / Features) */}
          <div 
            style={{ 
              width: '100%',
              padding: '2rem', 
              paddingTop: '1rem',
              backgroundColor: '#F9FAFB',
              color: '#000000',
              borderBottomLeftRadius: '24px',
              borderBottomRightRadius: '24px',
              borderTopLeftRadius: '0px',
              borderTopRightRadius: '0px',
              zIndex: 1,
              display: 'flex', 
              flexDirection: 'column',
              flex: 1
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
          </div>
        </div>
      ))}
    </section>
  );
}

