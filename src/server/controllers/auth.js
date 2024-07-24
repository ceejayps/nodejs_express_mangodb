import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../database/schemas/user.js';
import { Role } from '../database/schemas/roles.js';

const registerUser = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) return res.status(400).json({ message: 'User already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const role = await Role.findOne({ name: 'public' });
    if (!role) return res.status(500).json({ message: 'Role not found' });

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role: role._id,
    });

    await newUser.save();
    res.status(201).json({ message: 'Registration successful', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const loginUser = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] }).populate('role');
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Invalid username or password' });

    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET);
    res.json({ message: 'Login successful', accessToken, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { registerUser, loginUser };
