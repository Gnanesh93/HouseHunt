import User from '../models/UserSchema.js';
import Property from '../models/PropertySchema.js';
import Booking from '../models/BookingSchema.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// admin dashboard
export const getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // 1. User role distribution counts
    const totalRenters = await User.countDocuments({ role: 'user' });
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // 2. Property availability counts
    const availableProperties = await Property.countDocuments({ available: true });
    const rentedProperties = await Property.countDocuments({ available: false });

    // 3. Calculate total revenue generated from approved booking leases
    const approvedBookings = await Booking.find({ status: 'approved' }).populate('propertyId');
    const totalRevenue = approvedBookings.reduce((sum, booking) => {
      return sum + (booking.propertyId ? booking.propertyId.rentAmount : 0);
    }, 0);

    return sendSuccess(res, 'Admin analytics fetched successfully', {
      totalUsers,
      totalProperties,
      totalBookings,
      totalRevenue,
      usersDistribution: {
        renters: totalRenters,
        owners: totalOwners,
        admins: totalAdmins
      },
      propertiesStatus: {
        available: availableProperties,
        rented: rentedProperties
      }
    });
  } 
  catch (error) {
    next(error);
  }
};

// View All Registered Users by admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return sendSuccess(res, 'Users list retrieved successfully', users);
  } 
  catch (error) {
    next(error);
  }
};

// delete user
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return sendError(res, 'User record not found', null, 404);
    }

    // Protect against self deletion
    if (user._id.toString() === req.user._id.toString()) {
      return sendError(res, 'Administrators cannot delete their own profile', null, 400);
    }

    if (user.role === 'owner') {
      // Find properties owned by owner
      const properties = await Property.find({ ownerId: userId });
      const propertyIds = properties.map(p => p._id);

      // Delete properties and corresponding bookings
      await Property.deleteMany({ ownerId: userId });
      await Booking.deleteMany({ propertyId: { $in: propertyIds } });
    } 
    else if (user.role === 'user') {
      // Delete bookings made by renter
      await Booking.deleteMany({ userId });
    }
    // Delete user profile
    await User.findByIdAndDelete(userId);

    return sendSuccess(res, `User profile '${user.name}' and all associated records deleted successfully`);
  } 
  catch (error) {
    next(error);
  }
};

// View All Platform Properties
export const getAllProperties = async (req, res, next) => {
  try {
    const properties = await Property.find()
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'All platform properties retrieved successfully', properties);
  } 
  catch (error) {
    next(error);
  }
};

//Delete any Property
export const deleteProperty = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);

    if (!property) {
      return sendError(res, 'Property not found', null, 404);
    }

    // Delete property and corresponding bookings
    await Property.findByIdAndDelete(propertyId);
    await Booking.deleteMany({ propertyId });

    return sendSuccess(res, 'Property and all associated bookings deleted successfully');
  } catch (error) {
    next(error);
  }
};

// View All Platform Bookings
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('propertyId', 'title rentAmount city')
      .populate('ownerId', 'name email phone')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'All platform bookings retrieved successfully', bookings);
  } 
  catch (error) {
    next(error);
  }
};
