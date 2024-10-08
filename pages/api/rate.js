// pages/api/rate.js

import cookie from 'cookie';
import dbConnect from '../../utils/dbConnect'; 
import Rating from '../../models/rate'; 
import Book from '../../models/book';
import { checkUser } from '../../utils/token';
import UserActivityLog from '../../models/userActLog';


export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
   
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token; 

    if (!token) {
      return res.status(401).json({ message: 'You must be logged in to rate a book.' });
    }

    const user = await checkUser(token);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user not found.' });
    }

    const { book_Id, rating } = req.body;

    if (!book_Id || !rating) {
      return res.status(400).json({ message: 'Book ID and rating are required.' });
    }

    try {

      const existingRating = await Rating.findOne({ book_Id, userId: user._id });

      if (existingRating) {
       
        existingRating.rating = rating;
        await existingRating.save();

        await UserActivityLog.create({
          user: user._id,
          actionType: 'rate',
          book: book_Id,
          rate: existingRating._id 
        });

        return res.status(200).json({ 
            success: true, 
         
            message: existingRating ? 'Rating updated successfully! 👍' : 'Rating created successfully! ⭐'
          });

      } else {
   
        const newRating = await Rating.create({
          book_Id,
          userId: user._id,
          rating
        });

        await UserActivityLog.create({
          user: user._id,
          actionType: 'rate',
          book: book_Id,
          rate: newRating._id 
        });

        const ratings = await Rating.find({ book_Id });
        const totalRatingSum = ratings.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = totalRatingSum / ratings.length;

        await Book.findByIdAndUpdate(book_Id, { averageRating: avgRating });

        return res.status(201).json({ message: 'Rating created successfully.', rating: newRating, averageRating: avgRating });
      }
    } catch (error) {
      console.error('Error processing rating:', error);
      return res.status(500).json({ message: 'Failed to process rating.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
