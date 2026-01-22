'use client';

const Footer = () => {
  return (
    <footer className="footer-genius position-relative overflow-hidden">
      <style jsx>{`
        /* Global Font & Base Styles */
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;500;800&display=swap');

        .footer-genius {
          background-color: #020408;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding-top: 100px;
          padding-bottom: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Subtle Glow matching HomePage */
        .footer-glow-blob {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(67, 97, 238, 0.07) 0%, rgba(0,0,0,0) 70%);
          filter: blur(60px);
          bottom: -250px;
          right: -100px;
          z-index: 0;
          pointer-events: none;
        }

        /* Typography */
        .footer-logo {
          font-weight: 800;
          letter-spacing: -1.5px;
          font-size: 1.6rem;
          background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.6) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-label {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #00d2ff;
          margin-bottom: 1.8rem;
          display: block;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.45) !important;
          font-size: 0.95rem;
          font-weight: 400;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          display: block;
          margin-bottom: 1rem;
        }

        .footer-link:hover {
          color: #fff !important;
          transform: translateX(8px);
        }

        /* Glassmorphism Bento Card for Newsletter */
        .newsletter-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          border-radius: 32px;
          padding: 35px;
        }

        .luxury-input-group {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 100px;
          padding: 6px 6px 6px 22px;
          transition: 0.4s;
        }

        .luxury-input-group:focus-within {
          border-color: rgba(0, 210, 255, 0.5);
          background: rgba(255, 255, 255, 0.05);
        }

        .luxury-input {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 0.9rem;
          outline: none;
          width: 100%;
        }

        .btn-subscribe {
          background: #ffffff;
          color: #000;
          border-radius: 100px;
          padding: 12px 28px;
          font-weight: 700;
          font-size: 0.8rem;
          border: none;
          transition: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .btn-subscribe:hover {
          transform: scale(1.05);
          background: #00d2ff;
          color: #fff;
        }

        /* Social Icons */
        .social-circle {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.4);
          transition: 0.4s;
        }

        .social-circle:hover {
          background: #fff;
          color: #000;
          transform: translateY(-8px) rotate(8deg);
          border-color: transparent;
        }

        /* Status Badge */
        .status-badge {
          background: rgba(0, 255, 136, 0.05);
          color: #00ff88;
          border: 1px solid rgba(0, 255, 136, 0.1);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 8px 18px;
          border-radius: 100px;
        }

        .pulse-dot {
          width: 7px;
          height: 7px;
          background: #00ff88;
          border-radius: 50%;
          display: inline-block;
          margin-right: 10px;
          box-shadow: 0 0 10px #00ff88;
          animation: pulse-animation 2s infinite;
        }

        @keyframes pulse-animation {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* Decorative Glow */}
      <div className="footer-glow-blob"></div>

      <div className="container position-relative">
        <div className="row g-5">
          {/* Brand Info */}
          <div className="col-lg-5">
            <div className="mb-4 d-flex align-items-center">
              <span className="footer-logo">GENIUS<span style={{color: '#00d2ff'}}>AI</span></span>
            </div>
            <p className="text-white-50 mb-5 pe-lg-5" style={{ lineHeight: '1.9', fontSize: '1rem', maxWidth: '450px' }}>
              Building the next generation of artificial intelligence tools for document synthesis and real-time knowledge retrieval.
            </p>
            <div className="d-flex gap-3">
              {['twitter-x', 'linkedin', 'discord', 'github'].map((icon) => (
                <a key={icon} href="#" className="social-circle text-decoration-none">
                  <i className={`bi bi-${icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="col-6 col-md-3 col-lg-2">
            <span className="footer-label">Platform</span>
            <ul className="list-unstyled">
              <li><a href="#" className="footer-link text-decoration-none">Core Engine</a></li>
              <li><a href="#" className="footer-link text-decoration-none">Security</a></li>
              <li><a href="#" className="footer-link text-decoration-none">Pricing</a></li>
              <li><a href="#" className="footer-link text-decoration-none">Beta Access</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <span className="footer-label">Company</span>
            <ul className="list-unstyled">
              <li><a href="#" className="footer-link text-decoration-none">Our Vision</a></li>
              <li><a href="#" className="footer-link text-decoration-none">Legal</a></li>
              <li><a href="#" className="footer-link text-decoration-none">Privacy</a></li>
              <li><a href="#" className="footer-link text-decoration-none">Support</a></li>
            </ul>
          </div>

          {/* Newsletter Bento Card */}
          <div className="col-lg-3">
            <div className="newsletter-card h-100">
              <span className="footer-label mb-3" style={{ color: '#fff' }}>Newsletter</span>
              <p className="text-white-50 small mb-4">Subscribe for technical breakthroughs.</p>
              <div className="luxury-input-group d-flex align-items-center">
                <input type="email" className="luxury-input" placeholder="Your email" />
                <button className="btn-subscribe">Join</button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider matching HomePage style */}
        <hr className="my-5 opacity-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

        {/* Bottom Section */}
        <div className="row align-items-center pt-2">
          <div className="col-md-6 text-center text-md-start">
            <p className="small text-white-50 mb-0" style={{ letterSpacing: '0.3px', opacity: 0.6 }}>
              &copy; {new Date().getFullYear()} Genius AI Labs. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-4 mt-md-0">
            <div className="status-badge d-inline-flex align-items-center">
              <span className="pulse-dot"></span>
              SYSTEMS OPERATIONAL
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;