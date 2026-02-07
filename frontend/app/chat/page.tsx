import { isAuthenticated } from '../../lib/auth-utils';
import { redirect } from 'next/navigation';
import ChatClient from './ChatClient';

export default function ChatPage() {
  if (!isAuthenticated()) {
    redirect('/auth/login?return=/chat');
  }

  return <ChatClient />;
}
