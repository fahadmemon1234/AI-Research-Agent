'use client';

import Head from 'next/head';

const AIAnalysisPage = () => {
  return (
    <div className="min-vh-100 luxury-bg" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
      <style jsx>{`
        .luxury-bg {
          background: radial-gradient(circle at top center, #0a1221 0%, #020408 100%);
          color: #fff;
          overflow-x: hidden;
        }

        .gradient-text {
          background: linear-gradient(135deg, #fff 30%, #00d2ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
        }

        /* Glassmorphism Card */
        .premium-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(20px);
          border-radius: 40px;
          padding: 60px;
          position: relative;
        }

        .premium-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, transparent, rgba(0, 210, 255, 0.1), transparent);
          z-index: -1;
          border-radius: 42px;
        }

        /* Feature Section Styling */
        .feature-box {
          position: relative;
          padding-left: 30px;
          border-left: 2px solid rgba(0, 210, 255, 0.2);
          transition: 0.4s ease;
        }

        .feature-box:hover {
          border-left: 2px solid #00d2ff;
          transform: translateX(10px);
        }

        /* Bento Grid Style for bottom features */
        .bento-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 30px;
          height: 100%;
          transition: all 0.3s ease;
        }

        .bento-item:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-5px);
          border-color: rgba(0, 210, 255, 0.3);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .icon-pulse {
          width: 45px;
          height: 45px;
          background: rgba(0, 210, 255, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00d2ff;
          margin-bottom: 20px;
        }

        .btn-luxury {
          background: #fff;
          color: #000;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 18px 40px;
          border-radius: 100px;
          transition: 0.3s;
          border: none;
        }

        .btn-luxury:hover {
          background: #00d2ff;
          color: #fff;
          box-shadow: 0 0 30px rgba(0, 210, 255, 0.4);
          transform: scale(1.05);
        }

        .status-badge {
          background: rgba(0, 255, 136, 0.1);
          color: #00ff88;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          display: inline-block;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-11 col-xl-10">
            <div className="premium-card">
              
              {/* Header */}
              <div className="text-center mb-5 pb-4">
                <span className="status-badge">NEURAL CORE V3.0</span>
                <h1 className="display-4 gradient-text mb-3">AI Analysis Protocols</h1>
                <p className="lead text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
                  Harnessing multi-modal neural networks to decode complex information with surgical precision.
                </p>
              </div>

              {/* Main Features Detail */}
              <div className="row g-5">
                {[
                  {
                    title: "Semantic Comprehension",
                    desc: "Our AI goes beyond keyword matching, decoding the underlying intent and contextual nuances of your global data."
                  },
                  {
                    title: "Cross-Modal Synthesis",
                    desc: "Analyze charts, spatial diagrams, and raw text simultaneously for a 360-degree intelligence report."
                  },
                  {
                    title: "Anomaly Detection",
                    desc: "Instantly identify patterns, structural inconsistencies, and hidden emerging trends within milliseconds."
                  }
                ].map((item, index) => (
                  <div className="col-md-12" key={index}>
                    <div className="feature-box">
                      <h4 className="text-white fw-bold mb-2">{item.title}</h4>
                      <p className="text-white-50 mb-0" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bento Grid Features */}
              <div className="row g-4 mt-5">
                {[
                  { title: "Natural Language", icon: "bi-chat-left-dots", desc: "Interact with data using human-like dialogue." },
                  { title: "Evidence Tracking", icon: "bi-shield-check", desc: "Every insight is backed by source-verified citations." },
                  { title: "Sentiment Analysis", icon: "bi-bar-chart", desc: "Decipher emotional tone across documents." },
                  { title: "Rapid Processing", icon: "bi-lightning-charge", desc: "Sub-second analysis for enterprise-scale files." }
                ].map((feature, i) => (
                  <div className="col-md-6 col-lg-3" key={i}>
                    <div className="bento-item">
                      <div className="icon-pulse">
                        <i className={`bi ${feature.icon}`}></i>
                      </div>
                      <h6 className="text-white fw-800 mb-2" style={{fontSize: '0.85rem', letterSpacing: '1px'}}>{feature.title.toUpperCase()}</h6>
                      <p className="small text-white-50 mb-0">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="text-center mt-5 pt-5 border-top border-white-05" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="small text-white-50 mb-4 fw-bold" style={{letterSpacing: '2px'}}>READY TO DEPLOY?</p>
                <button className="btn-luxury">Initialize Analysis Engine</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPage;