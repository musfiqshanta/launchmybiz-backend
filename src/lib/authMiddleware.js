const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin.js');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;  

  if (!token) {
    return res.status(401).json({ message: 'No token found in cookies' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
