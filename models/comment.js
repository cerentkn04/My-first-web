import mongoose from 'mongoose';
import Users from './user'; // Import the Users model


const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const comments = mongoose.models.comments|| mongoose.model('comments', commentSchema,'comments');
export default comments;
