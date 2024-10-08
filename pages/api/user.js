import dbConnect from '../../utils/dbConnect';
import Users from '../../models/user'; 
import { verifyToken } from '../../utils/token';

export default async function handler(req, res) {
  console.log('user api opened');
  await dbConnect();

  if (req.method === 'GET') {
    console.log('got inside GET');
    try {
      const token = req.headers.authorization?.split(' ')[1];
      console.log('token:',token);
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const decoded = verifyToken(token);
      console.log('decoded',decoded);
      if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
      }

    
      const user = await Users.findById(decoded.userId).lean();  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
        console.log("user i will return is : ",user)
      res.status(200).json(user);
    } catch (error) {
      console.error('Error in /api/user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
