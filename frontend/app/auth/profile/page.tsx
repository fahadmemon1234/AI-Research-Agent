import { isAuthenticated, getUserData } from '../../../lib/auth-utils';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

// Server component that checks authentication
export default function ProfilePageServer() {
  // Check if user is authenticated using our server-side utility
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    redirect('/auth/login?return=/auth/profile');
  }

  // Get user data from cookies
  const userData = getUserData();

  // Pass user data to the client component
  return <ProfileClient userData={userData} />;
}