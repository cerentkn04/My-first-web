import dbConnect from "../../utils/dbConnect";
import Users from "../../models/user";
import UserActivityLog from "../../models/userActLog";

const handler = async (req, res) => {
  await dbConnect();
  try {
    const { user, listName } = req.body;
    console.log("user is:", user);
    console.log("list name is", listName);

    const Usr = await Users.findById(user._id);

    if (!Usr) {
      return res.status(404).json({ message: 'User not Found' });
    }

    const newBookList = {
      name: listName,
      books: [],
    };

    Usr.bookLists.push(newBookList);
    await Usr.save();

    await UserActivityLog.create({
      user: user._id,
      actionType: 'create_booklist',
      bookListName: listName, 
    });

    res.status(200).json({ message: 'Book list created successfully', bookLists: Usr.bookLists });
  } catch (error) {
    console.error('Error creating book list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
