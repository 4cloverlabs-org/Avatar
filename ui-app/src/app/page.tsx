import React from 'react';
import './landing.css';

import Navbar from './components/landing/Navbar';
import HeroSection from './components/landing/HeroSection';
import HowItWorks from './components/landing/HowItWorks';
import AutopilotSection from './components/landing/AutopilotSection';
import Analytics from './components/landing/Analytics';
import Pricing from './components/landing/Pricing';
import FAQ from './components/landing/FAQ';

import Footer from './components/landing/Footer';
import SocialProof from './components/landing/SocialProof';
import UseCases from './components/landing/UseCases';
import Testimonials from './components/landing/Testimonials';

export default function Home() {
  return (
    <div className="landing-container">
      <Navbar />
      
      <main>
        <div style={{
          width: '100%'
        }}>
          <HeroSection />
          <SocialProof />
          <hr className="h-rule" />
          
          <HowItWorks />
        </div>
        <hr className="h-rule" />
        
        <AutopilotSection />
        <hr className="h-rule" />
        
        <UseCases />
        <hr className="h-rule" />
        
        <Analytics />
        <hr className="h-rule" />
        
        <Testimonials />
        <hr className="h-rule" />
        
        <Pricing />
        <hr className="h-rule" />
        
        <FAQ />

      </main>
      
      <hr className="h-rule" />
      <Footer />
    </div>
  );
}
