'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <>
      <style jsx>{`
        /* Global Font & Theme */
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;500;800&display=swap');

        .luxury-footer {
          background-color: #020408;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding-top: 80px;
          padding-bottom: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
        }

        /* Subtle Background Glow */
        .footer-glow {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(0, 210, 255, 0.05) 0%, rgba(0,0,0,0) 70%);
          top: -200px;
          left: -100px;
          pointer-events: none;
        }

        /* Brand Styling */
        .footer-logo {
          font-weight: 800;
          font-size: 1.6rem;
          letter-spacing: -1px;
          background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.6) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-heading {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #00d2ff !important;
          margin-bottom: 1.8rem;
        }

        /* Link Animations */
        .footer-link {
          color: rgba(255, 255, 255, 0.45) !important;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          display: block;
          margin-bottom: 0.8rem;
          text-decoration: none;
        }

        .footer-link:hover {
          color: #fff !important;
          transform: translateX(6px);
        }

        /* Social Icons - Premium Squircle Style */
        .social-btn {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.1rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-decoration: none;
        }

        .social-btn:hover {
          background: #ffffff;
          color: #000000;
          transform: translateY(-8px) rotate(8deg);
          box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
        }

        /* Newsletter Bento Card */
        .newsletter-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          border-radius: 28px;
          padding: 30px;
        }

        .premium-input-group {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          padding: 5px 5px 5px 20px;
          display: flex;
          align-items: center;
          transition: 0.3s;
        }

        .premium-input-group:focus-within {
          border-color: #00d2ff;
          background: rgba(255, 255, 255, 0.08);
        }

        .premium-input {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 0.9rem;
          outline: none;
          width: 100%;
        }

        .btn-subscribe {
          background: #fff;
          color: #000;
          border: none;
          border-radius: 100px;
          padding: 10px 25px;
          font-weight: 700;
          font-size: 0.85rem;
          transition: 0.3s;
        }

        .btn-subscribe:hover {
          background: #00d2ff;
          color: #fff;
          transform: scale(1.05);
        }

        /* Status Badge */
        .status-dot {
          width: 8px;
          height: 8px;
          background: #00ff88;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
          box-shadow: 0 0 12px #00ff88;
        }
      `}</style>

      <footer className="luxury-footer">
        <div className="footer-glow"></div>
        
        <div className="container">
          <div className="row g-5">
            {/* Branding Section */}
            <div className="col-lg-4 col-md-12">
              <div className="footer-logo mb-4">
                GENIUS<span style={{color: '#00d2ff'}}>.AI</span>
              </div>
              <p className="text-white-50 mb-4 pe-lg-5" style={{ lineHeight: '1.8' }}>
                Transform your static documents into an interactive brain. Get instant insights using our neural-powered engine.
              </p>
              
              {/* Social Media Icons - Bootstrap Icons Used */}
              <div className="d-flex gap-3">
                <a href="#" className="social-btn"><i className="bi bi-twitter-x"></i></a>
                <a href="#" className="social-btn"><i className="bi bi-linkedin"></i></a>
                <a href="#" className="social-btn"><i className="bi bi-discord"></i></a>
                <a href="#" className="social-btn"><i className="bi bi-github"></i></a>
              </div>
            </div>

            {/* Links Sections */}
            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="footer-heading">Platform</h6>
              <ul className="list-unstyled">
                <li><Link href="/dashboard" className="footer-link">Dashboard</Link></li>
                <li><Link href="/ai-analysis" className="footer-link">AI Analysis</Link></li>
                <li><Link href="/pro-plan" className="footer-link">Pro Plan</Link></li>
                <li><a href="#" className="footer-link">Security</a></li>
              </ul>
            </div>

            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="footer-heading">Company</h6>
              <ul className="list-unstyled">
                <li><Link href="/privacy" className="footer-link">Privacy</Link></li>
                <li><Link href="/terms" className="footer-link">Terms</Link></li>
                <li><Link href="/cookies" className="footer-link">Cookies</Link></li>
                <li><Link href="/support" className="footer-link">Support</Link></li>
              </ul>
            </div>

            {/* Newsletter Bento Box */}
            <div className="col-lg-4">
              <div className="newsletter-card">
                <h6 className="footer-heading mb-3" style={{ color: '#fff' }}>Stay Ahead</h6>
                <p className="small text-white-50 mb-4">Get the latest AI breakthroughs delivered weekly.</p>
                <div className="premium-input-group">
                  <input type="email" className="premium-input" placeholder="Enter your email" />
                  <button className="btn-subscribe">Join</button>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

          {/* Bottom Bar */}
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0 text-white-50 small" style={{ letterSpacing: '0.5px' }}>
                &copy; {new Date().getFullYear()} GENIUS AI LABS. ALL RIGHTS RESERVED.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
              <div className="d-inline-flex align-items-center" style={{ fontSize: '0.7rem', color: '#00ff88', fontWeight: 800 }}>
                <span className="status-dot"></span>
                ALL SYSTEMS OPERATIONAL
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;