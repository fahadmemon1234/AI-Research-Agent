'use client';

import Head from 'next/head';

const ProPlanPage = () => {
  return (
    <div className="min-vh-100 luxury-bg" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
      <style jsx>{`
        .luxury-bg {
          background: radial-gradient(circle at top right, #0a1221 0%, #020408 100%);
          color: #fff;
        }

        .gold-gradient-text {
          background: linear-gradient(135deg, #fff 0%, #00d2ff 50%, #fff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
        }

        /* Hero Card Styling */
        .pro-card {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(25px);
          border-radius: 40px;
          padding: 60px;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
        }

        /* Section Headings with Icon */
        .pro-section-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }

        .pro-icon-box {
          width: 40px;
          height: 40px;
          background: rgba(0, 210, 255, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00d2ff;
          font-size: 1.2rem;
        }

        /* Bento Grid Style for perks */
        .perk-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 35px;
          height: 100%;
          transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .perk-card:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.04);
          border-color: #00d2ff;
          box-shadow: 0 15px 35px rgba(0, 210, 255, 0.1);
        }

        .btn-upgrade {
          background: #fff;
          color: #000;
          font-weight: 900;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 20px 50px;
          border-radius: 100px;
          border: none;
          transition: 0.3s;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
        }

        .btn-upgrade:hover {
          background: #00d2ff;
          color: #fff;
          box-shadow: 0 0 40px rgba(0, 210, 255, 0.5);
          transform: scale(1.05);
        }

        .tier-badge {
          background: linear-gradient(90deg, #00d2ff, #00ff88);
          color: #000;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 4px 12px;
          border-radius: 50px;
          margin-bottom: 15px;
          display: inline-block;
          letter-spacing: 2px;
        }

        .text-muted-custom {
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.8;
          font-size: 0.95rem;
        }
      `}</style>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-11 col-xl-10">
            <div className="pro-card">
              
              {/* Hero Section */}
              <div className="text-center mb-5 pb-5">
                <span className="tier-badge">ELITE ACCESS</span>
                <h1 className="display-4 gold-gradient-text mb-3">Professional Protocol</h1>
                <p className="lead text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
                  Unleash the full potential of Genius AI with unrestricted processing and enterprise-grade intelligence.
                </p>
              </div>

              {/* Main Features */}
              <div className="row g-5 mb-5">
                {[
                  { title: "Priority Neural Processing", icon: "bi-cpu", desc: "Skip the standard queue with dedicated server nodes. Handle multi-gigabyte document sets in real-time." },
                  { title: "Advanced Analytics Engine", icon: "bi-graph-up-arrow", desc: "Predictive modeling and cross-document pattern recognition that identifies risks and opportunities automatically." },
                  { title: "Enterprise API Mesh", icon: "bi-code-slash", desc: "Native connectors for Slack, Teams, and Custom Webhooks. Integrate intelligence directly into your stack." }
                ].map((item, idx) => (
                  <div className="col-md-4" key={idx}>
                    <div className="pro-section-header">
                      <div className="pro-icon-box"><i className={`bi ${item.icon}`}></i></div>
                      <h5 className="text-white mb-0 fw-bold">{item.title}</h5>
                    </div>
                    <p className="text-muted-custom">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Bento Grid Perks */}
              <div className="row g-4 mt-2">
                {[
                  { title: "10,000 Queries", icon: "bi-infinity", val: "10x more than Free" },
                  { title: "Cloud Storage+", icon: "bi-database", val: "50+ Large Doc Capacity" },
                  { title: "Export Suite", icon: "bi-file-earmark-arrow-down", val: "PDF, JSON, CSV & XML" },
                  { title: "Elite Support", icon: "bi-headset", val: "Direct Engineer Access" }
                ].map((perk, i) => (
                  <div className="col-md-6 col-lg-3" key={i}>
                    <div className="perk-card text-center">
                      <i className={`bi ${perk.icon} d-block mb-3`} style={{fontSize: '1.5rem', color: '#00d2ff'}}></i>
                      <h6 className="text-white fw-800 mb-1" style={{fontSize: '0.8rem'}}>{perk.title.toUpperCase()}</h6>
                      <p className="small text-white-50 mb-0">{perk.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Note */}
              <div className="mt-5 p-4 rounded-4 bg-white-05 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <p className="small mb-0 text-white-50">
                  <i className="bi bi-shield-lock-fill me-2 text-success"></i>
                  All Pro Plan communications are secured via AES-256 end-to-end encryption.
                </p>
              </div>

              {/* Final CTA */}
              <div className="text-center mt-5 pt-4">
                <button className="btn-upgrade">Activate Pro Protocol</button>
                <p className="mt-3 small text-white-50">Cancel or downgrade anytime • No hidden nodes</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProPlanPage;