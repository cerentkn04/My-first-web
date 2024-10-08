// pages/api/me.js
import dbConnect from '../../utils/dbConnect'; 
import Users from '../../models/user';
import { verifyToken } from '../../utils/token'; 
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  if (req.method === 'GET') {
  
    await dbConnect();

    try {
      const { token } = parseCookies({ req });
      if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      const decoded = verifyToken(token);
      const user = await Users.findById(decoded.userId);
      console.log("user i got from the token is: " ,user)
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('User data to send:', { name: user.name, Email: user.Email });
      
      
      res.status(200).json({ user: { name: user.name, Email: user.Email } });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
