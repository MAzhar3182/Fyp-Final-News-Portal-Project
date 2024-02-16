import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    req.user = user; // Attach user data to the request
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

export default authenticateUser;
