'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';

const TokenTestPage = () => {
  const [tokenValue, setTokenValue] = useState('');
  const [message, setMessage] = useState('');

  const setToken = () => {
    Cookies.set('access_token', tokenValue, { 
      expires: 1/24, // 1 hour
      secure: true, 
      sameSite: 'strict' 
    });
    setMessage('Token set in cookies successfully!');
  };

  const getToken = () => {
    const token = Cookies.get('access_token');
    setMessage(token ? `Token retrieved: ${token}` : 'No token found in cookies');
  };

  const removeToken = () => {
    Cookies.remove('access_token');
    setMessage('Token removed from cookies');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Token Storage Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={tokenValue}
          onChange={(e) => setTokenValue(e.target.value)}
          placeholder="Enter token value"
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={setToken} style={{ padding: '5px 10px', marginRight: '10px' }}>Set Token</button>
        <button onClick={getToken} style={{ padding: '5px 10px', marginRight: '10px' }}>Get Token</button>
        <button onClick={removeToken} style={{ padding: '5px 10px' }}>Remove Token</button>
      </div>
      
      <div>
        <strong>Status:</strong> {message}
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <p><strong>Note:</strong> Tokens are now stored in cookies instead of localStorage.</p>
        <p>Cookie options: expires in 1 hour, secure: true, sameSite: strict</p>
      </div>
    </div>
  );
};

export default TokenTestPage;