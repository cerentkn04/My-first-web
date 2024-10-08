import dbConnect from '../../utils/dbConnect';
import Users from '../../models/user';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        const { userIds } = req.body;
        try {
            const users = await Users.find({ _id: { $in: userIds } }).select('name pfp');
            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
