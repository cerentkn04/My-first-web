import UserActivityLog from "../../models/userActLog";
import UserModel from "../../models/user";  // Ensure UserModel is imported
import dbConnect from "../../utils/dbConnect";

const handler = async (req, res) => {
    if (req.method === 'GET') {
        console.log("Fetching user activity logs");

        try {
            await dbConnect();  // Ensure the database connection

            const { userId } = req.query;  // Extract userId from query parameters
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            // Fetch user activities by user ID
            let userActivities = await UserActivityLog.find({ user: userId })
            .populate({
                path: 'book', 
                select: 'title'  // Only populate the book title
            })
            .populate({
                path: 'comment', 
                select: 'content'  // Only populate the comment content
            })
            .populate({
                path: 'rate', 
                select: 'rating'  // Only populate the rate rating
            });

            if (!userActivities || userActivities.length === 0) {
                return res.status(404).json({ message: 'No activities found for this user' });
            }

            // Loop through each activity log to handle 'create_booklist'
            for (let activityLog of userActivities) {
                if (activityLog.actionType === 'create_booklist') {
                    const user = await UserModel.findById(activityLog.user);  // Fetch the full user document
                    
                    // Find the specific booklist by name
                    const bookList = user.bookLists.find(list => list.name === activityLog.bookListName);

                    // Attach the book list to the activity log for response
                    if (bookList) {
                        activityLog.bookList = bookList;  // Add the booklist data to the log
                        activityLog.bookListName = bookList.name;  // Ensure the name is present
                    }
                }
            }

            return res.status(200).json(userActivities);  // Return the populated activity logs
        } catch (error) {
            console.error("Error fetching user activity logs:", error);
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });  // Handle non-GET requests
    }
};

export default handler;
