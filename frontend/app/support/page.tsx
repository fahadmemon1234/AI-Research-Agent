'use client';

import Head from 'next/head';

const SupportPage = () => {
  return (
    <div className="min-vh-100 luxury-bg" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
      <style jsx>{`
        .luxury-bg {
          background: radial-gradient(circle at top left, #0d1b2a 0%, #020408 100%);
          color: #fff;
        }

        .support-hero {
          margin-bottom: 60px;
        }

        .premium-search {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          padding: 15px 30px;
          backdrop-filter: blur(10px);
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: 0.3s;
        }

        .premium-search:focus-within {
          border-color: #00d2ff;
          box-shadow: 0 0 30px rgba(0, 210, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
        }

        .search-input {
          background: transparent;
          border: none;
          color: white;
          width: 100%;
          outline: none;
          font-size: 1.1rem;
        }

        .support-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 32px;
          padding: 40px;
          height: 100%;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(20px);
        }

        .support-card:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.04);
          border-color: #00d2ff;
        }

        .icon-box {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, rgba(0, 210, 255, 0.1) 0%, rgba(0, 210, 255, 0) 100%);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 25px;
          color: #00d2ff;
          font-size: 1.5rem;
          border: 1px solid rgba(0, 210, 255, 0.2);
        }

        .guide-link {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          display: block;
          padding: 8px 0;
          transition: 0.2s;
          font-size: 0.95rem;
        }

        .guide-link:hover {
          color: #00d2ff;
          padding-left: 5px;
        }

        .contact-pill {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: 0.3s;
        }

        .contact-pill:hover {
          background: rgba(0, 210, 255, 0.05);
          border-color: rgba(0, 210, 255, 0.3);
        }

        .btn-report {
          background: linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%);
          border: none;
          border-radius: 100px;
          padding: 12px 35px;
          font-weight: 700;
          letter-spacing: 1px;
          transition: 0.3s;
          color: white;
        }

        .btn-report:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 20px rgba(0, 210, 255, 0.3);
        }
      `}</style>

      <Head>
        <title>Support Concierge | Genius.AI</title>
      </Head>

      <div className="container">
        {/* Hero Section */}
        <div className="text-center support-hero">
          <h1 className="display-4 fw-bold mb-3" style={{ background: 'linear-gradient(to bottom, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            How can we assist you?
          </h1>
          <p className="text-white-50 mb-5">Experience elite technical support for your AI-driven intelligence.</p>
          
          <div className="premium-search">
            <i className="bi bi-search text-white-50"></i>
            <input type="text" className="search-input" placeholder="Search for documentation, guides, or help..." />
          </div>
        </div>

        <div className="row g-4">
          {/* Getting Started */}
          <div className="col-md-6 col-lg-4">
            <div className="support-card">
              <div className="icon-box">
                <i className="bi bi-rocket-takeoff"></i>
              </div>
              <h4 className="text-white mb-3 fw-bold">Onboarding</h4>
              <p className="text-white-50 small mb-4">Master the foundations of Genius.AI with our tailored deployment guides.</p>
              <div className="links">
                <a href="#" className="guide-link">Initialize Account Protocols</a>
                <a href="#" className="guide-link">Document Ingestion Guide</a>
                <a href="#" className="guide-link">Neural Search Optimization</a>
                <a href="#" className="guide-link">Team Collaboration Setup</a>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="col-md-6 col-lg-4">
            <div className="support-card">
              <div className="icon-box">
                <i className="bi bi-patch-question"></i>
              </div>
              <h4 className="text-white mb-3 fw-bold">Intelligence Base</h4>
              <p className="text-white-50 small mb-4">Rapid answers to technical inquiries regarding system capabilities.</p>
              <div className="links">
                <a href="#" className="guide-link">Supported Data Formats</a>
                <a href="#" className="guide-link">Encryption & Security FAQ</a>
                <a href="#" className="guide-link">API Integration Limits</a>
                <a href="#" className="guide-link">Billing & Subscription</a>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="col-lg-4">
            <div className="support-card">
              <div className="icon-box">
                <i className="bi bi-headset"></i>
              </div>
              <h4 className="text-white mb-3 fw-bold">Direct Access</h4>
              <p className="text-white-50 small mb-4">Connect with our specialized technical agents 24/7.</p>
              
              <div className="contact-pill">
                <i className="bi bi-chat-fill text-info"></i>
                <div>
                  <div className="small text-white-50">Live Assistance</div>
                  <div className="fw-bold">Available Now</div>
                </div>
              </div>

              <div className="contact-pill">
                <i className="bi bi-envelope-at-fill text-info"></i>
                <div>
                  <div className="small text-white-50">Email Support</div>
                  <div className="fw-bold">support@genius.ai</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Section */}
        <div className="mt-5 text-center p-5 rounded-5" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <h5 className="text-white mb-3">Encountered a Technical Friction?</h5>
          <p className="text-white-50 mb-4 small mx-auto" style={{maxWidth: '500px'}}>
            Our engineering team is ready to analyze and resolve any system bugs you encounter. 
            Submit a detailed report for prioritized resolution.
          </p>
          <button className="btn-report">REPORT AN ISSUE</button>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;