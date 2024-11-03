// controllers/userController.js
import User from '../models/userInfo.js'; // Adjust the path according to your project structure

// Fetch user by email
export const getUserByEmail = async (req, res) => {
  const { email } = req.query; // Get email from query parameters

  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  try {
    // Query for user by email, checking both Email_Address and Email_Address_2 fields
    const user = await User.findOne({
      $or: [{ Email_Address: email }, { Email_Address_2: email }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optionally, you can omit sensitive information like passwords here
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch paginated and filtered user records
export const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';

  try {
    const skip = (page - 1) * limit;

    // Create a dynamic filter to apply search across all string fields in the User model
    const filter = {
      $or: [
        { Model_Type: { $regex: search, $options: 'i' } },
        { Stage_Name: { $regex: search, $options: 'i' } },
        { Model_Insta_Link: { $regex: search, $options: 'i' } },
        { Email_Address: { $regex: search, $options: 'i' } },
        { Photographer_Insta_Link: { $regex: search, $options: 'i' } },
        { Mua_Stage_Name: { $regex: search, $options: 'i' } },
        { Mua_Insta_link: { $regex: search, $options: 'i' } },
        { Phone_Number_2: { $regex: search, $options: 'i' } },
        { Country: { $regex: search, $options: 'i' } },
      ],
    };

    // Fetch users with pagination and the constructed filter
    const users = await User.find(filter).skip(skip).limit(limit).lean();
    const totalUsers = await User.countDocuments(filter);

    res.json({
      totalRecords: totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      users, // return the filtered users
    });
  } catch (err) {
    res.status(500).json({ error: `Error retrieving users: ${err.message}` });
  }
};
