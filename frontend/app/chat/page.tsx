import { isAuthenticated } from '../../lib/auth-utils';
import { redirect } from 'next/navigation';
import ChatClient from './ChatClient';

// Server component that checks authentication
export default function ChatPageServer() {
  // Check if user is authenticated using our server-side utility
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    redirect('/auth/login?return=/chat');
  }

  // Render the client component for authenticated users
  return <ChatClient />;
}