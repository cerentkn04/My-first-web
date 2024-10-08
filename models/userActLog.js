import mongoose from 'mongoose';


const userActivityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },  
  actionType: { type: String, enum: ['rate', 'comment', 'create_booklist'], required: true },  
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },  
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'comments' },  
  rate: { type: mongoose.Schema.Types.ObjectId, ref: 'rates' }, 
  bookListName: { type: String }, 
  timestamp: { type: Date, default: Date.now } 
});

const UserActivityLog = mongoose.models.UserActivityLog || mongoose.model('UserActivityLog', userActivityLogSchema);
export default UserActivityLog;
