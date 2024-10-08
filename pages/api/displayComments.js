import dbConnect from '../../utils/dbConnect';
import comments from '../../models/comment';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { bookId } = req.query;

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    try {
      const Comments = await comments.find({ bookId: bookId }).populate('userId', 'name pfp');
      res.status(200).json(Comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Error fetching comments' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
