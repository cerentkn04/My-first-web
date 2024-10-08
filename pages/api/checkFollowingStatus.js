import dbConnect from '../../utils/dbConnect';
import Users from '../../models/user';
import { checkUser } from '../../utils/token'; // Import the checkUser function

const handler = async (req, res) => {
  if (req.method === 'GET') {
    await dbConnect(); // Connect to the database

    try {
      // Extract the JWT token from headers
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({ error: 'Authorization header missing' });
      }

      const token = authorization.split(' ')[1]; // Format: "Bearer <token>"
      if (!token) {
        return res.status(401).json({ error: 'Token missing' });
      }

      // Use the checkUser function to verify and get the logged-in user
      const loggedInUser = await checkUser(token);
      if (!loggedInUser) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const { targetUserName } = req.query; // Extract the target user name from query parameters

      // Find the target user by name
      const targetUser = await Users.findOne({ name: targetUserName });
      if (!targetUser) {
        return res.status(404).json({ error: 'Target user not found' });
      }

      // Check if the target user is in the logged-in user's "following" list
      const isFollowing = loggedInUser.followings.includes(targetUser._id);

      // Return the following status
      return res.status(200).json({ isFollowing });
    } catch (error) {
      console.error('Error checking follow status:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handle unsupported HTTP methods
    return res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;
