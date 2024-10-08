import dbConnect from '../../utils/dbConnect'; 
import Users from '../../models/user';  
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

dbConnect(); 

export default async function handler(req, res) {
    console.log('API route hit');
    if (req.method === 'POST') {
        try {
            console.log('Received request:', req.body);
            const { token, book, list } = req.body;

            const secret = process.env.JWT_SECRET_KEY;
            if (!secret) {
                return res.status(500).json({ message: 'JWT secret key not configured' });
            }

            const decoded = jwt.verify(token, secret);
            console.log("decoded is: " ,decoded);
            const userId = decoded.userId;


            const user = await Users.findById(userId);
            console.log('User:', user);
            if (!user) {
                console.log('User not found');
                return res.status(404).json({ message: 'User not found' });
            }

            if (!mongoose.Types.ObjectId.isValid(book._id)) {
                console.log('Invalid book ID');
                return res.status(400).json({ message: 'Invalid book ID' });
            }

            if (!Array.isArray(user.bookLists)) {
                console.log('Invalid bookLists');
                return res.status(500).json({ message: 'Internal server error' });
            }

            const bookList = user.bookLists.find(b => b.name === list);
            if (!bookList) {
                console.log('Book list not found');
                return res.status(404).json({ message: 'Book list not found' });
            }

            if (!bookList.books.includes(book._id)) {
                bookList.books.push(book._id);
                await Users.findByIdAndUpdate(userId, { bookLists: user.bookLists });
            }

            res.status(200).json({ message: 'Book added to favorites' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
