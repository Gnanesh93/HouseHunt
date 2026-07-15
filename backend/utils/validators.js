import { body, validationResult } from 'express-validator';
import { sendError } from './responseHandler.js';

// Middleware to check validation results and handle errors

export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    return sendError(res, 'Input validation failed', formattedErrors, 400);
  }
  next();
};

/// Registration validation rules
export const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 digits'),
  body('role')
    .optional()
    .isIn(['user', 'owner']).withMessage('Role must be either user (renter) or owner'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Address cannot exceed 200 characters'),
  validateResult
];

//  Login Validation Rules
export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validateResult
];

//  * Property Creation/Update Validation Rules
export const propertyValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Property title is required')
    .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
  body('propertyType')
    .trim()
    .notEmpty().withMessage('Property type is required'),
  body('listingType')
    .trim()
    .notEmpty().withMessage('Listing type is required'),
  body('rentAmount')
    .notEmpty().withMessage('Rent amount is required')
    .isFloat({ min: 0 }).withMessage('Rent amount must be a positive number'),
  body('securityDeposit')
    .notEmpty().withMessage('Security deposit is required')
    .isFloat({ min: 0 }).withMessage('Security deposit must be a positive number'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('state')
    .trim()
    .notEmpty().withMessage('State is required'),
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required'),
  body('pincode')
    .trim()
    .notEmpty().withMessage('Pincode is required')
    .isNumeric().withMessage('Pincode must be numeric')
    .isLength({ min: 5, max: 8 }).withMessage('Pincode must be between 5 and 8 digits'),
  body('bedrooms')
    .notEmpty().withMessage('Number of bedrooms is required')
    .isInt({ min: 0 }).withMessage('Bedrooms must be a positive integer'),
  body('bathrooms')
    .notEmpty().withMessage('Number of bathrooms is required')
    .isInt({ min: 0 }).withMessage('Bathrooms must be a positive integer'),
  body('furnishing')
    .trim()
    .notEmpty().withMessage('Furnishing status is required')
    .isIn(['unfurnished', 'semi-furnished', 'fully-furnished']).withMessage('Invalid furnishing status'),
  body('amenities')
    .optional()
    .custom(value => {
      if (typeof value === 'string') return true;
      if (Array.isArray(value)) {
        return value.every(item => typeof item === 'string');
      }
      return false;
    }).withMessage('Amenities must be a string or array of strings'),
  validateResult
];

// Booking Creation Validation Rules
export const bookingValidator = [
  body('propertyId')
    .notEmpty().withMessage('Property ID is required')
    .isMongoId().withMessage('Invalid Property ID format'),
  body('moveInDate')
    .notEmpty().withMessage('Move-in date is required')
    .isISO8601().withMessage('Please provide a valid ISO8601 date'),
  body('contactNumber')
    .trim()
    .notEmpty().withMessage('Contact number is required')
    .isLength({ min: 10, max: 15 }).withMessage('Contact number must be between 10 and 15 digits'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters'),
  validateResult
];
