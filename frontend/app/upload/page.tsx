'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { uploadDocument } from '../../lib/api-client';
import Link from 'next/link';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  const validateAndSetFile = (file: File) => {
    const validTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError('INVALID PROTOCOL: PLEASE UPLOAD PDF, TXT, OR DOCX.');
      return;
    }
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('DATA OVERLOAD: FILE EXCEEDS 100MB LIMIT.');
      return;
    }
    setSelectedFile(file);
    setError('');
    setMessage('');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => (prev >= 95 ? prev : prev + 5));
      }, 200);

      await uploadDocument(selectedFile);
      
      clearInterval(interval);
      setUploadProgress(100);
      setMessage('CORE DATA SYNCHRONIZED SUCCESSFULLY.');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'UPLINK FAILED.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <style jsx>{`
        .upload-container {
          min-height: 100vh;
          background: #020408;
          background-image: radial-gradient(circle at 50% -20%, rgba(0, 210, 255, 0.15) 0%, transparent 50%);
          padding: 120px 20px;
          color: #fff;
          font-family: 'Inter', sans-serif;
        }

        .upload-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 32px;
          padding: 40px;
          max-width: 700px;
          margin: 0 auto;
        }

        .drop-zone {
          border: 2px dashed ${isDragging ? '#00d2ff' : 'rgba(255, 255, 255, 0.1)'};
          background: ${isDragging ? 'rgba(0, 210, 255, 0.05)' : 'rgba(255, 255, 255, 0.01)'};
          border-radius: 24px;
          padding: 60px 20px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          margin-bottom: 30px;
        }

        .drop-zone:hover {
          border-color: rgba(0, 210, 255, 0.5);
          background: rgba(255, 255, 255, 0.02);
        }

        .brand-title {
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -1.5px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .accent { color: #00d2ff; }

        .progress-container {
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          overflow: hidden;
          margin: 20px 0;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #00d2ff, #00ffcc);
          box-shadow: 0 0 15px rgba(0, 210, 255, 0.5);
          transition: width 0.3s ease;
        }

        .btn-deploy {
          background: #fff;
          color: #000;
          border: none;
          padding: 16px 40px;
          border-radius: 50px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.85rem;
          transition: all 0.3s ease;
          width: 100%;
        }

        .btn-deploy:hover:not(:disabled) {
          background: #00d2ff;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 210, 255, 0.3);
        }

        .btn-deploy:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .file-info {
          background: rgba(0, 210, 255, 0.05);
          border: 1px solid rgba(0, 210, 255, 0.1);
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
      `}</style>

      <div className="upload-card">
        <div className="text-center mb-5">
          <h1 className="brand-title">DEPLOY <span className="accent">KNOWLEDGE</span></h1>
          <p className="text-white-50">Upload your assets to the neural engine for processing.</p>
        </div>

        <div 
          className="drop-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <i className={`bi ${isUploading ? 'bi-cloud-arrow-up' : 'bi-plus-circle'} fs-1 accent mb-3 d-block`}></i>
          <h5 className="fw-bold mb-1">
            {isDragging ? 'RELEASE TO UPLOAD' : 'SELECT DATA UNIT'}
          </h5>
          <p className="text-white-50 small">DRAG & DROP OR CLICK TO BROWSE</p>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleFileChange}
          />
        </div>

        {selectedFile && !isUploading && (
          <div className="file-info">
            <i className="bi bi-file-earmark-check accent fs-4"></i>
            <div>
              <div className="small fw-bold">{selectedFile.name.toUpperCase()}</div>
              <div className="text-white-50" style={{fontSize: '0.7rem'}}>
                READY FOR INGESTION • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="mb-4">
            <div className="d-flex justify-content-between small mb-2">
              <span className="accent fw-bold uppercase">Syncing...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        )}

        {message && <div className="text-info small text-center mb-4 fw-bold">{message}</div>}
        {error && <div className="text-danger small text-center mb-4 fw-bold border border-danger border-opacity-25 p-2 rounded">{error}</div>}

        <div className="d-flex gap-3">
          <Link href="/dashboard" className="btn text-white-50 fw-bold text-uppercase small pt-3">
            Cancel
          </Link>
          <button
            className="btn-deploy"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? 'SYNCHRONIZING...' : 'START DEPLOYMENT'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;