import dbConnect from '../../../utils/dbConnect';
import Rate from '../../../models/rate'; // Ensure this model is correct

export default async function handler(req, res) {
  const { book_Id } = req.query;

  await dbConnect();

  try {
    // Fetch all ratings for the given book
    const ratings = await Rate.find({ book_Id });

    if (ratings.length === 0) {
      return res.status(200).json({
        averageRating: 0,
        ratingsCount: 0,
      });
    }

    // Calculate the total rating using the correct field name
    const totalRating = ratings.reduce((sum, rate) => sum + rate.rating, 0);
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
    const ratingsCount = ratings.length;

    console.log('Total Rating:', totalRating); // Log to verify
    console.log('Average Rating:', averageRating); 
    console.log("ratings: ",ratings.length)
    

    return res.status(200).json({
      averageRating: averageRating || 0,
      ratingsCount: ratingsCount || 0,
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return res.status(500).json({ message: 'Failed to fetch ratings.' });
  }
} 