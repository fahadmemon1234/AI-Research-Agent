import React from 'react';

interface UploadProgressProps {
  progress: number;
  fileName?: string;
  status?: string;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress, fileName, status }) => {
  return (
    <div className="upload-progress">
      {fileName && <div className="file-name mb-2"><strong>{fileName}</strong></div>}
      <div className="progress mb-2">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {progress}%
        </div>
      </div>
      {status && <small className="text-muted">{status}</small>}
    </div>
  );
};

export default UploadProgress;