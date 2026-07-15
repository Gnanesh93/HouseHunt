import express from 'express';
import {getAdminDashboard,getAllUsers,deleteUser,getAllProperties,deleteProperty,getAllBookings} from '../controllers/adminController.js';
import {protect} from '../middlewares/authMiddleware.js';
import {authorize} from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Apply auth protection & role check to all admin endpoints
router.use(protect);
router.use(authorize('admin'));

//Admin Dashboard
router.get('/dashboard', getAdminDashboard);

//User Management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

router.get('/properties', getAllProperties);
router.delete('/properties/:id', deleteProperty);

router.get('/bookings', getAllBookings);

export default router;
