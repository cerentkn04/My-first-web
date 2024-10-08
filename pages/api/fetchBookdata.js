import dbConnect from '../../utils/dbConnect';
import Book from '../../models/book';

const fetchBookData = async (bookTitle) => {
  try {
    await dbConnect();

    const decodedTitle = decodeURIComponent(bookTitle);
    

    if (decodedTitle === 'favicon.ico') {
      console.log('Ignoring favicon request');
      return null;
    }

    console.log('Searching for book with decoded title:', decodedTitle);

    const book = await Book.findOne({ title: decodedTitle }).lean(); 

    if (!book) {
      throw new Error('Book not found');
    }

    return {
      ...book,
      _id: book._id.toString(), 
    };
  } catch (error) {
    console.error('Error fetching book:', error.message);
    throw new Error('Could not find the book');
  }
};

export default fetchBookData;
