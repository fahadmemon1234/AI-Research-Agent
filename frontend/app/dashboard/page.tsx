import { isAuthenticated, getUserData } from '../../lib/auth-utils';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

// Server component that checks authentication
export default function DashboardPageServer() {
  // Check if user is authenticated using our server-side utility
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    redirect('/auth/login?return=/dashboard');
  }

  // Get user data from cookies
  const userData = getUserData();

  // Pass user data to the client component
  return <DashboardClient user={userData} />;
}