
import dbConnect from '../../utils/dbConnect';
import Users from '../../models/user'; 
import { generateToken } from '../../utils/token'; 
import cookie from 'cookie';


export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { name, password, email } = req.body; 

      if (!name || !password) {
        return res.status(400).json({ message: 'Name and password are required' });
      }
      const existingUser = await Users.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }


      const userData = { name, password , Email: email|| undefined};
      
      const user = new Users(userData);
      await user.save();
      const token = generateToken(user);

      res.setHeader('Set-Cookie', cookie.serialize('token', token, {
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 7,           
        sameSite: 'strict',
        path: '/',               
    }));

      res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
      console.error('Error in register API:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {

    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
