import Property from '../models/PropertySchema.js';
import Booking from '../models/BookingSchema.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// Get Owner Dashboard Analytics
export const getOwnerDashboard = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    // 1. Get total listings owned
    const totalProperties = await Property.countDocuments({ ownerId });

    // 2. Fetch properties to calculate statistics
    const properties = await Property.find({ ownerId });
    const propertyIds = properties.map(p => p._id);

    // 3. Count incoming bookings
    const bookings = await Booking.find({ propertyId: { $in: propertyIds } });
    
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const approvedBookings = bookings.filter(b => b.status === 'approved').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

    // 4. Calculate total revenue (approved bookings rentAmount)
    const populatedBookings = await Booking.find({ 
      propertyId: { $in: propertyIds }, 
      status: 'approved' 
    }).populate('propertyId');

    const totalEarnings = populatedBookings.reduce((sum, booking) => {
      return sum + (booking.propertyId ? booking.propertyId.rentAmount : 0);
    }, 0);

    return sendSuccess(res, 'Dashboard metrics fetched successfully', {
      totalProperties,
      totalBookings: bookings.length,
      pendingBookings,
      approvedBookings,
      cancelledBookings,
      totalEarnings
    });
  } catch (error) {
    next(error);
  }
};

// Add a New Property
export const addProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      propertyType,
      listingType,
      rentAmount,
      securityDeposit,
      city,
      state,
      address,
      pincode,
      bedrooms,
      bathrooms,
      furnishing,
      amenities
    } = req.body;

    // Extract image file paths from request
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Process amenities (if passed as JSON string or parsed array)
    let parsedAmenities = [];
    if (amenities) {
      if (typeof amenities === 'string') {
        try {
          parsedAmenities = JSON.parse(amenities);
        } catch {
          parsedAmenities = amenities.split(',').map(item => item.trim());
        }
      } else if (Array.isArray(amenities)) {
        parsedAmenities = amenities;
      }
    }

    const property = await Property.create({
      ownerId: req.user._id,
      title,
      description,
      propertyType,
      listingType,
      rentAmount: parseFloat(rentAmount),
      securityDeposit: parseFloat(securityDeposit),
      city,
      state,
      address,
      pincode,
      bedrooms: parseInt(bedrooms, 10),
      bathrooms: parseInt(bathrooms, 10),
      furnishing,
      amenities: parsedAmenities,
      images,
      available: true
    });

    return sendSuccess(res, 'Property listed successfully', property, 201);
  } 
  catch (error) {
    next(error);
  }
};

// Update an Existing Property
export const updateProperty = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);

    if (!property) {
      return sendError(res, 'Property not found', null, 404);
    }

    // Check ownership authorization
    if (property.ownerId.toString() !== req.user._id.toString()) {
      return sendError(res, 'Unauthorized to update this property listing', null, 403);
    }

    // Map fields dynamically
    const fieldsToUpdate = [
      'title', 'description', 'propertyType', 'listingType', 
      'rentAmount', 'securityDeposit', 'city', 'state', 
      'address', 'pincode', 'bedrooms', 'bathrooms', 
      'furnishing', 'available'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        property[field] = req.body[field];
      }
    });

    // Handle amenities
    if (req.body.amenities !== undefined) {
      let parsedAmenities = [];
      if (typeof req.body.amenities === 'string') {
        try {
          parsedAmenities = JSON.parse(req.body.amenities);
        } catch {
          parsedAmenities = req.body.amenities.split(',').map(item => item.trim());
        }
      } else if (Array.isArray(req.body.amenities)) {
        parsedAmenities = req.body.amenities;
      }
      property.amenities = parsedAmenities;
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      // Append or replace? We'll replace/update images if specified, or append
      if (req.body.replaceImages === 'true') {
        property.images = newImages;
      } else {
        property.images = [...property.images, ...newImages];
      }
    }

    const updatedProperty = await property.save();

    return sendSuccess(res, 'Property updated successfully', updatedProperty);
  } 
  catch (error) {
    next(error);
  }
};

// Delete a Property
export const deleteProperty = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);

    if (!property) {
      return sendError(res, 'Property not found', null, 404);
    }

    // Check ownership authorization
    if (property.ownerId.toString() !== req.user._id.toString()) {
      return sendError(res, 'Unauthorized to delete this property listing', null, 403);
    }

    // Remove listings and all corresponding bookings
    await Property.findByIdAndDelete(propertyId);
    await Booking.deleteMany({ propertyId });

    return sendSuccess(res, 'Property and all associated bookings deleted successfully');
  } catch (error) {
    next(error);
  }
};

// View Properties Owned by Logged-in Owner
 
export const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ ownerId: req.user._id })
      .sort({ createdAt: -1 });
    return sendSuccess(res, 'Properties retrieved successfully', properties);
  } 
  catch (error) {
    next(error);
  }
};

// View Booking Requests for Owner's Properties
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ ownerId: req.user._id })
      .populate('propertyId')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Tenant bookings retrieved successfully', bookings);
  } 
  catch (error) {
    next(error);
  }
};

// Approve or Reject a Tenant Booking Request
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    if (!['approved', 'rejected'].includes(status)) {
      return sendError(res, 'Invalid booking status status change. Use approved or rejected.', null, 400);
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return sendError(res, 'Booking request not found', null, 404);
    }

    // Verify ownership authorization
    if (booking.ownerId.toString() !== req.user._id.toString()) {
      return sendError(res, 'Unauthorized to update booking status for this property', null, 403);
    }

    booking.status = status;
    await booking.save();

    // If approved, update property availability status (optionally)
    if (status === 'approved') {
      await Property.findByIdAndUpdate(booking.propertyId, { available: false });
    }

    return sendSuccess(res, `Booking request ${status} successfully`, booking);
  } 
  catch (error) {
    next(error);
  }
};
