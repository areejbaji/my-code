
import React, { useEffect, useState } from 'react';
import apis from '../utils/apis';
import './AdminProfile.css';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // Form data for editing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: null
  });
  
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(apis().getAdminProfile, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        avatar: null
      });
      setPreviewImage(data.avatar || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file
      }));
      
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const submitData = new FormData();
      
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      
      if (formData.avatar) {
        submitData.append('avatar', formData.avatar);
      }

      const response = await fetch(apis().updateAdminProfile, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await response.json();
      setProfile(result.profile);
      setIsEditing(false);
      alert('Profile updated successfully!');
      
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: profile.name || '',
      email: profile.email || '',
      avatar: null
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
          // View Mode
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
              
              <div className="field">
                <label>Joined:</label>
                <span>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
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
              <div className="avatar-upload">
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                <label htmlFor="avatar" className="upload-btn">
                  Change Avatar
                </label>
              </div>
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
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={updating}
                >
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={cancelEdit}
                  className="cancel-btn"
                  disabled={updating}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;