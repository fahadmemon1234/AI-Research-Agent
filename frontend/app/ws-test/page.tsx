'use client';

import { useState, useEffect } from 'react';
import webSocketService from '../../lib/websocket-service';

const WebSocketTestPage = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    // Initialize WebSocket connection only once
    webSocketService.connect('ws://localhost:8000/ws');

    // Subscribe to WebSocket events
    const unsubscribeOnOpen = webSocketService.on('open', () => {
      console.log('Connected to WebSocket server');
      setConnectionStatus('connected');
      addMessage('Connected to WebSocket server');
    });

    const unsubscribeOnClose = webSocketService.on('close', (event: any) => {
      console.log('Disconnected from WebSocket server:', event.reason);
      setConnectionStatus('disconnected');
      addMessage(`Disconnected: ${event.reason || 'Unknown reason'}`);
    });

    const unsubscribeOnError = webSocketService.on('error', (error) => {
      console.error('WebSocket connection error:', error);
      setConnectionStatus('error');
      addMessage(`Connection error: ${error.type || 'Unknown error'}`);
    });

    // Cleanup only unsubscribes from events, doesn't close the connection
    return () => {
      unsubscribeOnOpen();
      unsubscribeOnClose();
      unsubscribeOnError();
    };
  }, []);

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const sendWsMessage = () => {
    if (inputMessage.trim()) {
      webSocketService.sendMessage(inputMessage);
      addMessage(`Sent: ${inputMessage}`);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendWsMessage();
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
        <button onClick={sendWsMessage} disabled={connectionStatus !== 'connected'}>
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