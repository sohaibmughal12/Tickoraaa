import mongoose from 'mongoose';

const specificationSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const variantSchema = new mongoose.Schema({
  color: String,          // e.g., Gold, Rose Gold, Midnight Black
  strapMaterial: String,  // e.g., Genuine Leather, Stainless Steel Mesh, Silicone
  stock: { type: Number, default: 0, min: 0 }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a product name'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Please enter a product description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative'],
    validate: {
      validator: function(value) {
        return !value || value < this.price;
      },
      message: 'Discount price must be less than the original price'
    }
  },
  images: [{
    type: String,
    required: [true, 'Please upload at least one image']
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category']
  },
  stock: {
    type: Number,
    required: [true, 'Please specify stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    required: [true, 'Please enter SKU code'],
    unique: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex'],
    default: 'Unisex'
  },
  movement: {
    type: String,
    enum: ['Automatic', 'Quartz', 'Manual', 'Smart'],
    required: [true, 'Please specify movement type']
  },
  dialColor: {
    type: String,
    required: true
  },
  variants: [variantSchema],
  specifications: [specificationSchema],
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isLimitedEdition: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

// Pre-validate slug generation
productSchema.pre('validate', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
