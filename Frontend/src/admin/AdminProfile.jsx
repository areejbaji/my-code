import React, { useEffect, useState } from 'react';
import apis from '../utils/apis';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Admin.css';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPage, setShowAvatarPage] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
  });

  const [previewImage, setPreviewImage] = useState('');

  const avatarOptions = [
    "https://cdn-icons-png.flaticon.com/512/194/194938.png",
    "https://cdn-icons-png.flaticon.com/512/194/194935.png",
    "https://cdn-icons-png.flaticon.com/512/3006/3006878.png",
    "https://cdn-icons-png.flaticon.com/512/1999/1999625.png",
    "https://cdn-icons-png.flaticon.com/512/2922/2922506.png",
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(apis().getAdminProfile, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        avatar: data.avatar || '',
      });
      setPreviewImage(data.avatar || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = url => {
    setFormData(prev => ({ ...prev, avatar: url }));
    setPreviewImage(url);
    setShowAvatarPage(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem('adminToken');
      const submitData = {
        name: formData.name,
        avatar: formData.avatar,
      };
      const response = await fetch(apis().updateAdminProfile, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      const result = await response.json();
      setProfile(result.profile);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: profile.name || '',
      email: profile.email || '',
      avatar: profile.avatar || '',
    });
    setPreviewImage(profile.avatar || '');
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!profile) return <div className="error">No profile data found</div>;

  return (
    <div className="admin-profile">
      <div className="profile-container">
        <div className="profile-header">
          <h2>Admin Profile</h2>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit Profile
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="profile-view">
            <div className="avatar-section">
              <div className="avatar">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Admin Avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <label>Name:</label>
                <span>{profile?.name || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{profile?.email || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <label>Role:</label>
                <span className="role-badge">Admin</span>
              </div>
              <div className="detail-item">
                <label>Joined:</label>
                <span>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </div>
          </div>
        ) : showAvatarPage ? (
          <div className="avatar-page">
            <h3>Select an Avatar</h3>
            <div className="avatar-options">
              {avatarOptions.map(url => (
                <img
                  key={url}
                  src={url}
                  alt="avatar option"
                  onClick={() => handleAvatarSelect(url)}
                  className={formData.avatar === url ? 'selected' : ''}
                />
              ))}
            </div>
            <button className="cancel-btn" onClick={() => setShowAvatarPage(false)}>Back</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-edit">
            <div className="avatar-section">
              <div className="avatar">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" />
                ) : (
                  <div className="avatar-placeholder">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}
              </div>
              <button type="button" className="change-avatar-btn" onClick={() => setShowAvatarPage(true)}>
                Change Avatar
              </button>
            </div>

            <div className="form-fields">
              <div className="field">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="field">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  placeholder="Email cannot be changed"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={updating}>
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
                <button type="button" onClick={cancelEdit} className="cancel-btn" disabled={updating}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminProfile;