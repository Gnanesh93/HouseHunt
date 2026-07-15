import User from '../models/UserSchema.js';
import Property from '../models/PropertySchema.js';
import Booking from '../models/BookingSchema.js';
import generateToken from '../utils/generateToken.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// 1.user registration
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, address } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendError(res, 'User with this email already exists', null, 400);
    }

    // Create user record
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'user',
      address: address || ''
    });

    if (user) {
      // Generate session JWT
      const token = generateToken(res, user._id);

      return sendSuccess(
        res,
        'Registration successful',
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          address: user.address,
          token
        },
        201
      );
    } else {
      return sendError(res, 'Invalid user data provided', null, 400);
    }
  } 
  catch (error) {
    next(error);
  }
};

// 2.Authenticate user login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Retrieve user including password
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 'Invalid email or password', null, 401);
    }

    // Match input password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', null, 401);
    }

    // Generate session JWT
    const token = generateToken(res, user._id);

    return sendSuccess(res, 'Login successful', {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      token
    });
  } 
  catch (error) {
    next(error);
  }
};

// 3.Get current logged in user profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return sendError(res, 'User profile not found', null, 404);
    }
    return sendSuccess(res, 'Profile fetched successfully', user);
  } 
  catch (error) {
    next(error);
  }
};

// 4.update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendError(res, 'User profile not found', null, 404);
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    if (req.body.profileImage) {
      user.profileImage = req.body.profileImage;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    return sendSuccess(res, 'Profile updated successfully', {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      address: updatedUser.address,
      profileImage: updatedUser.profileImage
    });
  } catch (error) {
    next(error);
  }
};

// browse properties
export const browseProperties = async (req, res, next) => {
  try {
    const {
      city,
      propertyType,
      listingType,
      minRent,
      maxRent,
      bedrooms,
      furnishing,
      search
    } = req.query;

    // Filter base object
    const query = { available: true };

    // Apply explicit search filters
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    if (propertyType) {
      query.propertyType = propertyType;
    }
    if (listingType) {
      query.listingType = listingType;
    }
    if (bedrooms) {
      query.bedrooms = parseInt(bedrooms, 10);
    }
    if (furnishing) {
      query.furnishing = furnishing;
    }

    // Apply range queries
    if (minRent || maxRent) {
      query.rentAmount = {};
      if (minRent) query.rentAmount.$gte = parseFloat(minRent);
      if (maxRent) query.rentAmount.$lte = parseFloat(maxRent);
    }

    // General text searching on titles & descriptions
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const properties = await Property.find(query)
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Properties fetched successfully', properties);
  } catch (error) {
    next(error);
  }
};

// 5.view specific property details
export const viewPropertyDetails = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('ownerId', 'name email phone profileImage');

    if (!property) {
      return sendError(res, 'Property listing not found', null, 404);
    }

    return sendSuccess(res, 'Property details fetched successfully', property);
  } 
  catch (error) {
    next(error);
  }
};
// 6.Book a property
export const bookProperty = async (req, res, next) => {
  try {
    const { propertyId, moveInDate, contactNumber, message } = req.body;

    // Check if property exists & is available
    const property = await Property.findById(propertyId);
    if (!property) {
      return sendError(res, 'Property not found', null, 404);
    }
    if (!property.available) {
      return sendError(res, 'Property is no longer available for booking', null, 400);
    }

    // Make sure renter isn't booking their own property
    if (property.ownerId.toString() === req.user._id.toString()) {
      return sendError(res, 'Owners cannot book their own property listing', null, 400);
    }

    // Create booking document
    const booking = await Booking.create({
      propertyId,
      ownerId: property.ownerId,
      userId: req.user._id,
      moveInDate,
      contactNumber,
      message: message || '',
      status: 'pending'
    });

    return sendSuccess(res, 'Booking request submitted successfully', booking, 201);
  } catch (error) {
    next(error);
  }
};

// Get Booking History for Current Renter
export const bookingHistory = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('propertyId')
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Booking history retrieved successfully', bookings);
  } 
  catch (error) {
    next(error);
  }
};

// Forgot Password handler
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 'User with that email address does not exist', null, 404);
    }

    return sendSuccess(res, 'Password reset link instructions sent to your email address', {
      email,
      actionRequired: 'Simulated email reset link triggered. Reset instructions dispatched.'
    });
  } 
  catch (error) {
    next(error);
  }
};

// logout user
export const logout = async (req, res, next) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0)
    });
    return sendSuccess(res, 'Logged out successfully');
  } 
  catch (error) {
    next(error);
  }
};
