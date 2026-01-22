'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { getDocuments, deleteDocument } from '../../lib/api-client';

interface Document {
  id: number;
  filename: string;
  file_path: string;
  file_size: number;
  upload_date: string;
  status: string;
  pages_count?: number;
}

const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const docs = await getDocuments();
        setDocuments(docs);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [isAuthenticated, router]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this intelligence asset?')) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteDocument(id);
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete document');
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-info spinner-border-sm me-2"></div>
        <span className="text-white-50 small tracking-widest uppercase">Indexing...</span>
      </div>
    );
  }

  return (
    <div className="intelligence-repository">
      <style jsx>{`
        .intelligence-repository {
          background: transparent;
        }

        .luxury-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 8px;
        }

        .luxury-table th {
          background: transparent;
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          padding: 10px 20px;
          border: none;
        }

        .luxury-table td {
          background: rgba(255, 255, 255, 0.02);
          color: rgba(255, 255, 255, 0.8);
          padding: 18px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.85rem;
          vertical-align: middle;
        }

        .luxury-table td:first-child {
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }

        .luxury-table td:last-child {
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }

        .status-badge {
          font-size: 0.6rem;
          font-weight: 900;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 4px;
          letter-spacing: 1px;
        }

        .status-ready { background: rgba(0, 255, 204, 0.1); color: #00ffcc; }
        .status-processing { background: rgba(255, 193, 7, 0.1); color: #ffc107; }
        .status-error { background: rgba(255, 71, 87, 0.1); color: #ff4757; }

        .btn-delete-icon {
          background: transparent;
          border: 1px solid rgba(255, 71, 87, 0.2);
          color: #ff4757;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .btn-delete-icon:hover:not(:disabled) {
          background: #ff4757;
          color: white;
          box-shadow: 0 0 15px rgba(255, 71, 87, 0.4);
        }

        .empty-state {
          padding: 80px 20px;
          text-align: center;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: 24px;
        }
      `}</style>

      {error && (
        <div className="alert border-0 bg-danger bg-opacity-10 text-danger small mb-4">
          <i className="bi bi-exclamation-octagon me-2"></i> {error}
        </div>
      )}

      {documents.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-cloud-upload opacity-20 fs-1 mb-3 d-block"></i>
          <p className="text-white-50 small tracking-widest uppercase m-0">No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Identifier</th>
                <th>Size</th>
                <th>Status</th>
                <th>Synced</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-file-earmark-text me-3 opacity-50 text-info"></i>
                      <span className="text-truncate fw-bold" style={{maxWidth: '250px'}}>{doc.filename}</span>
                    </div>
                  </td>
                  <td className="text-white-50">{formatFileSize(doc.file_size)}</td>
                  <td>
                    <span className={`status-badge ${
                      doc.status === 'ready' ? 'status-ready' :
                      doc.status === 'processing' ? 'status-processing' : 'status-error'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="text-white-50">{formatDate(doc.upload_date)}</td>
                  <td>
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn-delete-icon"
                        onClick={() => handleDelete(doc.id)}
                        disabled={deletingId === doc.id}
                        title="Delete Intelligence"
                      >
                        {deletingId === doc.id ? 
                          <span className="spinner-border spinner-border-sm"></span> : 
                          <i className="bi bi-trash3"></i>
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DocumentList;