import classes from './profileSettings.module.css';
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ProfileSettings = ({ User, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(User?.pfp || '/defaultpfp.png');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);

      const formData = new FormData();
      formData.append('image', file);
      const token = Cookies.get('token') || '';

      try {
        const response = await fetch('/api/uploadImage', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setSelectedImage(updatedUser.pfp);
          setMessage('Profile picture updated successfully!');
        } else {
          setMessage('Failed to update profile picture');
        }
      } catch (error) {
        console.error('Error updating profile picture:', error);
        setMessage('An error occurred while updating the profile picture.');
      }
    }
  };

  const updateUserInfo = async (data) => {
    const token = Cookies.get('token') || '';

    try {
      const res = await axios.post('/api/userInfoUpdate', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200) {
        setMessage('Update successful');
        return res.data;
      } else {
        setMessage('Failed to update user information');
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      setMessage('An error occurred while updating user information.');
    }
  };

  const handleInfoChange = async (event, field) => {
    const info = event.target.value;

    if (field === 'password') {
      setNewPassword(info);
      setShowConfirm(true);
    } else if (field === 'confirmPassword') {
      setConfirmPassword(info);
    } else {
      await updateUserInfo({ [field]: info });
    }
  };

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    await updateUserInfo({ password: newPassword });
    setNewPassword('');
    setConfirmPassword('');
    setShowConfirm(false);
  };

  const triggerFileInput = () => {
    document.getElementById('imagePicker').click();
  };

  return (
    <div className={classes.page}>
      <button onClick={onClose} className={classes.closeButton}>
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8L8 12M8 12L12 16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className={classes.wrapper}>
        <div className={classes.subsection0}>
          <div className={classes.imageWrapper} onClick={triggerFileInput}>
            <img src={selectedImage} alt="Profile" className={classes.pfp} />
            <input
              type="file"
              id="imagePicker"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
          <div className={classes.attributes}>
            <div>
              <h4>Change Username</h4>
              <input
                placeholder={User?.name || 'user'}
                onChange={(e) => handleInfoChange(e, 'name')}
              />
            </div>
            <div>
              <h4>Change Password</h4>
              <div className={classes.passwords}>
                <input
                  type="password"
                  placeholder="New password"
                  onChange={(e) => handleInfoChange(e, 'password')}
                />
                {showConfirm && (
                  <>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      onChange={(e) => handleInfoChange(e, 'confirmPassword')}
                    />
                    <button onClick={handlePasswordSubmit}>Update Password</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {message && <div className={classes.message}>{message}</div>}
    </div>
  );
};

export default ProfileSettings;
