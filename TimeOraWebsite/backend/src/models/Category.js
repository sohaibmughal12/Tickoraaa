import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a category name'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Please enter a category description'],
  },
  image: {
    type: String,
    default: '',
  }
}, {
  timestamps: true
});

// Pre-save slug generation
categorySchema.pre('validate', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
