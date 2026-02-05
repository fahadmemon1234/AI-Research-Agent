'use client';

import { useAuth } from '../../../lib/auth-context';
import ProtectedRoute from '../../../components/ProtectedRoute';

interface ProfileClientProps {
  userData: any;
}

const ProfileClient = ({ userData }: ProfileClientProps) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card bg-dark text-white">
              <div className="card-header">
                <h4>User Profile</h4>
              </div>
              <div className="card-body">
                <h5 className="card-title">Welcome, {userData?.first_name || userData?.email || 'User'}!</h5>
                <p className="card-text">
                  This page is protected and can only be accessed when logged in.
                </p>
                <div className="mt-4">
                  <h6>User Information:</h6>
                  <pre className="bg-light text-dark p-3 rounded">
                    {JSON.stringify(userData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfileClient;