import Users from '../../models/user'; 
import dbConnect from '../../utils/dbConnect'; 

export default async function handler(req, res) {
  const { method } = req;
  console.log('function opened')

  await dbConnect(); 

  switch (method) {
    case 'GET':
      try {
        console.log('get method got');
        const { userId } = req.query;
        console.log('user id is', userId);

        const user = await Users.findById(userId).populate('bookLists.books').exec();
        console.log('user is', user);

        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: 'Invalid request method' });
      break;
  }
}
