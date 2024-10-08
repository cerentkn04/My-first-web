import Users from '../../models/user';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email, name } = req.query;

   
    if (!email && !name) {
      return res.status(400).json({ error: 'Email or Name is required' });
    }

    try {
      let user;

  
      if (email) {
        user = await Users.findOne({ Email: email });
      } 
     
      else if (name) {
        user = await Users.findOne({ name: name }).populate({
          path: 'bookLists.books', 
          model: 'Book'
        })
        .exec();;
      }

      console.log('Fetched user from database:', user);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user info:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
