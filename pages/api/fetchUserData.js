import dbConnect from '../../utils/dbConnect';
import User from '../../models/user';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY ;
export const fetchUserData = async (name, token) => {
  try {
 
    jwt.verify(token, SECRET_KEY);

    await dbConnect();

    const user = await User.findOne({ name: name });

    if (!user) {
      throw new Error('User not found');
    }


    return {
      name: user.name,
      Email: user.Email,
   
    };
  } catch (error) {
    throw new Error('Failed to fetch user data: ' + error.message);
  }

};
