'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode; // Optional fallback component while checking auth status
}

const ProtectedRoute = ({ children, fallback = null }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is not authenticated and auth status has been loaded, redirect to login
    if (!isLoading && !isAuthenticated) {
      // Redirect to login with return URL
      const returnUrl = window.location.pathname + window.location.search;
      router.push(`/auth/login?return=${encodeURIComponent(returnUrl)}`);
    }
  }, [isAuthenticated, isLoading, router]);

  // Show fallback while checking auth status, or show children if authenticated
  if (isLoading) {
    return fallback || <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return fallback || <div>Redirecting to login...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;