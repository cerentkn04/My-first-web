import dbconnect from '../../utils/dbConnect';
import UserActivityLog from '../../models/userActLog';
import Rate from '../../models/rate';
import comments from '../../models/comment';
import Users from '../../models/user'; // Ensure this is the correct path

const handler = async (req, res) => {
    console.log("showPost opened")
    if (req.method === 'GET') {
        await dbconnect();
    
        try {
         
            const { followedIds } = req.query; 
            console.log("followed Ids are: ", followedIds);
            const followedIdArray = followedIds.split(',');
            console.log("followed Id Array is: ", followedIdArray);

            
            const followedUserLogs = await UserActivityLog.find({ user: { $in: followedIdArray } })
                .populate({
                    path: 'user',
                    select: 'name pfp visibility',
                    match: { visibility: true } 
                })
                .populate('book', 'title') 
                .populate('comment', 'content')
                .populate('rate', 'rating');
            
          
            const visibleLogs = followedUserLogs.filter(log => log.user !== null);

            console.log("followed user logs are:", visibleLogs);
        
            if (!visibleLogs || visibleLogs.length === 0) {
                return res.status(404).json({ message: 'No visible activity logs found for followed users' });
            }

        
            return res.status(200).json({ activityLogs: visibleLogs });

        } catch (error) {
            console.error('Error fetching user activity logs:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
     
        return res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler;
