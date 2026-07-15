import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner reference is required']
    },
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
      minlength: [10, 'Description must be at least 10 characters']
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      trim: true
    },
    listingType: {
      type: String,
      required: [true, 'Listing type is required'],
      trim: true
    },
    rentAmount: {
      type: Number,
      required: [true, 'Rent amount is required'],
      min: [0, 'Rent amount cannot be negative']
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required'],
      min: [0, 'Security deposit cannot be negative']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: [0, 'Number of bedrooms cannot be negative']
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [0, 'Number of bathrooms cannot be negative']
    },
    furnishing: {
      type: String,
      enum: {
        values: ['unfurnished', 'semi-furnished', 'fully-furnished'],
        message: '{VALUE} is not a valid furnishing option'
      },
      required: [true, 'Furnishing status is required']
    },
    amenities: {
      type: [String],
      default: []
    },
    images: {
      type: [String],
      default: []
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast searching and filtering
PropertySchema.index({ city: 1, available: 1 });
PropertySchema.index({ rentAmount: 1 });
PropertySchema.index({ ownerId: 1 });
PropertySchema.index({ propertyType: 1 });

const Property = mongoose.model('Property', PropertySchema);
export default Property;
