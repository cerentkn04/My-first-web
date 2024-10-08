import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
  book_Id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Book' },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

RatingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const RateModel = mongoose.models.rates || mongoose.model('rates', RatingSchema,'rates');
export default RateModel;
