import React from 'react';
import { Search, ShieldCheck, Upload, Mail, Zap, CheckSquare, LineChart, Link as LinkIcon } from 'lucide-react';

export default function LandingOverview() {
  return (
    <section className="landing-overview">
      
      <div className="overview-top-line"></div>
      
      <div className="hero-badge" style={{ marginBottom: 40 }}>
        <span className="dot"></span> Overview <span className="stripes"></span>
      </div>

      <div className="overview-main">
        
        {/* Left Side: Text */}
        <div className="overview-left">
          <p className="overview-text">
            Dispatch is an AI-powered <span className="text-highlight">operations layer for support teams</span> that turns customer requests into completed work.
          </p>
          <p className="overview-text-secondary">
            It connects your <span className="text-highlight">helpdesk, knowledge base, and CRM</span> to resolve tickets, run approved workflows, and keep records accurate so your team ships <span className="text-highlight">faster outcomes with full visibility and control.</span>
          </p>
        </div>

        {/* Right Side: Workflow UI */}
        <div className="overview-right">
          <div className="workflow-box">
            
            <div className="workflow-header">
              <span>Refund request</span>
              <div className="workflow-header-line"></div>
              <span>Workflow example</span>
            </div>

            <div className="workflow-steps">
              <div className="workflow-step">
                <span className="workflow-step-num">01</span>
                <span className="workflow-step-text highlight">VERIFY POLICY</span>
                <span className="workflow-step-icon"><Search size={14} /></span>
              </div>
              <div className="workflow-arrow">↓</div>

              <div className="workflow-step">
                <span className="workflow-step-num">02</span>
                <span className="workflow-step-text">REQUIRE APPROVAL</span>
                <span className="workflow-step-icon"><ShieldCheck size={14} /></span>
              </div>
              <div className="workflow-arrow">↓</div>

              <div className="workflow-step">
                <span className="workflow-step-num">03</span>
                <span className="workflow-step-text highlight">UPDATE CRM</span>
                <span className="workflow-step-icon"><Upload size={14} /></span>
              </div>
              <div className="workflow-arrow">↓</div>

              <div className="workflow-step">
                <span className="workflow-step-num">04</span>
                <span className="workflow-step-text">SEND CONFIRMATION</span>
                <span className="workflow-step-icon"><Mail size={14} /></span>
              </div>
            </div>

          </div>
        </div>
        
      </div>

      {/* Bottom Features */}
      <div className="overview-bottom">
        <div className="feature-card">
          <div className="feature-icon"><LinkIcon size={20} /></div>
          <div className="feature-title">SOURCE CONNECT</div>
          <div className="feature-desc">Connect helpdesk, CRM, and knowledge.</div>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><Zap size={20} /></div>
          <div className="feature-title">ACTION RUNNER</div>
          <div className="feature-desc">Execute updates, tasks, and notifications.</div>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><CheckSquare size={20} /></div>
          <div className="feature-title">APPROVAL GATE</div>
          <div className="feature-desc">Require approval for sensitive actions.</div>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><LineChart size={20} /></div>
          <div className="feature-title">AUDIT + INSIGHTS</div>
          <div className="feature-desc">Track every change and spot patterns.</div>
        </div>
      </div>

    </section>
  );
}
