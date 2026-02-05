'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import Link from 'next/link';
import { loginUser } from '../../../lib/api-client';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  // Basic Email Validation Function
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // --- Validation Logic ---
    if (!validateEmail(email)) {
      setError('Please enter a valid email identity.');
      return;
    }

    if (password.length < 6) {
      setError('Security password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {

      const res = await loginUser(email, password);
      await login(res.data.access_token);

      // Check for return URL in query params
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('return');

      // Redirect to dashboard or return URL
      if (returnUrl) {
        router.push(decodeURIComponent(returnUrl));
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access Denied: Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luxury-login-page">
      <style jsx global>{`
        .luxury-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #020408;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        .luxury-login-page::before {
          content: '';
          position: absolute;
          width: 140%;
          height: 140%;
          background: radial-gradient(circle at 50% 50%, rgba(0, 210, 255, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 0% 0%, rgba(112, 0, 255, 0.05) 0%, transparent 40%);
          animation: slowRotate 30s linear infinite;
        }

        @keyframes slowRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.015);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 40px;
          padding: 60px 45px;
          width: 100%;
          max-width: 480px;
          position: relative;
          z-index: 5;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
        }

        .luxury-input-wrap {
          position: relative;
          margin-bottom: 25px;
        }

        .luxury-input {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 18px !important;
          padding: 16px 20px 16px 50px !important;
          color: #fff !important;
          font-size: 0.95rem;
          transition: all 0.4s ease;
        }

        /* Placeholder Color Fix */
        .luxury-input::placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }

        .luxury-input:focus {
          border-color: rgba(0, 210, 255, 0.5) !important;
          background: rgba(255, 255, 255, 0.06) !important;
          box-shadow: 0 0 20px rgba(0, 210, 255, 0.1) !important;
          outline: none;
        }

        .input-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.2);
          transition: 0.3s;
          font-size: 1.1rem;
        }

        .luxury-input:focus + .input-icon {
          color: #00d2ff;
        }

        .btn-luxury-submit {
          background: #ffffff;
          color: #000000;
          border-radius: 18px;
          padding: 16px;
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: 1px;
          border: none;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          margin-top: 15px;
        }

        .btn-luxury-submit:hover:not(:disabled) {
          background: #00d2ff;
          color: #000000;
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0, 210, 255, 0.3);
        }

        .btn-luxury-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .luxury-link {
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none !important;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .luxury-link:hover {
          color: #fff;
        }

        .brand-accent {
          color: #00d2ff;
          font-weight: 700;
          text-decoration: none !important;
        }

        .brand-logo-container {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #00d2ff 0%, #7000ff 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 30px;
          box-shadow: 0 10px 25px rgba(0, 210, 255, 0.2);
        }

        /* Error Shake Animation */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .alert-luxury {
          background: rgba(255, 59, 48, 0.1);
          color: #ff3b30;
          border: 1px solid rgba(255, 59, 48, 0.2);
          border-radius: 15px;
          font-size: 0.85rem;
          animation: shake 0.4s ease-in-out;
        }
      `}</style>

      <div className="auth-card">
        <div className="text-center">
          <div className="brand-logo-container">
            <i className="bi bi-fingerprint text-white fs-2"></i>
          </div>
          <h2 className="fw-800 text-white mb-2" style={{letterSpacing: '-1.5px'}}>Access Portal</h2>
          <p className="text-white-50 small mb-5">Securely sign in to your AI Knowledge base.</p>
        </div>

        {error && (
          <div className="alert alert-luxury border-0 text-center py-3 mb-4">
            <i className="bi bi-exclamation-octagon-fill me-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="luxury-input-wrap">
            <input
              type="email"
              className="form-control luxury-input"
              placeholder="Email Identity"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if(error) setError(''); // Clear error on type
              }}
              required
            />
            <i className="bi bi-envelope input-icon"></i>
          </div>

          <div className="luxury-input-wrap">
            <input
              type="password"
              className="form-control luxury-input"
              placeholder="Security Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if(error) setError('');
              }}
              required
            />
            <i className="bi bi-shield-lock input-icon"></i>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4 px-1">
            <div className="form-check">
              <input className="form-check-input bg-transparent border-secondary" type="checkbox" id="rememberMe" />
              <label className="form-check-label text-white-50 small ms-1" htmlFor="rememberMe" style={{cursor: 'pointer'}}>
                Trust this device
              </label>
            </div>
            <Link href="#" className="luxury-link">Lost access?</Link>
          </div>

          <button type="submit" className="btn btn-luxury-submit w-100 mb-4 shadow-sm" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : (
              'INITIALIZE LOGIN'
            )}
          </button>
        </form>

        <div className="text-center mt-2">
          <p className="text-white-50 small mb-0">
            No account yet?{' '}
            <Link href="/auth/register" className="brand-accent">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;