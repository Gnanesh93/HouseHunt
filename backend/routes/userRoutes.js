import express from 'express';
import {register,login,getProfile,updateProfile,browseProperties,viewPropertyDetails,bookProperty,bookingHistory,forgotPassword,logout} from '../controllers/userController.js';
import {protect} from '../middlewares/authMiddleware.js';
import {authorize} from '../middlewares/roleMiddleware.js';
import {registerValidator, loginValidator, bookingValidator} from '../utils/validators.js';

const router = express.Router();

// Public Authentication Routes
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/forgot-password', forgotPassword);
router.post('/logout', logout);

// Public Property Browsing Routes
router.get('/properties', browseProperties);
router.get('/properties/:id', viewPropertyDetails);

// Protected User (Renter) Profile Routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Protected Renter Booking Routes
router.post('/bookings', protect, authorize('user'), bookingValidator, bookProperty);
router.get('/bookings', protect, authorize('user'), bookingHistory);

export default router;
