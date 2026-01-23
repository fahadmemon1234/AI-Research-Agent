'use client';

import Head from 'next/head';

const SecurityPage = () => {
  return (
    <div className="min-vh-100 luxury-bg" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
      <style jsx>{`
        .luxury-bg {
          background: radial-gradient(circle at top right, #0d1b2a 0%, #020408 100%);
          color: #fff;
          position: relative;
        }

        /* Cyber Grid Effect */
        .luxury-bg::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background-image: linear-gradient(rgba(0, 210, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 210, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }

        .security-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(40px);
          border-radius: 40px;
          position: relative;
          overflow: hidden;
        }

        .shield-icon {
          font-size: 4rem;
          background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 15px rgba(0, 210, 255, 0.3));
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .section-header i {
          color: #00d2ff;
          font-size: 1.5rem;
        }

        .security-feature-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 30px;
          height: 100%;
          transition: 0.3s;
        }

        .security-feature-box:hover {
          background: rgba(0, 210, 255, 0.03);
          border-color: rgba(0, 210, 255, 0.2);
          transform: translateY(-5px);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 255, 157, 0.1);
          color: #00ff9d;
          padding: 5px 15px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }

        .pulse {
          width: 8px;
          height: 8px;
          background: #00ff9d;
          border-radius: 50%;
          box-shadow: 0 0 10px #00ff9d;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }

        .btn-glass {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 12px 25px;
          border-radius: 12px;
          transition: 0.3s;
        }

        .btn-glass:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #00d2ff;
          color: #00d2ff;
        }
      `}</style>

      <Head>
        <title>Security Infrastructure | Genius.AI</title>
      </Head>

      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            
            {/* Main Header */}
            <div className="text-center mb-5">
              <div className="status-badge">
                <div className="pulse"></div>
                SYSTEMS OPERATIONAL: GENIUS CLOUD SECURE
              </div>
              <div className="mb-4">
                <i className="bi bi-shield-lock-fill shield-icon"></i>
              </div>
              <h1 className="display-4 fw-bold mb-3">Fortress Security</h1>
              <p className="text-white-50 mx-auto" style={{ maxWidth: '700px' }}>
                At Genius.AI, we don’t just store data; we fortify it. Our architecture is built on 
                zero-trust principles to ensure your intellectual capital remains yours alone.
              </p>
            </div>

            <div className="security-card p-4 p-md-5 mb-5">
              <div className="row g-5">
                
                <div className="col-md-6">
                  <div className="section-header">
                    <i className="bi bi-cpu"></i>
                    <h4 className="text-white mb-0">Encryption Protocol</h4>
                  </div>
                  <p className="text-white-50 small leading-relaxed">
                    Data is shielded by <strong>TLS 1.3</strong> in transit and <strong>AES-256-GCM</strong> at rest. 
                    Encryption keys are managed via hardware security modules (HSM) with zero 
                    human access.
                  </p>
                </div>

                <div className="col-md-6">
                  <div className="section-header">
                    <i className="bi bi-fingerprint"></i>
                    <h4 className="text-white mb-0">Identity Governance</h4>
                  </div>
                  <p className="text-white-50 small leading-relaxed">
                    Multi-factor authentication (MFA) is mandatory for all internal systems. 
                    We utilize <strong>Zero-Trust Network Access (ZTNA)</strong> to verify every request 
                    to our neural nodes.
                  </p>
                </div>

                <div className="col-md-6">
                  <div className="section-header">
                    <i className="bi bi-globe"></i>
                    <h4 className="text-white mb-0">Infrastructure Rigor</h4>
                  </div>
                  <p className="text-white-50 small leading-relaxed">
                    Isolated VPC environments with real-time intrusion detection (IDS). 
                    Our infrastructure undergoes automated vulnerability scanning every 6 hours.
                  </p>
                </div>

                <div className="col-md-6">
                  <div className="section-header">
                    <i className="bi bi-journal-check"></i>
                    <h4 className="text-white mb-0">Compliance Matrix</h4>
                  </div>
                  <p className="text-white-50 small leading-relaxed">
                    Full adherence to <strong>GDPR, CCPA, and SOC 2 Type II</strong>. Regular 
                    third-party penetration tests ensure our defenses evolve faster than threats.
                  </p>
                </div>

              </div>
            </div>

            {/* Grid Features */}
            <div className="row g-4 mb-5">
              <div className="col-md-3 col-6">
                <div className="security-feature-box text-center">
                  <h6 className="text-white mb-2">SOC 2</h6>
                  <p className="x-small text-white-50 mb-0">Type II Certified</p>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="security-feature-box text-center">
                  <h6 className="text-white mb-2">24/7</h6>
                  <p className="x-small text-white-50 mb-0">SOC Monitoring</p>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="security-feature-box text-center">
                  <h6 className="text-white mb-2">AES-256</h6>
                  <p className="x-small text-white-50 mb-0">Vault Encryption</p>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="security-feature-box text-center">
                  <h6 className="text-white mb-2">Quantum</h6>
                  <p className="x-small text-white-50 mb-0">Ready Defense</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="text-center pt-4 border-top border-white-10">
              <p className="text-white-50 small mb-4">Need a deeper technical dive into our security whitepaper?</p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <button className="btn btn-premium-gradient px-5 py-3 rounded-pill fw-bold">
                  DOWNLOAD SECURITY WHITEPAPER
                </button>
                <button className="btn-glass px-5 py-3 rounded-pill fw-bold">
                  CONTACT SECURITY D.P.O
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;