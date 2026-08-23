"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LandingOverview from './LandingOverview';

export default function LandingHero() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(1);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div className="landing-page">
      
      {/* Left Sidebar */}
      <div className="landing-sidebar">
        <div className="logo-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <rect x="12" y="2" width="10" height="10" transform="rotate(45 12 2)" fill="#15170F" />
             <rect x="12" y="6" width="6" height="6" transform="rotate(45 12 6)" fill="#3b5d3b" />
          </svg>
        </div>
        <div className="trusted-by-container">
          <div className="trusted-text">
            <span>Trusted by</span><br/>
            <span>AI innovators:</span>
          </div>
          <div className="trusted-logos">
             {/* Abstract logos matching the GIF */}
             <svg width="28" height="28" viewBox="0 0 24 24" fill="#63685A"><path d="M4 14l4-4 4 4 4-4 4 4v4H4z"/></svg>
             <svg width="28" height="28" viewBox="0 0 24 24" fill="#63685A"><polygon points="12,4 20,12 12,20 4,12" fill="none" stroke="#63685A" strokeWidth="2"/><polygon points="12,8 16,12 12,16 8,12"/></svg>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="landing-main">
        
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="nav-links">
            <Link href="#">Home</Link>
            <Link href="#">About</Link>
            <Link href="#">Updates</Link>
            <Link href="#">Blog</Link>
          </div>
          <Link href="/dashboard" className="btn-get-started-nav">
            GET STARTED
          </Link>
        </nav>

        {/* Hero Section */}
        <div className="landing-hero">
          
          {/* Left Column - Text Content */}
          <div className="hero-left">
            <div className={`hero-badge ${mounted ? 'animate-fade-in-up' : ''}`}>
               <span className="dot"></span> AI Support, automated <span className="stripes"></span>
            </div>
            
            <h1 className={`hero-title ${mounted ? 'animate-fade-in-up' : ''}`} style={{animationDelay: '100ms'}}>
              Resolve<br/>Faster with<br/>AI Workflows
            </h1>
            
            <p className={`hero-subtitle ${mounted ? 'animate-fade-in-up' : ''}`} style={{animationDelay: '200ms'}}>
              Connect your help center, knowledge base, and CRM software.<br/>
              Dispatch resolves tickets, updates records, and trigs workflows
            </p>
            
            <div className={mounted ? 'animate-fade-in-up' : ''} style={{animationDelay: '300ms'}}>
              <Link href="/dashboard" className="btn-hero-main">
                GET STARTED
              </Link>
            </div>

            <div className={`hero-accordion ${mounted ? 'animate-fade-in-up' : ''}`} style={{animationDelay: '400ms'}}>
              <div className={`accordion-item ${activeAccordion === 1 ? 'active' : ''}`}>
                <div className="accordion-header" onClick={() => toggleAccordion(1)}>
                  <div className="accordion-title">
                    <span className="number">01</span>
                    <span>Connect Layer</span>
                  </div>
                  <svg className={`chevron ${activeAccordion === 1 ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                <div className="accordion-content" style={{ height: activeAccordion === 1 ? 'auto' : 0 }}>
                  <div className="content-inner">
                    <div className="list-item"><span className="plus">+</span> Plug into Helpdesk, CRM and Chat</div>
                    <div className="list-item"><span className="plus">+</span> Capture requests across channels.</div>
                    <div className="list-item"><span className="plus">+</span> Unified Inbox signals.</div>
                  </div>
                </div>
              </div>

              <div className={`accordion-item ${activeAccordion === 2 ? 'active' : ''}`}>
                <div className="accordion-header" onClick={() => toggleAccordion(2)}>
                  <div className="accordion-title">
                    <span className="number">02</span>
                    <span>Action Layer</span>
                  </div>
                  <svg className={`chevron ${activeAccordion === 2 ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                <div className="accordion-content" style={{ height: activeAccordion === 2 ? 'auto' : 0 }}>
                  <div className="content-inner">
                    <div className="list-item"><span className="plus">+</span> Automate repetitive tasks.</div>
                    <div className="list-item"><span className="plus">+</span> Trigger complex multi-step workflows.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Diagram */}
          <div className="hero-right">
            <div 
              className={`diagram-container ${isHovered ? 'hovered' : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              
              {/* Central connecting line */}
              <div className="center-line"></div>

              {/* Layer 1: Connect */}
              <div className="iso-layer layer-1">
                <div className="iso-shape connect-shape"></div>
                <div className="iso-label-line"></div>
                <div className="iso-label">CONNECT</div>
              </div>

              {/* Layer 2: Resolve */}
              <div className="iso-layer layer-2">
                <div className="iso-shape resolve-shape">
                  <div className="resolve-inner"></div>
                </div>
                <div className="iso-label-line"></div>
                <div className="iso-label">RESOLVE</div>
              </div>

              {/* Layer 3: Control */}
              <div className="iso-layer layer-3">
                <div className="iso-shape control-shape">
                  <svg viewBox="0 0 100 100">
                    <polygon points="50 0, 100 25, 100 75, 50 100, 0 75, 0 25" fill="var(--shape-bg)" stroke="var(--shape-border)" strokeWidth="1" />
                    <polygon points="50 30, 70 42, 70 58, 50 70, 30 58, 30 42" fill="none" stroke="var(--shape-border)" strokeWidth="1" />
                  </svg>
                </div>
                <div className="iso-label-line"></div>
                <div className="iso-label">CONTROL</div>
              </div>

              {/* Layer 4: Analyze */}
              <div className="iso-layer layer-4">
                <div className="iso-shape analyze-shape">
                  <div className="analyze-inner"></div>
                </div>
                <div className="iso-label-line"></div>
                <div className="iso-label">ANALYZE</div>
              </div>

            </div>
          </div>

        </div>

        {/* New Overview Section */}
        <LandingOverview />

      </div>
      
    </div>
  );
}
