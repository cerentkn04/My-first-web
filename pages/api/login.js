import dbConnect from "../../utils/dbConnect";
import Users from "../../models/user";
import { generateToken } from "../../utils/token";
import cookie from 'cookie';

export default async function Login(req,res){
    console.log('Request method:', req.method); 

    if( req.method ==='POST'){
        await dbConnect();

        try{
            const {email,password} = req.body;
            console.log(email);
          const logUser = await Users.findOne({Email: email});
          if(!logUser){
              return res.status(401).json({ message: 'Invalid credentials' });
          }
          const isMatch = await logUser.comparePassword(password);
          if(!isMatch){
              return res.status(401).json({message: 'Password Incorrect'});
          }
          const token = generateToken(logUser);

          res.setHeader('Set-Cookie', cookie.serialize('token', token, {
            secure: process.env.NODE_ENV !== 'development', 
            maxAge: 60 * 60 * 24 * 7,           
            sameSite: 'strict',
            path: '/',               
          }));

        return res.status(200).json({ message: 'Login successful' , redirectTo: '/'});
      } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }


}