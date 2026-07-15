import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property reference is required']
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner reference is required']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User (Renter) reference is required']
    },
    bookingDate: {
      type: Date,
      default: Date.now
    },
    moveInDate: {
      type: Date,
      required: [true, 'Move-in date is required']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected', 'cancelled'],
        message: '{VALUE} is not a valid booking status'
      },
      default: 'pending'
    },
    message: {
      type: String,
      default: ''
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required']
    }
  },
  {
    timestamps: true
  }
);

// Indexes
BookingSchema.index({ userId: 1 });
BookingSchema.index({ ownerId: 1 });
BookingSchema.index({ propertyId: 1 });
BookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
