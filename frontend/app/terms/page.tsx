'use client';

import Head from 'next/head';

const TermsPage = () => {
  return (
    <div className="min-vh-100 luxury-bg" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
      <style jsx>{`
        .luxury-bg {
          background: radial-gradient(circle at top right, #0a1221 0%, #020408 100%);
          color: #fff;
        }

        .terms-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(25px);
          border-radius: 30px;
          position: relative;
          box-shadow: 0 50px 100px rgba(0,0,0,0.5);
        }

        .gradient-header {
          background: linear-gradient(135deg, #fff 0%, #00d2ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        /* Terms Section Styling */
        .terms-section {
          padding: 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: 0.3s;
        }

        .terms-section:last-child {
          border-bottom: none;
        }

        .terms-section:hover {
          background: rgba(255, 255, 255, 0.01);
        }

        .section-index {
          font-family: 'Courier New', monospace;
          color: #00d2ff;
          font-weight: 700;
          margin-right: 15px;
          font-size: 0.9rem;
        }

        /* Readability Fix - Dark text on dark bg is avoided */
        .terms-heading {
          color: #ffffff; /* Pure white for headings */
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }

        .terms-text {
          color: rgba(255, 255, 255, 0.65); /* High contrast gray-white */
          line-height: 1.8;
          font-size: 0.95rem;
          margin-left: 40px;
        }

        .governing-badge {
          background: rgba(0, 210, 255, 0.1);
          border: 1px solid rgba(0, 210, 255, 0.2);
          padding: 20px;
          border-radius: 20px;
          margin-top: 30px;
        }

        .scroll-indicator {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 10px;
          opacity: 0.3;
        }

        .dot { width: 4px; height: 4px; background: #fff; border-radius: 50%; }
      `}</style>

      <Head>
        <title>Terms of Service | Genius.AI</title>
      </Head>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="terms-card">
              <div className="card-body p-4 p-md-5">
                
                {/* Scroll dots decoration */}
                <div className="scroll-indicator d-none d-md-flex">
                  <div className="dot"></div><div className="dot"></div><div className="dot" style={{background: '#00d2ff'}}></div><div className="dot"></div>
                </div>

                {/* Header */}
                <div className="text-center mb-5">
                  <h1 className="gradient-header display-5 mb-3">User Agreement</h1>
                  <p className="text-white-50 small fw-bold" style={{ letterSpacing: '3px' }}>
                    PROTOCOL ESTABLISHED: JAN 21, 2026
                  </p>
                  <div className="mx-auto mt-4" style={{width: '50px', height: '2px', background: '#00d2ff'}}></div>
                </div>

                <div className="terms-content">
                  
                  <section className="terms-section">
                    <div className="terms-heading">
                      <span className="section-index">01</span> Acceptance of Access
                    </div>
                    <p className="terms-text">
                      By initializing the Genius.AI neural interface, you voluntarily agree to be legally 
                      bound by these Terms of Service. If you do not agree with any specific 
                      provision, you are prohibited from utilizing the platform's analysis capabilities.
                    </p>
                  </section>

                  <section className="terms-section">
                    <div className="terms-heading">
                      <span className="section-index">02</span> License & Intellectual Property
                    </div>
                    <p className="terms-text">
                      We grant you a non-exclusive, revocable license to utilize Genius.AI for 
                      document synthesis. All software architecture, neural models, and design 
                      elements remain the sole property of Genius AI Labs. You may not reverse-engineer 
                      our core processing engines.
                    </p>
                  </section>

                  <section className="terms-section">
                    <div className="terms-heading">
                      <span className="section-index">03</span> Operational Disclaimer
                    </div>
                    <p className="terms-text">
                      The intelligence provided is on an "AS-IS" basis. While our AI maintains 
                      99.9% precision, Genius.AI makes no absolute warranties regarding the 
                      final outcome of comparative analysis for legal or financial decisions.
                    </p>
                  </section>

                  <section className="terms-section">
                    <div className="terms-heading">
                      <span className="section-index">04</span> Liability Limitations
                    </div>
                    <p className="terms-text">
                      In no scenario shall Genius.AI be liable for indirect, incidental, or 
                      consequential damages resulting from data loss or business interruptions 
                      linked to neural processing downtime.
                    </p>
                  </section>

                  {/* Governing Law Highlight */}
                  <div className="governing-badge">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center text-md-start mb-3 mb-md-0">
                        <i className="bi bi-bank" style={{fontSize: '2rem', color: '#00d2ff'}}></i>
                      </div>
                      <div className="col-md-10">
                        <h6 className="text-white fw-bold mb-1">Jurisdiction & Governing Law</h6>
                        <p className="small text-white-50 mb-0">
                          These protocols are governed by the laws of <strong>Pakistan</strong>. 
                          Any disputes shall be settled under the exclusive jurisdiction of the 
                          High Courts of Pakistan.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="text-center mt-5">
                  <p className="text-white-50 x-small" style={{ fontSize: '0.75rem' }}>
                    Questions regarding these terms? Contact our Legal Node: 
                    <a href="mailto:legal@genius.ai" className="ms-2" style={{color: '#00d2ff', textDecoration: 'none'}}>legal@genius.ai</a>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;