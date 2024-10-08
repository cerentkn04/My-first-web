import dbConnect from '../../utils/dbConnect';
import Users from '../../models/user';

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === 'POST') {
      const { name, password, Email } = req.body;

      const existingUser = await Users.findOne({ Email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered.' });
      }
      const user = new Users({ name, password, Email });
      await user.save();
      
      return res.status(201).json({ success: true, data: user });
    } else if (req.method === 'GET') {
      const { email } = req.query;
      if (email) {
        const users = await Users.find({ Email: email });
        return res.status(200).json(users);
      } else {
        const users = await Users.find({});
        return res.status(200).json(users);
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Failed to handle request' });
  }
}

