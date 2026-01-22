'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import Head from 'next/head';

const ProfilePage = () => {
  const { user, updateUserProfile, isLoading, logout } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: ''
  });
  
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateUserProfile(formData);
      setNotification({ type: 'success', message: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({ type: 'error', message: 'Failed to update profile. Please try again.' });
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!user && !isLoading) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-vh-100 gradient-bg-auth" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
      <Head>
        <title>Account Settings | Genius.AI</title>
      </Head>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="card premium-card border-0 shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)' }}>
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-5">
                  <h2 className="gradient-text-brand mb-3">Account Settings</h2>
                  <p className="text-white-50">Manage your profile and account preferences</p>
                </div>

                {notification.message && (
                  <div className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'} text-center mb-4`} role="alert">
                    {notification.message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label htmlFor="firstName" className="form-label text-white-50">First Name</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label htmlFor="lastName" className="form-label text-white-50">Last Name</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="form-label text-white-50">Email Address</label>
                    <input
                      type="email"
                      className="form-control bg-dark text-white border-secondary"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="bio" className="form-label text-white-50">Bio</label>
                    <textarea
                      className="form-control bg-dark text-white border-secondary"
                      id="bio"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                    ></textarea>
                  </div>

                  <div className="d-flex flex-column flex-md-row gap-3 mt-5">
                    {!isEditing ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-premium-gradient flex-grow-1"
                          onClick={() => setIsEditing(true)}
                        >
                          Edit Profile
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-light flex-grow-1"
                          onClick={handleLogout}
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="submit"
                          className="btn btn-premium-gradient flex-grow-1"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-light flex-grow-1"
                          onClick={() => {
                            setIsEditing(false);
                            // Reset form to original values
                            if (user) {
                              setFormData({
                                firstName: user.firstName || '',
                                lastName: user.lastName || '',
                                email: user.email || '',
                                bio: user.bio || ''
                              });
                            }
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </form>

                <div className="mt-5 pt-4 border-top border-secondary-subtle">
                  <h5 className="text-white mb-3">Danger Zone</h5>
                  <div className="alert alert-warning bg-transparent border-warning">
                    <p className="mb-2">Permanently delete your account and all associated data.</p>
                    <button className="btn btn-danger btn-sm">Delete Account</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;