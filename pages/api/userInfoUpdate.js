import dbConnect from "../../utils/dbConnect";
import Users from '../../models/user';
import { verifyToken } from '../../utils/token';
const handler= async(req,res)=>{
     const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        res.status(401).json({message:"Unauthorized"});
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.log('decoded is:',decoded);
   
    const{ name, password }= req.body;
    await dbConnect();
    try{
        const user = await Users.findById(decoded.userId);
        if(!user){
            return res.status(404).json({message: ' User not found'})
        }
        if(name){
            user.name = name;
        }
        if (password) {
            user.password = password; 
        }
        await user.save();
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
export default handler;