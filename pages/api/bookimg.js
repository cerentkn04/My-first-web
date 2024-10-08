import dbConnect from '../../utils/dbConnect'; 
import Book from '../../models/book'; 

export default async function handler(req, res) {
  const { bookId } = req.query;

  await dbConnect(); 

  try {

    const book = await Book.findById(bookId).lean();

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }


    return res.status(200).json({
      title: book.title,
      image: book.coverImage, 
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
