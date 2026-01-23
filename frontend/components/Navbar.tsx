'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/auth-context';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <style jsx global>{`
        /* 1. Navbar Container - Floating Style */
        .luxury-nav {
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 24px 0;
          background: transparent;
        }

        .luxury-nav.scrolled {
          padding: 12px 0;
          margin-top: 10px; /* Floating look */
        }

        /* 2. Glassmorphism Inner Box */
        .nav-inner-container {
          transition: all 0.5s ease;
          border-radius: 0px;
          padding: 10px 0;
        }

        .scrolled .nav-inner-container {
          background: rgba(2, 4, 8, 0.6);
          backdrop-filter: blur(25px) saturate(200%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 100px; /* Pill shape when scrolling */
          padding: 8px 24px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }

        /* 3. Navigation Links */
        .nav-link-custom {
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.5) !important;
          transition: all 0.4s ease;
          padding: 8px 18px !important;
          position: relative;
        }

        .nav-link-custom:hover, .nav-link-custom.active {
          color: #fff !important;
          transform: translateY(-1px);
        }

        /* Elegant Underline Animation */
        .nav-link-custom::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #00d2ff, #7000ff);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateX(-50%);
          border-radius: 10px;
        }

        .nav-link-custom:hover::after, .nav-link-custom.active::after {
          width: 15px;
        }

        /* 4. Luxury Buttons */
        .btn-luxury-outline {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          border-radius: 100px;
          padding: 10px 24px;
          font-size: 0.8rem;
          font-weight: 600;
          transition: 0.4s;
        }

        .btn-luxury-outline:hover {
          background: #fff;
          color: #000;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255,255,255,0.1);
        }

        .btn-premium-gradient {
          background: linear-gradient(135deg, #00d2ff 0%, #7000ff 100%);
          color: #fff !important;
          border-radius: 100px;
          padding: 10px 24px;
          font-size: 0.8rem;
          font-weight: 700;
          border: none;
          box-shadow: 0 10px 20px rgba(0, 210, 255, 0.2);
          transition: 0.4s;
        }

        .btn-premium-gradient:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 30px rgba(0, 210, 255, 0.4);
        }

        /* 5. Dropdown Styling */
        .dropdown-luxury {
          background: rgba(10, 12, 18, 0.95) !important;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 12px;
          margin-top: 15px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
        }

        .dropdown-item-luxury {
          color: rgba(255,255,255,0.6) !important;
          border-radius: 12px;
          padding: 10px 18px;
          font-size: 0.9rem;
          transition: 0.3s;
        }

        .dropdown-item-luxury:hover {
          background: rgba(255,255,255,0.05) !important;
          color: #fff !important;
          transform: translateX(5px);
        }
      `}</style>

      <nav className={`navbar navbar-expand-lg fixed-top luxury-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-inner-container d-flex align-items-center w-100">
            {/* Brand Logo */}
            <Link href="/" className="navbar-brand d-flex align-items-center me-4">
              <div className="me-2 d-flex align-items-center justify-content-center" 
                   style={{ 
                     width: '38px', 
                     height: '38px', 
                     borderRadius: '12px', 
                     background: 'linear-gradient(135deg, #00d2ff, #7000ff)',
                     boxShadow: '0 8px 15px rgba(0, 210, 255, 0.3)'
                   }}>
                <svg width="22" height="22" fill="white" viewBox="0 0 16 16">
                  <path d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5V2h1.5a.5.5 0 0 1 .5.5V4h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-.5.5H12v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-.5.5.5.5 0 0 1-.5-.5V14H2.5a.5.5 0 0 1-.5-.5V12H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2V8H.5a.5.5 0 0 1 0-1H2V6H.5a.5.5 0 0 1 0-1H2V2.5a.5.5 0 0 1 .5-.5H4V.5A.5.5 0 0 1 4.5 0zM4.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3h-7zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3z"/>
                </svg>
              </div>
              <span className="fw-800 text-white brand-logo" style={{ letterSpacing: '-1px' }}>GENIUS<span style={{ color: '#00d2ff' }}>.AI</span></span>
            </Link>

            <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <i className="bi bi-list text-white fs-2"></i>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center">
                <li className="nav-item">
                  <Link href="/" className={`nav-link nav-link-custom ${isActive('/') ? 'active' : ''}`}>Home</Link>
                </li>

                {/* Platform Dropdown */}
                <li className="nav-item dropdown px-lg-2">
                  <a className="nav-link nav-link-custom dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    Platform
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-luxury border-0">
                    <li><Link href="/ai-analysis" className="dropdown-item dropdown-item-luxury">AI Analysis</Link></li>
                    <li><Link href="/pro-plan" className="dropdown-item dropdown-item-luxury">Pro Plan</Link></li>
                    <li><Link href="/pricing" className="dropdown-item dropdown-item-luxury">Pricing</Link></li>
                    <li><hr className="dropdown-divider opacity-10 mx-3" /></li>
                    <li><Link href="/core-engine" className="dropdown-item dropdown-item-luxury">Core Engine</Link></li>
                  </ul>
                </li>

                {isAuthenticated ? (
                  <>
                    <li className="nav-item">
                      <Link href="/dashboard" className={`nav-link nav-link-custom ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
                    </li>
                    <li className="nav-item dropdown px-lg-2">
                      <a className="nav-link nav-link-custom dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        Account
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end dropdown-luxury border-0">
                        <li><Link href="/auth/profile" className="dropdown-item dropdown-item-luxury">Settings</Link></li>
                        <li><hr className="dropdown-divider opacity-10 mx-3" /></li>
                        <li><button className="dropdown-item dropdown-item-luxury text-danger" onClick={() => logout()}>Sign Out</button></li>
                      </ul>
                    </li>
                    <li className="nav-item ms-lg-3">
                      <Link href="/upload" className="btn btn-premium-gradient">
                         New Project
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link href="/auth/login" className={`nav-link nav-link-custom ${isActive('/auth/login') ? 'active' : ''}`}>Sign In</Link>
                    </li>
                    <li className="nav-item ms-lg-3">
                      <Link href="/auth/register" className="btn btn-luxury-outline">Create Account</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;