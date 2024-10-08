import cookie from 'cookie';
import { checkUser } from '../../utils/token';
import Comment from '../../models/comment'; 
import UserActivityLog from '../../models/userActLog';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Extract token from cookies
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token; // Assuming 'token' is the cookie name

    if (!token) {
      return res.status(401).json({ message: 'You must be logged in to submit a comment.' });
    }

    const user = await checkUser(token);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user not found.' });
    }

    const { content, post_id } = req.body;

    if (!content || !post_id) {
      return res.status(400).json({ message: 'Content and post ID are required.' });
    }

    try {
     
      const newComment = await Comment.create({
        content,
        bookId: post_id,
        userId: user._id
      });

      await UserActivityLog.create({
        user: user._id,
        actionType: 'comment',
        book: post_id,
        comment: newComment._id,

      });
      console.log('done fast and easy')

      
      return res.status(201).json({ message: 'Comment submitted successfully.', comment: newComment });
    } catch (error) {
      console.error('Error saving comment:', error);
      return res.status(500).json({ message: 'Failed to save comment.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
