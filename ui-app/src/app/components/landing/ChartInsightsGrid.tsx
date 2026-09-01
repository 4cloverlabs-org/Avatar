"use client";

import React from 'react';

interface ChartInsightsGridProps {
  children: [React.ReactNode, React.ReactNode];
  funnelInsightTitle?: string;
  funnelInsightText?: string;
  retentionInsightTitle?: string;
  retentionInsightText?: string;
}

export default function ChartInsightsGrid({
  children,
  funnelInsightTitle = "Automated Audience Growth",
  funnelInsightText = "Our AI engine works around the clock to optimize your content delivery, ensuring that your message reaches the right people at the exact right moment.",
  retentionInsightTitle = "Sustain Long-Term Engagement",
  retentionInsightText = "Keep your audience captivated with continuous, high-quality interactions. Deliver personalized experiences that create loyal followers who keep coming back.",
}: ChartInsightsGridProps) {
  return (
    <div className="chart-insights-grid">
      <div className="grid-row row-1">
        <div className="card1">
          {children[0]}
        </div>
        <div className="text1">
          <h4 className="insight-title">{funnelInsightTitle}</h4>
          <p className="insight-text">{funnelInsightText}</p>
        </div>
      </div>
      <div className="grid-row row-2">
        <div className="card2">
          {children[1]}
        </div>
        <div className="text2">
          <h4 className="insight-title">{retentionInsightTitle}</h4>
          <p className="insight-text">{retentionInsightText}</p>
        </div>
      </div>

      <style jsx>{`
        .chart-insights-grid {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .grid-row {
          display: grid;
          gap: 24px;
          grid-template-columns: 1fr;
        }
        
        @media (min-width: 720px) {
          .row-1 {
            grid-template-columns: 1.5fr 1fr;
            grid-template-areas: "card1 text1";
          }
          .row-2 {
            grid-template-columns: 1fr 1.5fr;
            grid-template-areas: "text2 card2";
          }
        }

        .card1 { grid-area: card1; }
        .card2 { grid-area: card2; }
        
        .text1 { 
          grid-area: text1; 
          display: flex; 
          flex-direction: column; 
          justify-content: center; 
        }
        
        .text2 { 
          grid-area: text2; 
          display: flex; 
          flex-direction: column; 
          justify-content: center;
        }
        
        @media (min-width: 720px) {
          .text2 {
            text-align: right;
            align-items: flex-end;
          }
        }

        .insight-title {
          font-family: var(--font-heading, inherit);
          font-weight: 700;
          font-size: 1.125rem;
          color: #111827; /* Tailwind gray-900 */
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
        }
        
        .insight-text {
          font-family: var(--font-body, inherit);
          font-size: 0.95rem;
          color: #4B5563; /* Tailwind gray-600 */
          line-height: 1.6;
          margin: 0;
          max-width: 400px;
        }
      `}</style>
    </div>
  );
}
