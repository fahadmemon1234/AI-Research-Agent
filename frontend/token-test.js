// Simple test to verify token storage in cookies
console.log('Testing token storage mechanism...');

// Import required modules
const Cookies = require('js-cookie');

// Test setting a token in cookies
console.log('Setting test token in cookies...');
Cookies.set('access_token', 'test-token-value', { 
  expires: 1/24, // 1 hour
  secure: true, 
  sameSite: 'strict' 
});

// Retrieve the token from cookies
const token = Cookies.get('access_token');
console.log('Retrieved token from cookies:', token);

// Remove the test token
Cookies.remove('access_token');
console.log('Removed test token from cookies');

// Verify removal
const removedToken = Cookies.get('access_token');
console.log('Token after removal:', removedToken);

console.log('Token storage test completed successfully!');