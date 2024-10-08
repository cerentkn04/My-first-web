
import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  rate: { type: Number, required: true, min:[0], max: [5]},
  page: { type: Number, required: true },
  published_Year: { type: Number, required: true },
  image: { type: String },
  averageRating: { type: Number, default: 0, min: [0], max: [5] }, 
  tags: { type: [String] },
  literary_type: {type:String},
});

export default mongoose.models.Book || mongoose.model('Book', BookSchema, 'books');