import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatHistorySidebarProps {
  onSelectSession: (sessionId: string) => void;
  onCreateNewSession: () => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({ 
  onSelectSession, 
  onCreateNewSession 
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // In a real implementation, we would fetch chat sessions from the API
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data for demonstration
        const mockSessions: ChatSession[] = [
          {
            id: '1',
            title: 'Budget Planning Questions',
            created_at: '2026-01-20T10:30:00Z',
            updated_at: '2026-01-20T11:45:00Z'
          },
          {
            id: '2',
            title: 'Project Timeline Discussion',
            created_at: '2026-01-19T14:20:00Z',
            updated_at: '2026-01-19T15:10:00Z'
          },
          {
            id: '3',
            title: 'Contract Review',
            created_at: '2026-01-18T09:15:00Z',
            updated_at: '2026-01-18T10:30:00Z'
          }
        ];
        
        setSessions(mockSessions);
      } catch (err) {
        setError('Failed to load chat history');
        console.error('Error fetching chat sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="p-3 border-bottom">
        <h5>Chat History</h5>
        <button 
          className="btn btn-primary btn-sm w-100 mt-2"
          onClick={onCreateNewSession}
        >
          + New Chat
        </button>
      </div>
      
      <div className="flex-grow-1 overflow-auto">
        {loading ? (
          <div className="p-3 text-center">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-3 text-center text-danger">
            {error}
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-3 text-center text-muted">
            No chat history yet
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {sessions.map(session => (
              <button
                key={session.id}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                onClick={() => onSelectSession(session.id)}
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{session.title}</div>
                  <small className="text-muted">
                    {formatDate(session.updated_at)}
                  </small>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistorySidebar;