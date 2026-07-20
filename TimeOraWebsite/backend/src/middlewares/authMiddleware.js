import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiResponse from '../utils/apiResponse.js';

// Protect routes for logged-in users
export const protect = async (req, res, next) => {
  let token;

  // Retrieve token from authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user and attach to request object
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return ApiResponse.error(res, 'User not found with this token.', 401);
      }

      return next();
    } catch (error) {
      console.error('Authentication check failed:', error);
      return ApiResponse.error(res, 'Not authorized, token validation failed.', 401);
    }
  }

  if (!token) {
    return ApiResponse.error(res, 'Not authorized, login required.', 401);
  }
};

// Check if authenticated user is an administrator
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return ApiResponse.error(res, 'Not authorized as an administrator.', 403);
};
