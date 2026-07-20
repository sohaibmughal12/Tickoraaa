import { validationResult } from 'express-validator';
import ApiResponse from '../utils/apiResponse.js';

// Middleware to capture and process validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.error(
      res,
      'Validation parameters failed.',
      400,
      errors.array().map(err => ({ field: err.path, message: err.msg }))
    );
  }
  next();
};

export default validateRequest;
