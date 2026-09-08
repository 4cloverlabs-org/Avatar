import React from 'react';
import './landing.css';

import Navbar from './components/landing/Navbar';
import HeroSection from './components/landing/HeroSection';
import HowItWorks from './components/landing/HowItWorks';
import AutopilotSection from './components/landing/AutopilotSection';
import FeaturesGrid from './components/landing/FeaturesGrid';
import Pricing from './components/landing/Pricing';
import FAQ from './components/landing/FAQ';
import AIEngineSection from './components/landing/AIEngineSection';

import Footer from './components/landing/Footer';
import SocialProof from './components/landing/SocialProof';

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
        
        <AIEngineSection />
        <hr className="h-rule" />

        <AutopilotSection />
        <hr className="h-rule" />
        

        
        <FeaturesGrid />
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
