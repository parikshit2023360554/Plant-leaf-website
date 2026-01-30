import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editData, setEditData] = useState({});
  const dropdownRef = useRef(null);
  
  const { user, logout, updateProfile } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowEditProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditProfile = () => {
    setEditData({
      name: user.name,
      avatar: user.avatar
    });
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    const result = await updateProfile(editData);
    if (result.success) {
      setShowEditProfile(false);
    }
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  const handleAvatarChange = (emoji) => {
    setEditData(prev => ({ ...prev, avatar: emoji }));
  };

  const availableAvatars = ['👤', '🌱', '🧑‍🌾', '👨‍🔬', '👩‍🔬', '🌿', '🍃', '🌾', '🌻', '🌺'];

  if (!user) return null;

  return (
    <div className="user-profile" ref={dropdownRef}>
      <button 
        className="user-profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="user-avatar">{user.avatar}</span>
        <span className="user-name">{user.name}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="user-dropdown">
          {!showEditProfile ? (
            <>
              <div className="user-info">
                <div className="user-avatar-large">{user.avatar}</div>
                <div className="user-details">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                  <small>Member since {new Date(user.joinDate).toLocaleDateString()}</small>
                </div>
              </div>

              <div className="dropdown-divider"></div>

              <div className="dropdown-menu">
                <button 
                  className="dropdown-item"
                  onClick={handleEditProfile}
                >
                  <span className="item-icon">✏️</span>
                  Edit Profile
                </button>
                
                <button className="dropdown-item">
                  <span className="item-icon">📊</span>
                  Analysis History
                </button>
                
                <button className="dropdown-item">
                  <span className="item-icon">⚙️</span>
                  Settings
                </button>

                <div className="dropdown-divider"></div>

                <button 
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  <span className="item-icon">🚪</span>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="edit-profile">
              <h4>Edit Profile</h4>
              
              <div className="edit-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>

                <div className="form-group">
                  <label>Avatar</label>
                  <div className="avatar-selector">
                    {availableAvatars.map((avatar) => (
                      <button
                        key={avatar}
                        type="button"
                        className={`avatar-option ${editData.avatar === avatar ? 'selected' : ''}`}
                        onClick={() => handleAvatarChange(avatar)}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="edit-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => setShowEditProfile(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
