'use client';

import Head from 'next/head';

const CookiesPage = () => {
  return (
    <div className="min-vh-100 luxury-bg" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
      <style jsx>{`
        .luxury-bg {
          background: radial-gradient(circle at center, #0a1221 0%, #020408 100%);
          color: #fff;
        }

        .cookies-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 40px;
          padding: 60px;
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4);
        }

        .gradient-title {
          background: linear-gradient(135deg, #00d2ff 0%, #00ff88 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
        }

        .policy-section-title {
          color: #fff;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin-bottom: 20px;
          border-left: 3px solid #00d2ff;
          padding-left: 15px;
        }

        .text-glass {
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.8;
          font-size: 1rem;
        }

        /* Glass Table Styling */
        .luxury-table {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .luxury-table th {
          background: rgba(0, 210, 255, 0.05);
          color: #00d2ff;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 1.5px;
          padding: 20px;
          border: none;
        }

        .luxury-table td {
          padding: 20px;
          border-color: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        /* Custom Bullet points */
        .feature-list {
          list-style: none;
          padding-left: 0;
        }

        .feature-list li {
          position: relative;
          padding-left: 30px;
          margin-bottom: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .feature-list li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: #00d2ff;
          font-weight: bold;
        }

        .contact-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 30px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: 0.3s;
        }

        .contact-pill:hover {
          background: rgba(0, 210, 255, 0.05);
          border-color: #00d2ff;
        }
      `}</style>

      <Head>
        <title>Cookies Policy | Genius.AI</title>
      </Head>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            <div className="cookies-card">
              
              {/* Header */}
              <div className="text-center mb-5 pb-4">
                <i className="bi bi-info-circle-fill text-info mb-3 d-block" style={{fontSize: '2.5rem'}}></i>
                <h1 className="display-5 gradient-title mb-3">Cookies Architecture</h1>
                <p className="text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
                  Optimizing your neural interface through intelligent session management.
                </p>
              </div>

              <div className="cookies-content">
                
                <section className="mb-5">
                  <h4 className="policy-section-title">01. Definition of Protocol</h4>
                  <p className="text-glass">
                    Cookies are fundamental data packets stored on your hardware to facilitate persistent sessions 
                    and localized preferences. They act as the "memory" of your browser, allowing Genius.AI 
                    to recognize your specific configuration upon return.
                  </p>
                </section>

                <section className="mb-5">
                  <h4 className="policy-section-title">02. Functional Utility</h4>
                  <p className="text-glass mb-4">
                    Our system deploys cookies for the following critical operations:
                  </p>
                  <ul className="feature-list">
                    <li>Encryption of active authentication cycles.</li>
                    <li>Calibration of AI response preferences.</li>
                    <li>Performance telemetry to eliminate latency.</li>
                    <li>Deep-link integrity for cross-device analysis.</li>
                  </ul>
                </section>

                <section className="mb-5">
                  <h4 className="policy-section-title">03. Classification Matrix</h4>
                  <div className="table-responsive luxury-table mt-4">
                    <table className="table table-dark mb-0">
                      <thead>
                        <tr>
                          <th>PROTOCOL TYPE</th>
                          <th>OPERATIONAL PURPOSE</th>
                          <th>TTL (LIFESPAN)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="fw-bold">Core Essential</td>
                          <td>Validation of security tokens and account access</td>
                          <td>Session-only</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Analytical Insight</td>
                          <td>Aggregation of site performance metrics</td>
                          <td>730 Days</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Preference Memory</td>
                          <td>Retention of UI layout and AI parameters</td>
                          <td>365 Days</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Strategic Nodes</td>
                          <td>Management of marketing attribution</td>
                          <td>90 Days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="mb-5">
                  <h4 className="policy-section-title">04. User Governance</h4>
                  <p className="text-glass">
                    You maintain complete sovereignty over your local data storage. You may reset your cookie 
                    registry via browser configurations at any time. However, be advised that 
                    restricting "Essential" cookies will terminate the platform's ability to maintain 
                    secure neural processing sessions.
                  </p>
                </section>

                {/* Contact Footer */}
                <div className="contact-pill mt-5">
                  <div>
                    <h6 className="text-white mb-1">Privacy Support Desk</h6>
                    <p className="small text-white-50 mb-0">Direct access to our Data Protection Officer.</p>
                  </div>
                  <a href="mailto:privacy@genius.ai" className="btn btn-outline-info btn-sm rounded-pill px-4">
                    Contact Legal Node
                  </a>
                </div>

              </div>
            </div>
            
            <div className="text-center mt-5">
              <p className="small text-white-50" style={{opacity: 0.4}}>
                Compliance Version 2.1.0 // Fully SHA-256 Encrypted Session Logs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;