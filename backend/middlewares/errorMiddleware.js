import { sendError } from '../utils/responseHandler.js';

// Global Error Handler Middleware
const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for developers in development mode
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Error Middleware Catch]', err);
  }

  // 1. Mongoose Bad ObjectId (Cast Error)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    return sendError(res, message, null, 404);
  }

  // 2. Mongoose Duplicate Key Error (MongoDB Code 11000)
  if (err.code === 11000) {
    const fieldName = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered: '${fieldName}'. Please use another value.`;
    return sendError(res, message, null, 400);
  }

  // 3. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return sendError(res, message, null, 400);
  }

  // 4. JWT WebTokenError (Invalid signature, etc.)
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Not authorized, token validation failed', null, 401);
  }

  // 5. JWT TokenExpiredError
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Not authorized, token has expired', null, 401);
  }

  // Default: Internal Server Error (500)
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  return sendError(res, message, null, statusCode);
};

export default errorMiddleware;
