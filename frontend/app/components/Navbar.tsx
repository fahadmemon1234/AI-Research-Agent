'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // useRouter add kiya
import { useAuth } from '../../lib/auth-context';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); // Initialize router for SPA navigation
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // 1. Scroll Effect Logic
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // 2. Real-time Token Expiry Check (No Reload Logic)
    const checkToken = () => {
      const token = Cookies.get('access_token');

      // Agar user state authenticated hai par token expire/remove ho gaya
      if (isAuthenticated && !token) {
        // Bina page refresh kiye state clear karke login page par redirect karega
        logout();
        router.push('/auth/login');
      }
    };

    // Har 3 second mein background mein check karega
    const authInterval = setInterval(checkToken, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(authInterval); // Cleanup interval
    };
  }, [isAuthenticated, logout, router]);

  const isActive = (path: string) => pathname === path;

  // Premium Navbar JSX Code... (vahi purana design jo aapne diya tha)
  return (
    <>
      <style jsx global>{`
        /* Aapki purani premium styling yahan rahegi */
        .luxury-nav { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); padding: 24px 0; background: transparent; }
        .luxury-nav.scrolled { padding: 12px 0; background: rgba(2, 4, 8, 0.7) !important; backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
        .nav-link-premium { font-size: 0.88rem; color: rgba(255, 255, 255, 0.6) !important; position: relative; }
        .nav-link-premium.active { color: #fff !important; }
        .nav-link-premium.active::after { content: ''; position: absolute; bottom: 2px; left: 50%; width: 15px; height: 2px; background: #00d2ff; transform: translateX(-50%); }
        /* ... baki styles ... */
      `}</style>

      <nav className={`navbar navbar-expand-lg fixed-top luxury-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <Link href="/" className="navbar-brand d-flex align-items-center me-4">
            <div className="logo-box me-2" style={{background: 'linear-gradient(135deg, #00d2ff, #7000ff)', padding: '6px', borderRadius: '10px'}}>
              <svg width="20" height="20" fill="white" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 2.87 0 6.5 0 9.24 1.75 11.5 3 12.5c.86.65 2.6 1.5 3.5 1.5s2.65-.85 3.5-1.5c1.25-1 3-3.26 3-5.5 0-3.63-3.58-6.5-8-6.5zm-.35 11.5c-.58.58-1.7 1-2.65 1-1.75 0-3-1.25-3-3 0-1.75 1.25-3 3-3 .95 0 2.07.42 2.65 1 .48.48.7 1.1.7 1.75 0 .65-.22 1.27-.7 1.75z"/>
              </svg>
            </div>
            <span className="text-white fw-bold brand-text">GENIUS<span style={{color: '#00d2ff'}}>AI</span></span>
          </Link>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link href="/" className={`nav-link-premium nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
              </li>
              
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link href="/dashboard" className={`nav-link-premium nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <button 
                      onClick={() => { logout(); router.push('/auth/login'); }} 
                      className="btn btn-luxury-outline ms-lg-3"
                      style={{border: '1px solid rgba(255,255,255,0.15)', borderRadius: '100px', color: '#fff', padding: '8px 20px'}}
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link href="/auth/login" className={`nav-link-premium nav-link ${isActive('/auth/login') ? 'active' : ''}`}>Sign In</Link>
                  </li>
                  <li className="nav-item ms-lg-3">
                    <Link href="/auth/register" className="btn btn-white rounded-pill px-4 fw-bold" style={{backgroundColor: '#fff', color: '#000'}}>Get Started</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;