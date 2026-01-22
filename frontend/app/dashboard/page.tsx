'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { getUserStats } from '../../lib/api-client';
import Link from 'next/link';
import DocumentList from '../../components/documents/DocumentList';

interface UserStats {
  total_documents: number;
  total_queries: number;
  last_query_date: string;
  top_documents: Array<{
    id: number;
    name: string;
    query_count: number;
  }>;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const statsData = await getUserStats();
        setStats(statsData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch intelligence stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, router]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() + ' @ ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase();
  };

  if (!isAuthenticated) return null;

  return (
    <div className="luxury-dashboard">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

        .luxury-dashboard {
          min-height: 100vh;
          background-color: #020408;
          /* Grid Pattern */
          background-image: 
            linear-gradient(rgba(0, 210, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 210, 255, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          padding: 120px 20px 60px 20px;
          position: relative;
          overflow-x: hidden;
        }

        /* Ambient Glow - Back Layer */
        .luxury-dashboard::before {
          content: '';
          position: fixed;
          top: -10%; 
          left: 50%; 
          transform: translateX(-50%);
          width: 80%; 
          height: 600px;
          /* Glow ko piche bhejne ke liye radial gradient */
          background: radial-gradient(circle at 50% 0%, rgba(0, 210, 255, 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0; /* Background layer */
        }

        /* Content wrappers to ensure they sit on top of the glow */
        .container {
          position: relative;
          z-index: 2;
        }

        .welcome-section {
          margin-bottom: 60px;
        }

        .welcome-text {
          font-size: 3.5rem;
          font-weight: 900;
          letter-spacing: -2.5px;
          line-height: 1;
        }

        .accent-cyan {
          color: #00d2ff;
          text-shadow: 0 0 30px rgba(0, 210, 255, 0.2);
        }

        .sub-status {
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.1rem;
          margin-top: 10px;
        }

        /* Brand Action Buttons */
        .btn-brand-primary {
          background: #ffffff;
          color: #000000;
          border-radius: 50px;
          padding: 14px 32px;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 1px;
          border: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .btn-brand-primary:hover {
          background: #00d2ff;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 210, 255, 0.3);
        }

        .btn-brand-outline {
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50px;
          padding: 14px 32px;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 1px;
          transition: all 0.3s ease;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 60px;
        }

        .stat-module {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px); /* Subtle glass effect */
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 40px 20px;
          text-align: center;
          transition: border-color 0.3s ease;
        }

        .stat-module:hover {
          border-color: rgba(0, 210, 255, 0.3);
        }

        .stat-value {
          font-size: 2.2rem;
          font-weight: 900;
          margin-bottom: 5px;
          color: #fff;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .hub-title {
          font-size: 0.8rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 4px;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .content-card {
          background: rgba(6, 8, 12, 0.6);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 30px;
          padding: 30px;
        }

        .priority-table th {
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.65rem;
          text-transform: uppercase;
          padding-bottom: 20px;
        }

        .query-badge {
          color: #00d2ff;
          font-weight: 900;
        }
      `}</style>

      <div className="container">
        {/* Header Section */}
        <div className="row align-items-center welcome-section g-4">
          <div className="col-lg-8">
            <h1 className="welcome-text">
              CORE <span className="accent-cyan">INTELLIGENCE</span>
            </h1>
            <p className="sub-status">
              Welcome back, <span className="text-white fw-bold">{user?.first_name || 'USER'}</span>. All systems operational.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <div className="d-flex gap-3 justify-content-lg-end">
              <Link href="/upload" className="btn btn-brand-primary">
                <i className="bi bi-plus-lg"></i> Deploy Data
              </Link>
              <Link href="/chat" className="btn btn-brand-outline">
                Console
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5 mt-5">
            <div className="spinner-border text-info mb-3" role="status"></div>
            <div className="stat-label">Calibrating Neural Link...</div>
          </div>
        ) : (
          <>
            {/* Modular Stats */}
            {stats && (
              <div className="stats-grid">
                <div className="stat-module">
                  <div className="stat-value">{stats.total_documents}</div>
                  <div className="stat-label">Knowledge Base</div>
                </div>
                <div className="stat-module">
                  <div className="stat-value">{stats.total_queries}</div>
                  <div className="stat-label">Neural Queries</div>
                </div>
                <div className="stat-module">
                  <div className="stat-value" style={{fontSize: '1.2rem', marginTop: '15px'}}>
                    {stats.last_query_date ? formatDate(stats.last_query_date) : 'NEW UNIT'}
                  </div>
                  <div className="stat-label">Last Synchronization</div>
                </div>
                <div className="stat-module">
                  <div className="stat-value" style={{color: '#00ffcc'}}>SECURE</div>
                  <div className="stat-label">Network Status</div>
                </div>
              </div>
            )}

            <div className="row g-5">
              <div className="col-xl-8">
                <div className="hub-title">Knowledge Repository</div>
                <div className="content-card">
                  <DocumentList />
                </div>
              </div>

              <div className="col-xl-4">
                <div className="hub-title">Priority Streams</div>
                <div className="content-card">
                  {stats?.top_documents && stats.top_documents.length > 0 ? (
                    <table className="priority-table w-100">
                      <thead>
                        <tr>
                          <th>IDENTIFIER</th>
                          <th className="text-end">FREQ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.top_documents.map((doc) => (
                          <tr key={doc.id} style={{borderTop: '1px solid rgba(255,255,255,0.03)'}}>
                            <td className="py-3 text-truncate" style={{maxWidth: '180px', color: 'rgba(255,255,255,0.8)'}}>
                              {doc.name}
                            </td>
                            <td className="py-3 text-end query-badge">{doc.query_count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-4 opacity-25 small uppercase letter-spacing-2">
                      No data streams active
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;