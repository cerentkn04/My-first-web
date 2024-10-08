import dbConnect from "../../utils/dbConnect";
import Users from "../../models/user";
import { verifyToken } from '../../utils/token';
import mongoose from 'mongoose';

const { isValidObjectId } = mongoose;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await dbConnect();

  
      const token = req.headers.authorization?.split(' ')[1];
      console.log('Token in FollowAct:', token);

      if (!token) {
        return res.status(401).json({ message: 'Token missing' });
      }

      const decoded = verifyToken(token);
      console.log("Decoded is:", decoded);
      if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      const userId = decoded.userId;
      console.log("Decoded user ID is:", userId);

      const { targetUserName } = req.body;
      console.log("Target user name is:", targetUserName);

      if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      const targetUser = await Users.findOne({ name: targetUserName });
      if (!targetUser) {
        return res.status(404).json({ message: 'Target user not found' });
      }
      const targetUserId = targetUser._id;
      console.log("Target user ID is:", targetUserId);

      const user1 = await Users.findByIdAndUpdate(userId, {
        $addToSet: { followings: targetUserId },
      });

      const user2 = await Users.findByIdAndUpdate(targetUserId, {
        $addToSet: { followers: userId },
      });

      if (!user1 || !user2) {
        return res.status(404).json({ message: 'User not found' });
      }

    
      return res.status(200).json({ message: 'Follow action successful' });
      
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Error following user', error });
    }
  } else {
   
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
