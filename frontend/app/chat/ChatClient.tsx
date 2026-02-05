'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import webSocketService from '../../lib/websocket-service';
import Link from 'next/link';
import Image from 'next/image';
import ProtectedRoute from '../../components/ProtectedRoute';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  sources?: any[];
}

const ChatClient = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Initialize WebSocket connection only once
    webSocketService.connect(`${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}/ws`);

    // Subscribe to stream events
    const unsubscribeOnStream = webSocketService.on('stream', (data) => {
      if (data.is_complete) {
        setIsLoading(false);
      } else {
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.sender === 'ai') {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = {
              ...lastMessage,
              content: lastMessage.content + data.content
            };
            return updatedMessages;
          } else {
            return [...prev, {
              id: Date.now().toString(),
              content: data.content,
              sender: 'ai',
              timestamp: new Date()
            }];
          }
        });
      }
    });

    // Subscribe to complete events
    const unsubscribeOnComplete = webSocketService.on('complete', (data) => {
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.sender === 'ai') {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = { ...lastMessage, sources: data.sources };
          return updatedMessages;
        }
        return prev;
      });
      setIsLoading(false);
      if (data.session_id) {
        setSessionId(data.session_id);
        // Update the WebSocket service's session ID to match the backend
        webSocketService.setSessionId(data.session_id);
      }
    });

    // Cleanup only unsubscribes from events, doesn't close the connection
    return () => {
      unsubscribeOnStream();
      unsubscribeOnComplete();
    };
  }, [isAuthenticated, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), content: inputValue, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    webSocketService.sendMessage(inputValue, sessionId || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ProtectedRoute>
      <div className="neural-interface">
        <style jsx global>{`
          .neural-interface {
            height: 100vh;
            background: #020408;
            color: #fff;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
            background-image:
              radial-gradient(circle at 50% -20%, rgba(0, 210, 255, 0.15) 0%, transparent 50%),
              linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
            background-size: 100% 100%, 40px 40px, 40px 40px;
          }

          .premium-nav {
            padding: 15px 40px;
            background: rgba(2, 4, 8, 0.8);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 1000;
          }

          .logo-section {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .console-tag {
            background: linear-gradient(90deg, #00d2ff, #3a7bd5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 800;
            letter-spacing: 2px;
            font-size: 0.9rem;
          }

          .chat-canvas {
            flex-grow: 1;
            overflow-y: auto;
            padding: 40px 0;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.1) transparent;
          }

          .message-wrapper {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
            gap: 32px;
          }

          .bubble {
            max-width: 80%;
            padding: 20px 24px;
            border-radius: 20px;
            position: relative;
            line-height: 1.6;
            animation: slideIn 0.3s ease-out;
          }

          @keyframes slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .ai-bubble {
            align-self: flex-start;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-bottom-left-radius: 4px;
          }

          .user-bubble {
            align-self: flex-end;
            background: #ffffff;
            color: #000;
            font-weight: 500;
            border-bottom-right-radius: 4px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          }

          .sender-label {
            font-size: 0.65rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 8px;
            font-weight: 700;
            opacity: 0.5;
          }

          .source-pill {
            display: inline-flex;
            align-items: center;
            background: rgba(0, 210, 255, 0.1);
            border: 1px solid rgba(0, 210, 255, 0.2);
            color: #00d2ff;
            padding: 4px 12px;
            border-radius: 100px;
            font-size: 0.7rem;
            margin-top: 12px;
            margin-right: 8px;
          }

          .input-anchor {
            padding: 30px 20px;
            background: linear-gradient(0deg, #020408 60%, transparent);
          }

          .glass-input-container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 8px 12px;
            display: flex;
            align-items: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .glass-input-container:focus-within {
            background: rgba(255, 255, 255, 0.05);
            border-color: #00d2ff;
            box-shadow: 0 0 40px rgba(0, 210, 255, 0.15);
          }

          .main-input {
            flex-grow: 1;
            background: transparent;
            border: none;
            color: white;
            padding: 12px;
            outline: none;
            font-size: 1rem;
            resize: none;
          }

          .action-btn {
            background: #00d2ff;
            color: #000;
            border: none;
            width: 48px;
            height: 48px;
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
          }

          .action-btn:hover:not(:disabled) {
            transform: scale(1.05);
            background: #ffffff;
          }

          .system-status {
            text-align: center;
            font-size: 0.6rem;
            color: rgba(255,255,255,0.3);
            letter-spacing: 2px;
            margin-top: 15px;
          }
        `}</style>

        {/* Header Fixed Logic */}
        <nav className="premium-nav">
          <div className="logo-section">
            <div className="d-flex align-items-center bg-white rounded-circle p-1" style={{width: '32px', height: '32px'}}>
               <span className="fw-black text-dark" style={{fontSize: '12px', margin: 'auto'}}>G</span>
            </div>
            <div>
              <span className="console-tag">NEURAL CONSOLE</span>
              <div className="d-flex align-items-center gap-2" style={{fontSize: '0.6rem', opacity: 0.5}}>
                <span className="spinner-grow spinner-grow-sm text-success" style={{width: '6px', height: '6px'}}></span>
                ENCRYPTED CONNECTION ACTIVE
              </div>
            </div>
          </div>

          <div className="d-flex gap-3">
            <Link href="/dashboard" className="btn btn-sm text-white-50 border-0 hover-opacity-100">Analytics</Link>
            <Link href="/dashboard" className="btn btn-sm btn-outline-light rounded-pill px-4" style={{fontSize: '0.75rem'}}>
              EXIT CONSOLE
            </Link>
          </div>
        </nav>

        <div className="chat-canvas">
          <div className="message-wrapper">
            {messages.length === 0 ? (
              <div className="text-center my-auto" style={{paddingTop: '10vh'}}>
                <div className="placeholder-icon mb-4">
                  <i className="bi bi-cpu text-info" style={{fontSize: '3rem', filter: 'drop-shadow(0 0 15px rgba(0,210,255,0.5))'}}></i>
                </div>
                <h2 className="fw-bold mb-2">System Initialized</h2>
                <p className="text-white-50 small tracking-widest uppercase">Query your knowledge repository below</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                  <div className="sender-label">
                    {msg.sender === 'user' ? 'Operator' : 'AI Intelligence'}
                  </div>
                  <div className="message-content">{msg.content}</div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="sources-container">
                      {msg.sources.map((source, idx) => (
                        <span key={idx} className="source-pill">
                          <i className="bi bi-file-earmark-text me-1"></i>
                          {source.document_name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="bubble ai-bubble" style={{width: 'fit-content'}}>
                <div className="d-flex gap-1">
                  <span className="spinner-grow spinner-grow-sm text-info" style={{animationDelay: '0s'}}></span>
                  <span className="spinner-grow spinner-grow-sm text-info" style={{animationDelay: '0.2s'}}></span>
                  <span className="spinner-grow spinner-grow-sm text-info" style={{animationDelay: '0.4s'}}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="input-anchor">
          <div className="glass-input-container">
            <textarea
              className="main-input"
              placeholder="Ask anything about your documents..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading}
            />
            <button
              className="action-btn"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                <i className="bi bi-lightning-charge-fill"></i>
              )}
            </button>
          </div>
          <div className="system-status text-uppercase tracking-tighter">
            Neural-Engine v4.2 // Real-time document indexing active
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ChatClient;