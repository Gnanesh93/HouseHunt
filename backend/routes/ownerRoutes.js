import express from 'express';
import {getOwnerDashboard,addProperty,updateProperty,deleteProperty,getMyProperties,getMyBookings,updateBookingStatus} from '../controllers/ownerController.js';
import {protect} from '../middlewares/authMiddleware.js';
import {authorize} from '../middlewares/roleMiddleware.js';
import {upload} from '../middlewares/uploadMiddleware.js';
import {propertyValidator} from '../utils/validators.js';

const router = express.Router();

// Apply auth protection & role check to all owner endpoints
router.use(protect);
router.use(authorize('owner'));

// Owner Dashboard
router.get('/dashboard', getOwnerDashboard);

// Property  Routes
router.get('/properties', getMyProperties);
router.post('/properties', upload.array('images', 5), propertyValidator, addProperty);
router.put('/properties/:id', upload.array('images', 5), updateProperty);
router.delete('/properties/:id', deleteProperty);

router.get('/bookings', getMyBookings);
router.put('/bookings/:id/status', updateBookingStatus);

export default router;
