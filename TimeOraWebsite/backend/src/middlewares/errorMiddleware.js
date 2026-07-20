import ApiResponse from '../utils/apiResponse.js';

// 404 Route Not Found handler
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Express Exception handler
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose cast error (invalid Object ID)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Resource not found. Invalid ID format.';
  }

  // Handle Mongoose duplicate key error (duplicate email, sku, etc.)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered: '${field}'. Please use another value.`;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Handle JsonWebToken errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Access denied.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired. Please login again.';
  }

  console.error(`[Error Middleware] ${err.stack}`);

  return ApiResponse.error(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'production' ? null : { stack: err.stack }
  );
};
