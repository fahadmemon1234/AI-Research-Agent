'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context';
import Link from 'next/link';

const HomePage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', background: '#020408' }}>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      <style jsx global>{`
        .home-wrapper {
          min-height: 100vh;
          background-color: #020408;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          padding-top: 80px; /* Navbar space */
        }

        .luxury-heading {
          font-weight: 800;
          letter-spacing: -3px;
          line-height: 1;
          background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.6) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Modern Glow Orbs */
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          z-index: 0;
          pointer-events: none;
        }

        .luxury-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 32px !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
        }

        .luxury-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(0, 210, 255, 0.2);
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
        }

        .btn-luxury-primary {
          background: #ffffff;
          color: #000;
          border-radius: 100px;
          padding: 16px 40px;
          font-weight: 700;
          transition: 0.3s ease;
          border: none;
          text-decoration: none;
          display: inline-block;
        }

        .btn-luxury-primary:hover {
          background: #00d2ff;
          color: #fff;
          transform: scale(1.05);
          box-shadow: 0 10px 30px rgba(0, 210, 255, 0.3);
        }

        .btn-luxury-outline {
          background: rgba(255, 255, 255, 0.03);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          padding: 16px 40px;
          font-weight: 600;
          transition: 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .btn-luxury-outline:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: #fff;
          color: #fff;
        }

        .stat-item {
          border-right: 1px solid rgba(255,255,255,0.1);
          padding: 0 30px;
        }

        .stat-item:last-child {
          border-right: none;
        }
      `}</style>

      {/* Background Decor */}
      <div className="glow-orb" style={{ top: '10%', left: '-10%', width: '400px', height: '400px', background: 'rgba(0, 210, 255, 0.08)' }}></div>
      <div className="glow-orb" style={{ bottom: '10%', right: '-10%', width: '500px', height: '500px', background: 'rgba(112, 0, 255, 0.08)' }}></div>

      <div className="container position-relative py-5">
        {/* Hero Section */}
        <div className="row justify-content-center text-center py-5">
          <div className="col-lg-10 mt-lg-5">
            <div className="d-inline-flex align-items-center mb-4 px-3 py-1 rounded-pill" 
                 style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="badge rounded-circle bg-info p-1 me-2" style={{width: '6px', height: '6px', display: 'inline-block'}}> </span>
              <span style={{ fontSize: '0.75rem', letterSpacing: '1.5px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                Next-Gen AI Interface v2.0
              </span>
            </div>
            
            <h1 className="display-2 luxury-heading mb-4">
              Intelligence beyond <br className="d-none d-md-block" /> conventional search.
            </h1>
            
            <p className="lead mb-5 mx-auto text-white-50" style={{ maxWidth: '700px', fontWeight: '400', lineHeight: '1.8' }}>
              Upload your library and engage in fluid conversations with your data. 
              Our neural engine understands context, nuance, and logic.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              {!isAuthenticated ? (
                <>
                  <Link href="/auth/login" className="btn-luxury-primary">
                    Begin Journey
                  </Link>
                  <Link href="/auth/register" className="btn-luxury-outline">
                    Explore Features
                  </Link>
                </>
              ) : (
                <Link href="/dashboard" className="btn-luxury-primary">
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="row mt-5 g-4">
          <FeatureCard 
            icon="bi-stars" 
            title="Instant Synthesis" 
            desc="AI that doesn't just find text, it understands context and summarizes complex data instantly."
          />
          <FeatureCard 
            icon="bi-shield-lock" 
            title="Neural Security" 
            desc="Your data is isolated and encrypted. We provide enterprise-grade privacy for your intellectual assets."
          />
          <FeatureCard 
            icon="bi-link-45deg" 
            title="Deep Citations" 
            desc="Every response includes precise citations, linking back to the exact paragraph in your source files."
          />
        </div>

        {/* Minimal Stats */}
        <div className="row mt-5 pt-5 pb-5">
          <div className="col-12 d-flex justify-content-center flex-wrap gap-4 text-center">
             <div className="stat-item">
               <h4 className="fw-bold mb-0">1M+</h4>
               <small className="text-white-50 letter-spacing-1">ANALYSES</small>
             </div>
             <div className="stat-item">
               <h4 className="fw-bold mb-0">99.9%</h4>
               <small className="text-white-50">ACCURACY</small>
             </div>
             <div className="stat-item">
               <h4 className="fw-bold mb-0">256-bit</h4>
               <small className="text-white-50">ENCRYPTED</small>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="col-lg-4 col-md-6">
    <div className="card luxury-card h-100 p-4 border-0">
      <div className="card-body">
        <div className="mb-4 d-inline-flex align-items-center justify-content-center rounded-3" 
             style={{ width: '50px', height: '50px', background: 'rgba(0, 210, 255, 0.1)', color: '#00d2ff' }}>
          <i className={`bi ${icon}`} style={{ fontSize: '1.5rem' }}></i>
        </div>
        <h5 className="fw-bold mb-3 text-white">{title}</h5>
        <p className="text-white-50 small mb-0" style={{ lineHeight: '1.6' }}>{desc}</p>
      </div>
    </div>
  </div>
);

export default HomePage;