import { useState } from 'react';
import axios from 'axios';
import classes from './settings.module.css';
import ProfileSettings from './profileSettings';

const Settings = ({ user: initialUser, onBackToAccount}) => {
    const [showProfileSettings, setShowProfileSettings] = useState(false);
    const [user, setUser] = useState(initialUser);

    const handleProfileClick = () => {
        setShowProfileSettings(true);
    };

    const handleCloseProfileSettings = () => {
        setShowProfileSettings(false);
    };

    const handleAccountClick = async () => {
        try {
            await axios.post('/api/updateVisibility', { userId: user._id, visibility: !user.visibility });
            setUser(prev => ({ ...prev, visibility: !prev.visibility }));
        } catch (error) {
            console.error('Error updating visibility:', error);
        }
        console.log(user.visibility)
    };

    return (
        <div className={classes.page}>
            <button onClick={onBackToAccount} className={classes.Backbutton}>
                      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M12 8L8 12M8 12L12 16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>  
                    </button> 
            <div className={classes.header}>Settings</div>
            {!showProfileSettings ? (
                <div>
                    
                    <button onClick={handleProfileClick} className={classes.buttonToProfileSets}>
                        Profile Settings
                    </button> 
                    <div onClick={handleAccountClick} className={classes.buttonToProfileSets}>
                        <div className={classes.visibilitySets}>
                            <p>Visibility Setting</p>
                            {user.visibility ?<button> 
                                Hide My Activity 
                                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 10V8C7 5.23858 9.23858 3 12 3C14.0503 3 15.8124 4.2341 16.584 6M12 14.5V16.5M8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C17.7202 10 16.8802 10 15.2 10H8.8C7.11984 10 6.27976 10 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                </button> 
                            : 
                            <button> 
                                Show My Activity 
                                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 10V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V10M12 14.5V16.5M8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C17.7202 10 16.8802 10 15.2 10H8.8C7.11984 10 6.27976 10 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                 </svg>
                            </button>}
                        </div>
                    </div>
                </div>
            ) : (
                <div className={classes.ProfileSettings}>
                    <ProfileSettings user={user} onClose={handleCloseProfileSettings} />
                </div>
            )}
        </div>
    );
};

export default Settings;
