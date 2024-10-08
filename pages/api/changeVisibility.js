import dbConnect from '../../utils/dbConnect'; 
import Users from '../../models/user'; 

export default async function handler(req, res) {
  await dbConnect(); 
  
  if (req.method === 'PATCH') {
    const { userId, listName, visibility } = req.body;

    try {
      const user = await Users.findOneAndUpdate(
        { _id: userId, 'bookLists.name': listName },
        { $set: { 'bookLists.$.visibility': visibility } }, 
        { new: true } 
      );

      if (!user) {
        return res.status(404).json({ message: 'User or book list not found' });
      }

      res.status(200).json({
        message: 'Visibility updated successfully',
        updatedList: user.bookLists.find(list => list.name === listName),
      });
    } catch (error) {
      console.error('Error updating visibility:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
