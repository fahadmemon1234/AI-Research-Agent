'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import Link from 'next/link';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { register } = useAuth();

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please provide your full identity (First & Last Name).');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid electronic mail address.');
      return false;
    }
    if (password.length < 8) {
      setError('Security key must be at least 8 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(email, password, firstName, lastName);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. System protocol error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luxury-auth-page">
      <style jsx global>{`
        .luxury-auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #020408;
          position: relative;
          overflow: hidden;
          padding: 20px; /* Login ki tarah padding */
        }

        .luxury-auth-page::before {
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
          max-width: 480px; /* Login card width ke barabar */
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

        .alert-luxury {
          background: rgba(255, 59, 48, 0.1);
          color: #ff3b30;
          border: 1px solid rgba(255, 59, 48, 0.2);
          border-radius: 15px;
          font-size: 0.85rem;
          animation: shake 0.4s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>

      <div className="auth-card">
        <div className="text-center">
          <div className="brand-logo-container">
            <i className="bi bi-person-plus-fill text-white fs-2"></i>
          </div>
          <h2 className="fw-800 text-white mb-2" style={{letterSpacing: '-1.5px'}}>Create Identity</h2>
          <p className="text-white-50 small mb-5">Join the elite intelligence network.</p>
        </div>

        {error && (
          <div className="alert alert-luxury border-0 text-center py-3 mb-4">
            <i className="bi bi-exclamation-octagon-fill me-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="luxury-input-wrap">
            <input
              type="text"
              className="form-control luxury-input"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => {setFirstName(e.target.value); if(error) setError('');}}
              required
            />
            <i className="bi bi-person input-icon"></i>
          </div>

          <div className="luxury-input-wrap">
            <input
              type="text"
              className="form-control luxury-input"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {setLastName(e.target.value); if(error) setError('');}}
              required
            />
            <i className="bi bi-person input-icon"></i>
          </div>

          <div className="luxury-input-wrap">
            <input
              type="email"
              className="form-control luxury-input"
              placeholder="Email Identity"
              value={email}
              onChange={(e) => {setEmail(e.target.value); if(error) setError('');}}
              required
            />
            <i className="bi bi-envelope input-icon"></i>
          </div>

          <div className="luxury-input-wrap">
            <input
              type="password"
              className="form-control luxury-input"
              placeholder="Security Key (Min. 8 chars)"
              value={password}
              onChange={(e) => {setPassword(e.target.value); if(error) setError('');}}
              required
            />
            <i className="bi bi-shield-lock input-icon"></i>
          </div>

          <button type="submit" className="btn btn-luxury-submit w-100 mb-4 shadow-sm" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : (
              'INITIALIZE ACCOUNT'
            )}
          </button>
        </form>

        <div className="text-center mt-2">
          <p className="text-white-50 small mb-0">
            Already registered?{' '}
            <Link href="/auth/login" className="brand-accent">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;