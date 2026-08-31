import React from 'react';
import './landing.css';

import Navbar from './components/landing/Navbar';
import HeroSection from './components/landing/HeroSection';
import HowItWorks from './components/landing/HowItWorks';
import AutopilotSection from './components/landing/AutopilotSection';
import Analytics from './components/landing/Analytics';
import Pricing from './components/landing/Pricing';
import FAQ from './components/landing/FAQ';
import FinalCTA from './components/landing/FinalCTA';
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
          width: '100%',
          background: 'radial-gradient(circle at 100% 5%, #ff8b78 0%, #ffb4a3 22%, transparent 50%), radial-gradient(circle at 0% 0%, #d4d3f8 0%, #dfdcf5 30%, transparent 60%), radial-gradient(circle at 45% 110%, #fbb9da 0%, #f3d4e5 35%, transparent 65%), #f9eef1'
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
        <hr className="h-rule" />
        
        <FinalCTA />
      </main>
      
      <hr className="h-rule" />
      <Footer />
    </div>
  );
}
