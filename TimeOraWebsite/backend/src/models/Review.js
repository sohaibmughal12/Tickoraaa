import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [1, 'Rating must be at least 1 star'],
    max: [5, 'Rating cannot exceed 5 stars']
  },
  comment: {
    type: String,
    required: [true, 'Please enter a review description'],
    trim: true
  },
  images: [String],
  isVerifiedBuyer: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false // Admin approval flow
  }
}, {
  timestamps: true
});

// Compound index to restrict one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method to calculate average rating of a product
reviewSchema.statics.calculateAverageRating = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId, isApproved: true }
    },
    {
      $group: {
        _id: '$product',
        numReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model('Product').findByIdAndUpdate(productId, {
        ratings: Math.round(stats[0].avgRating * 10) / 10,
        numReviews: stats[0].numReviews
      });
    } else {
      await mongoose.model('Product').findByIdAndUpdate(productId, {
        ratings: 0,
        numReviews: 0
      });
    }
  } catch (err) {
    console.error('Error updating average product rating: ', err);
  }
};

// Update avgRating on save
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.product);
});

// Update avgRating on delete
reviewSchema.post('findOneAndDelete', function(doc) {
  if (doc) {
    doc.constructor.calculateAverageRating(doc.product);
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
