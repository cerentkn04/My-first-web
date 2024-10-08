import dbConnect from '../../utils/dbConnect';
import Book from '../../models/book';

export default async function handler( req,res) {
  await dbConnect();

  try {
    console.log('Fetching books...');
    const books = await Book.find({}).lean();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
}