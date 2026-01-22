import React from 'react';

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp?: Date;
  sources?: Array<{
    document_name: string;
    excerpt: string;
    page?: string;
  }>;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  content, 
  sender, 
  timestamp, 
  sources 
}) => {
  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`d-flex mb-3 ${sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
      <div
        className={`p-3 rounded ${sender === 'user' ? 'bg-primary text-white' : 'bg-white border'}`}
        style={{ maxWidth: '80%' }}
      >
        <div className="d-flex justify-content-between align-items-center mb-1">
          <div className="fw-bold">
            {sender === 'user' ? 'You' : 'AI Assistant'}
          </div>
          {timestamp && (
            <small className="text-muted">
              {formatTime(timestamp)}
            </small>
          )}
        </div>
        
        <div className="mb-2">{content}</div>
        
        {sources && sources.length > 0 && (
          <div className="mt-2">
            <small className="text-muted d-block mb-1">Sources:</small>
            <ul className="list-unstyled mb-0">
              {sources.map((source, idx) => (
                <li key={idx} className="small">
                  <i className="bi bi-file-text me-1"></i>
                  <span className="fw-semibold">{source.document_name}</span>
                  {source.page && <span>, Page {source.page}</span>}
                  {source.excerpt && (
                    <div className="mt-1 fst-italic">
                      "{source.excerpt.substring(0, 100)}{source.excerpt.length > 100 ? '...' : ''}"
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;