import Users from '../../models/user'; 

const  handler= async(req, res)=> {
  if (req.method === 'POST') {
    const { userId, visibility } = req.body;

    try {
      await Users.findByIdAndUpdate(userId, { visibility });
      res.status(200).json({ message: 'Visibility updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update visibility' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
export default handler
