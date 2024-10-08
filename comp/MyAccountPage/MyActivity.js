'use client';
import axios from "axios";
import { useEffect, useState } from "react";  
import classes from './MyActivity.module.css';

const MyActivity = ({ user, onBackToAccount }) => {
    const [activities, setActivities] = useState(null); 
    const [loading, setLoading] = useState(true);        
    const [error, setError] = useState(null);      

    useEffect(() => {
        const fetchActivityLogs = async () => {
            try {
               
                const res = await axios.get(`/api/MyActLog`, { 
                    params: { userId: user._id } 
                });
                setActivities(res.data);
            } catch (error) {
                setError("Error fetching activity logs");
                console.error("Error fetching activity logs:", error);
            } finally {
                setLoading(false); 
            }
        };

    
        if (user && user._id) {
            fetchActivityLogs();
        }
    }, [user]); 

    const renderActivityContent = (activity) => {
        switch (activity.actionType) {
            case 'comment':
            return (
                <div className={classes.comment}>
                    <p>Commented on a book:</p>
                    <p>{activity.comment?.content}</p>
                </div>
            );
        case 'rate':
            return (
                <div className={classes.rate}>
                    <p>Rated a book:</p>
                    <p>Rating: {activity.rate?.rating}</p>
                </div>
            );
            case 'create_booklist':
                return (
                    <div className={classes.booklist}>
                        <p>Created a book list:</p>
                        <p>List Name: {activity.bookListName}</p> 
                      
                    </div>
                );
            
            default:
                return <p>Unknown activity</p>;
        }
    };

    return (
        <div className={classes.page}>
            <header className={classes.header}>
                <button onClick={onBackToAccount} className={classes.BackButton}>
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8L8 12M8 12L12 16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h2>My Activities</h2>
            </header>

            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : activities && activities.length > 0 ? (
                    <ul className={classes.List}>
                        {activities.map((activity, index) => (
                            <li key={index} className={classes.activityItem}>
                                {renderActivityContent(activity)}
                                <p>Timestamp: {new Date(activity.timestamp).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No activities found.</p>
                )}
            </div>
        </div>
    );
};

export default MyActivity;
