'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import classes from './social.module.css';
import { useRouter } from 'next/navigation';

const Social = ({ user, onBackToAccount }) => {
    console.log("social page is opened");
    
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowings, setShowFollowings] = useState(false);
    const [followersData, setFollowersData] = useState([]);
    const [followingsData, setFollowingsData] = useState([]);
    const [News, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        console.log("User's followers:", user.followers);
        console.log("User's followings:", user.followings);
    }, [user]);

    useEffect(() => {
        if (showFollowers && user.followers?.length) {
            fetchUserDetails(user.followers).then(data => setFollowersData(data));
        }
    }, [showFollowers, user.followers]);

    useEffect(() => {
        if (showFollowings && user.followings?.length) {
            console.log('Fetching followings details...');
            fetchUserDetails(user.followings).then(data => setFollowingsData(data));
        }
    }, [showFollowings, user.followings]);

    const fetchUserDetails = async (userIds) => {
        console.log('Fetching details for user IDs:', userIds);
        setIsLoading(true); 
        try {
            const response = await axios.post('/api/FollowInfo', { userIds });
            console.log('Fetched user details:', response.data);
            setIsLoading(false);
            return response.data;
        } catch (error) {
            console.error('Error fetching user details:', error);
            setIsLoading(false);
            return [];
        }
    };


    const handleFollowersClick = () => {
        setShowFollowers(prev => !prev);
        if (!showFollowers) {
            setShowFollowings(false);
        }
    };

    const handleFollowingsClick = () => {
        setShowFollowings(prev => !prev);
        if (!showFollowings) {
            setShowFollowers(false);
        }
    };
    const handleLinkClick = (userId) => {
        console.log("user id is:::::",userId);
          router.push(`/User2/${userId}`);
    };


    const feed = async () => {
        const followingIds = followingsData.map(user => user._id).join(','); 
        console.log('Fetching feed for following IDs:', followingIds);
    
        try {
            const response = await axios.get(`/api/showPosts?followedIds=${followingIds}`);
            console.log('News fetched:', response.data); 
            setNews(response.data.activityLogs); 
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    useEffect(() => {
        console.log("followingsData is:", followingsData);

        const fetchFeed = async () => {
            if (followingsData.length > 0) {
                await feed();
            }
        };

        fetchFeed();
        const interval = setInterval(fetchFeed, 30000); 

        return () => clearInterval(interval);
    }, [followingsData]);

    useEffect(() => {
        console.log("user is ", user)
        console.log("users followings are ", user.followings)
        if (user.followings?.length) {
            fetchUserDetails(user.followings).then(data => setFollowingsData(data));
        }
    }, [user.followings]);
    

    return (
        <div className={classes.page}>
            <div className={classes.header}>
                <button onClick={onBackToAccount} className={classes.Backbutton}>
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8L8 12M8 12L12 16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>  
                </button>
                <h3>Social</h3>
                <div className={classes.but}>
                    <button onClick={handleFollowersClick}>
                        Followers
                    </button>
                    <button onClick={handleFollowingsClick}>
                        Followings
                    </button>
                </div>
            </div>

            {isLoading && <p>Loading...</p>}

            {showFollowers && (
                <div className={classes.UserWrapper}>
                    <h4> Followers</h4>
                    <div className={classes.userList}>
                        {followersData.map(follower => (
                            <div key={follower._id} className={classes.user}>
                                <img src={follower.pfp || '/defaultpfp.png'} alt={follower.name} />
                                <p>{follower.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showFollowings && (
                <div className={classes.UserWrapper}>
                    <h4> Followings</h4>
                    <div className={classes.userList}>
                        {followingsData.map(following => (
                            <div key={following._id} className={classes.user} >
                                <img src={following.pfp || '/defaultpfp.png'} alt={following.name} onClick={() => handleLinkClick(following?.name)}/>
                                <p>{following.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {!showFollowers && !showFollowings && (
                <div className={classes.newsFeed}>
                    {News.map((post, index) => (
                        <div key={index} className={classes.post}>
                            <div>  <img src={post.user.pfp || '/defaultpfp.png'}  /></div>
                        <div className={classes.postinfo}>    
                            <h4>{post.user.name}</h4>
                            <div>{post.comment && <p><span>Comment: </span>{post.comment.content}</p>}</div>
                            <div> {post.rate && <p><span>Rated: </span>{post.rate.rating}</p>}</div>
                                {post.book && <p>Book: {post.book.title}</p>}
                                {post.bookListName && <p>Creted a new Book List: {post.bookListName} </p>}
                        </div>
                        
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Social;
