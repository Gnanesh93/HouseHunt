import jwt from 'jsonwebtoken';
import User from '../models/UserSchema.js';
import {sendError} from '../utils/responseHandler.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Read token from Authorization Header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 2. Fallback to reading token from Cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return sendError(res, 'Not authorized, login session token is missing', null, 401);
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_change_me_in_production';
    const decoded = jwt.verify(token, secret);

    // Fetch user and attach to request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return sendError(res, 'User associated with this token no longer exists', 401);
    }

    req.user = user;
    next();
  } 
  catch (error) {
    // Pass errors down to centralized error middleware
    next(error);
  }
};
