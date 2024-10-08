import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define a schema for BookList
const BookListSchema = new mongoose.Schema({
  name: { type: String, required: true },  
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }], 
  visibility: {
    type: String,
    enum: ['public', 'private', 'locked'], 
    required: true  
  }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
  },
  Email: {
    type: String,
    sparse: true,
    unique: true, 
  },
  pfp: {
    type: String,
  },
  visibility: { type: Boolean, default: true } ,
  followers: { type: [String] },
  followings: { type: [String] },
  bookLists: {
    type: [BookListSchema],
    default: [
      { name: 'Favorites', books: [] },
      { name: 'Read Later', books: [] } 
    ],
  }
});

UserSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.models.Users || mongoose.model('Users', UserSchema);

export default UserModel;
