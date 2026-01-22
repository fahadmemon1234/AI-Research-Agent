'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const WebSocketTestPage = () => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:8000', {
      transports: ['websocket'],
      withCredentials: true, // Important: allow credentials to be sent
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setConnectionStatus('connected');
      addMessage('Connected to WebSocket server');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason);
      setConnectionStatus('disconnected');
      addMessage(`Disconnected: ${reason}`);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setConnectionStatus('error');
      addMessage(`Connection error: ${error.message}`);
    });

    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const sendMessage = () => {
    if (socket && inputMessage.trim()) {
      socket.emit('message', inputMessage);
      addMessage(`Sent: ${inputMessage}`);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>WebSocket Connection Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <div>
          <strong>Connection Status:</strong> <span style={{ color: connectionStatus === 'connected' ? 'green' : connectionStatus === 'error' ? 'red' : 'orange' }}>
            {connectionStatus}
          </span>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message to send..."
          style={{ width: '300px', padding: '5px', marginRight: '10px' }}
        />
        <button onClick={sendMessage} disabled={!socket || connectionStatus !== 'connected'}>
          Send Message
        </button>
      </div>
      
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Messages:</h3>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '5px', fontFamily: 'monospace', fontSize: '14px' }}>
            {msg}
          </div>
        ))}
        {messages.length === 0 && <p>No messages yet...</p>}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <p><strong>Note:</strong> This test verifies WebSocket connection with cookie-based authentication.</p>
        <p>Make sure you're logged in so the authentication token is available in cookies.</p>
      </div>
    </div>
  );
};

export default WebSocketTestPage;