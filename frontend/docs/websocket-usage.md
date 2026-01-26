# WebSocket Service Usage Guide

## Production-Safe WebSocket Singleton Service with Session Management

This document explains how to use the WebSocket singleton service in your React/Next.js application.

### Features
- Single WebSocket instance across the entire app
- Automatic reconnection with exponential backoff
- Safe message sending with connection state checking
- Comprehensive logging for debugging
- Protection against StrictMode re-render disconnections
- Session ID management for chat sessions
- Dedicated sendMessage function that properly attaches session IDs

### Usage

#### 1. Connecting to WebSocket Server

```jsx
import { useEffect } from 'react';
import webSocketService from '../lib/websocket-service';

const MyComponent = () => {
  useEffect(() => {
    // Connect to WebSocket server (only once)
    webSocketService.connect('ws://localhost:8000/ws');

    // Subscribe to events
    const unsubscribeOnOpen = webSocketService.on('open', (event) => {
      console.log('Connected to WebSocket server');
    });

    const unsubscribeOnMessage = webSocketService.on('message', (data) => {
      console.log('Received message:', data);
    });

    // Important: Only unsubscribe from events, don't close the connection
    return () => {
      unsubscribeOnOpen();
      unsubscribeOnMessage();
    };
  }, []); // Empty dependency array ensures this runs only once

  return <div>My Component</div>;
};
```

#### 2. Sending Messages with Session ID

```jsx
import webSocketService from '../lib/websocket-service';

// Method 1: Using the dedicated sendMessage function (recommended)
const sendChatMessage = (message, sessionId) => {
  const success = webSocketService.sendMessage(message, sessionId);

  if (success) {
    console.log('Message sent successfully');
  } else {
    console.error('Failed to send message');
  }
};

// Method 2: Setting a default session ID for all messages
webSocketService.setSessionId('session-123');

// Now all messages will automatically include this session ID
const sendWithDefaultSession = (message) => {
  webSocketService.sendMessage(message); // Uses the default session ID
};
```

#### 3. Managing Session IDs

```jsx
// Set a session ID that will be used for all subsequent messages
webSocketService.setSessionId('session-456');

// Get the current session ID
const currentSessionId = webSocketService.getSessionId();

// Send a message with a specific session ID (overrides default)
webSocketService.sendMessage('Hello', 'specific-session-789');

// Send a message with the default session ID
webSocketService.sendMessage('Hello'); // Uses the default session ID
```

#### 4. Subscribing to Different Event Types

```jsx
useEffect(() => {
  // Subscribe to different event types
  const unsubscribeOnOpen = webSocketService.on('open', (event) => {
    console.log('WebSocket opened');
  });

  const unsubscribeOnClose = webSocketService.on('close', (event) => {
    console.log('WebSocket closed', event.code, event.reason);
  });

  const unsubscribeOnError = webSocketService.on('error', (error) => {
    console.error('WebSocket error', error);
  });

  const unsubscribeOnMessage = webSocketService.on('message', (data) => {
    console.log('Received generic message', data);
  });

  const unsubscribeOnStream = webSocketService.on('stream', (data) => {
    console.log('Received stream data', data);
  });

  const unsubscribeOnComplete = webSocketService.on('complete', (data) => {
    console.log('Received completion data', data);
  });

  return () => {
    unsubscribeOnOpen();
    unsubscribeOnClose();
    unsubscribeOnError();
    unsubscribeOnMessage();
    unsubscribeOnStream();
    unsubscribeOnComplete();
  };
}, []);
```

#### 5. Checking Connection Status

```jsx
// Get numeric readyState value
const readyState = webSocketService.getStatus();

// Get status as string
const statusString = webSocketService.getStatusString(); // 'UNINITIALIZED', 'CONNECTING', 'OPEN', 'CLOSING', 'CLOSED', 'UNKNOWN'

console.log('Current status:', statusString);
```

#### 6. Manual Disconnection (Only when completely shutting down the app)

```jsx
// Only call this when completely shutting down the app
webSocketService.disconnect();
```

### React/Next.js Usage Example

Here's a complete example showing how to use the WebSocket service in a React component:

```jsx
import { useState, useEffect, useRef } from 'react';
import webSocketService from '../lib/websocket-service';

const ChatComponent = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Initialize WebSocket connection once when component mounts
  useEffect(() => {
    // Connect to WebSocket server
    webSocketService.connect('ws://localhost:8000/ws');

    // Set the session ID for this chat
    webSocketService.setSessionId(sessionId);

    // Subscribe to WebSocket events
    const unsubscribeOnOpen = webSocketService.on('open', () => {
      setConnectionStatus('connected');
      console.log('WebSocket connected');
    });

    const unsubscribeOnClose = webSocketService.on('close', (event) => {
      setConnectionStatus('disconnected');
      console.log('WebSocket disconnected:', event.code, event.reason);
    });

    const unsubscribeOnError = webSocketService.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    const unsubscribeOnStream = webSocketService.on('stream', (data) => {
      // Handle streaming responses
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: data.content,
        sender: 'ai',
        timestamp: new Date()
      }]);
    });

    const unsubscribeOnComplete = webSocketService.on('complete', (data) => {
      // Handle completion of a response
      console.log('Response complete:', data);
    });

    // Cleanup: only unsubscribe from events, don't close the connection
    return () => {
      unsubscribeOnOpen();
      unsubscribeOnClose();
      unsubscribeOnError();
      unsubscribeOnStream();
      unsubscribeOnComplete();
    };
  }, [sessionId]); // Include sessionId in dependency array if it can change

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message to UI
    setMessages(prev => [...prev, {
      id: Date.now(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }]);

    // Send message through WebSocket with current session ID
    webSocketService.sendMessage(inputValue);

    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      <div>Status: {connectionStatus}</div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-area">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
```

### Important Notes

1. **Never close the WebSocket in component cleanup**: The singleton pattern ensures one connection across the app. Closing it in a component will affect all other components using it.

2. **Always use empty dependency array**: When using `useEffect` to connect, always use an empty dependency array (`[]`) to ensure the connection is established only once.

3. **Only unsubscribe from events**: In component cleanup, only unsubscribe from events using the returned unsubscribe functions. Don't close the connection.

4. **Automatic reconnection**: The service automatically attempts to reconnect if the connection is lost (unless it's a manual close with code 1000).

5. **Session ID management**: Use `setSessionId()` to establish a default session ID, or pass session IDs directly to `sendMessage()` for specific messages.

6. **Message queuing**: If you try to send a message while connecting, it will be sent once the connection is established.

### Troubleshooting

- If you see multiple connections being made, check that you're using an empty dependency array in your `useEffect` hook.
- If messages aren't being received, verify that you're subscribing to the correct event types.
- If reconnection isn't working, check the console logs for error messages.
- If session IDs aren't being attached properly, make sure you're using `sendMessage()` instead of `send()` for chat messages.