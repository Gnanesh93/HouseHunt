import {sendError} from '../utils/responseHandler.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication context is missing', null, 401);
    }

    if (!roles.includes(req.user.role)) {
      const message = `User role '${req.user.role}' is not authorized to access this route`;
      return sendError(res, message, null, 403);
    }

    next();
  };
};
