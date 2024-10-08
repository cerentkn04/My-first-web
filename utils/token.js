import jwt from 'jsonwebtoken';
import User from '../models/user';

const SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET_KEY environment variable is not set');
}


export const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      name: user.name,
      Email: user.Email
    },
    SECRET_KEY,
    {
      expiresIn: '1h', 
    }
  );
};


export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};


export const getUserFromToken = (token) => {
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
};

export const checkUser = async (token) => {
  const userId = getUserFromToken(token);
  if (userId) {
    try {
      const user = await User.findById(userId);
      return user || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }
  return null;
};
