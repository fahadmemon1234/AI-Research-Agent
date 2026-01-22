'use client';

import Head from 'next/head';

const PrivacyPage = () => {
  return (
    <div className="min-vh-100 luxury-bg" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
      <style jsx>{`
        .luxury-bg {
          background: radial-gradient(circle at top right, #0d1b2a 0%, #020408 100%);
          color: #fff;
          overflow-x: hidden;
        }

        .privacy-card {
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(40px);
          border-radius: 40px;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        /* Animated Scanning Line Effect */
        .privacy-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(0, 210, 255, 0) 0%, rgba(0, 210, 255, 0.03) 50%, rgba(0, 210, 255, 0) 100%);
          background-size: 100% 200%;
          animation: scan 8s linear infinite;
          pointer-events: none;
        }

        @keyframes scan {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 200%; }
        }

        .protocol-title {
          font-weight: 900;
          letter-spacing: -2px;
          background: linear-gradient(to bottom, #ffffff 30%, #4facfe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 3.5rem;
        }

        .section-tag {
          color: #00d2ff;
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-tag::after {
          content: '';
          height: 1px;
          width: 30px;
          background: rgba(0, 210, 255, 0.3);
        }

        .privacy-section {
          padding: 30px;
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          margin-bottom: 1.5rem;
        }

        .privacy-section:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(0, 210, 255, 0.2);
          transform: translateX(10px);
        }

        .text-content {
          color: rgba(255, 255, 255, 0.7); /* Improved contrast for readability */
          line-height: 1.9;
          font-size: 1.05rem;
          font-weight: 300;
        }

        .security-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 10px 24px;
          background: rgba(0, 210, 255, 0.1);
          border: 1px solid rgba(0, 210, 255, 0.2);
          border-radius: 100px;
          color: #00d2ff;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          box-shadow: 0 0 20px rgba(0, 210, 255, 0.15);
        }

        .contact-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          padding: 40px;
          margin-top: 60px;
          transition: 0.3s;
        }

        .contact-box:hover {
          border-color: #00d2ff;
          box-shadow: 0 0 30px rgba(0, 210, 255, 0.05);
        }

        .email-link {
          color: #fff;
          font-size: 1.3rem;
          font-weight: 700;
          text-decoration: none;
          transition: 0.3s;
          position: relative;
        }

        .email-link:hover {
          color: #00d2ff;
        }
      `}</style>

      <Head>
        <title>Privacy Protocol | Genius.AI</title>
      </Head>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-11 col-xl-9">
            <div className="privacy-card shadow-2xl overflow-hidden">
              <div className="card-body p-5">
                
                {/* Header Area */}
                <div className="text-center mb-5 pb-4">
                  <div className="security-badge mb-4">
                    <i className="bi bi-shield-check"></i>
                    ISO/IEC 27001 SECURED
                  </div>
                  <h1 className="protocol-title mb-3">Privacy Protocol</h1>
                  <p className="text-white-50 small text-uppercase fw-bold" style={{ letterSpacing: '4px' }}>
                    Deployment Version 4.0.2 // Node: PK-KHI
                  </p>
                </div>

                <div className="privacy-content">
                  
                  <section className="privacy-section">
                    <span className="section-tag">01. Data Acquisition</span>
                    <h4 className="text-white mb-3 fw-bold">Information Governance</h4>
                    <p className="text-content">
                      Genius AI operates on a principle of <strong>minimal data footprint</strong>. We collect 
                      identity parameters and encrypted document metadata strictly for service optimization. 
                      Your raw data is never stored in persistent memory; it exists only in isolated, 
                      volatile neural environments during processing.
                    </p>
                  </section>

                  <section className="privacy-section">
                    <span className="section-tag">02. Utilization Logic</span>
                    <h4 className="text-white mb-3 fw-bold">Neural Processing Intent</h4>
                    <p className="text-content">
                      Processing is restricted to platform maintenance, cryptographic security 
                      checks, and personalized AI response calibration. We maintain a zero-sharing 
                      policy; your intellectual property is never utilized to train global models 
                      without explicit permission.
                    </p>
                  </section>

                  <section className="privacy-section">
                    <span className="section-tag">03. Fortification</span>
                    <h4 className="text-white mb-3 fw-bold">Cryptographic Standards</h4>
                    <p className="text-content">
                      All data at rest is secured via <strong>AES-256-GCM</strong> encryption. Data in transit is 
                      shielded by TLS 1.3 multi-layered tunnels. Our architecture is designed with 
                      quantum-resistant ready frameworks to ensure your digital brain remains private 
                      indefinitely.
                    </p>
                  </section>

                  <section className="privacy-section">
                    <span className="section-tag">04. Autonomy</span>
                    <h4 className="text-white mb-3 fw-bold">User Sovereignty</h4>
                    <p className="text-content">
                      You retain absolute ownership. We provide a <strong>"One-Click Purge"</strong> system 
                      that allows you to instantaneously delete your entire processing history, 
                      leaving zero residual data on our decentralized nodes.
                    </p>
                  </section>

                  {/* Contact Section */}
                  <div className="contact-box text-center mt-5">
                    <div className="mb-4">
                      <i className="bi bi-envelope-paper text-info" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <h5 className="text-white fw-bold mb-2">Legal Inquiry Desk</h5>
                    <p className="text-white-50 mb-4 mx-auto" style={{maxWidth: '400px'}}>
                      For encrypted communication regarding data rights or technical protection measures.
                    </p>
                    <a href="mailto:privacy@genius.ai" className="email-link">
                      privacy@genius.ai
                    </a>
                  </div>

                </div>
              </div>
            </div>

            {/* Bottom Footer Note */}
            <div className="text-center mt-5">
              <div className="d-flex justify-content-center gap-4 mb-3" style={{ opacity: 0.4 }}>
                <span className="small">GDPR Ready</span>
                <span className="small">CCPA Compliant</span>
                <span className="small">256-bit SSL</span>
              </div>
              <p className="text-white-50 x-small" style={{ fontSize: '0.7rem', opacity: 0.3 }}>
                © 2026 Genius AI Labs. All neural processing is bound by the laws of Pakistan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;