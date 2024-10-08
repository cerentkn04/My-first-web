import Users from '../../models/user'; 
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY; 

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.uploadDir = path.join(process.cwd(), 'uploads'); 
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing file:', err);
        return res.status(500).json({ error: 'Error parsing file' });
      }

      console.log('Parsed fields:', fields);
      console.log('Parsed files:', files);

      if (!files.image || !files.image[0]) {
        return res.status(400).json({ error: 'Missing file' });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      let user;
      try {
        if (!JWT_SECRET_KEY) {
          throw new Error('JWT_SECRET_KEY is not defined');
        }
        user = jwt.verify(token, JWT_SECRET_KEY); 
      } catch (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      console.log('User from JWT:', user);

   
      const file = files.image[0];
      const filePath = file.filepath;

      try {
     
        const result = await cloudinary.v2.uploader.upload(filePath, {
          resource_type: 'auto', 
        });

        console.log('Cloudinary upload result:', result);

        const updatedUser = await Users.findOneAndUpdate(
          { _id: user.userId }, 
          { pfp: result.secure_url },
          { new: true }
        );

        console.log('Updated user:', updatedUser);

        if (!updatedUser) {
          console.error('User not found with ID:', user.userId);
          return res.status(404).json({ error: 'User not found' });
        }
        
        fs.unlinkSync(filePath);

        return res.status(200).json(updatedUser); 
      } catch (error) {
        console.error('Error updating profile picture:', error);
        return res.status(500).json({ error: 'Error updating profile picture' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
