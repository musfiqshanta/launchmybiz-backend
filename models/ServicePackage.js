const mongoose = require('mongoose');

// Schema for the most deeply nested object: Product Options
// e.g., "LLC Operating Agreement Template"
const ProductOptionSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product option name is required.'],
    trim: true,
  },
  packageDisplaySelection: {
    type: String,
    required: true,
    enum: ['Bundled', 'Optional'], // Enforces that the value must be one of these
  },
  price: {
    type: Number,
    // This price is only present when the option is not bundled
    required: function() { return this.packageDisplaySelection === 'Optional'; }
  }
}, { _id: false }); // _id: false because this is a sub-document

// Schema for Product Constraints
// e.g., "Select Speed?"
const ProductConstraintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  minOptions: {
    type: Number,
    required: true,
  },
  maxOptions: {
    type: Number,
    required: true,
  }
}, { _id: false });

// Schema for the main "Product Package"
// e.g., "Business Formation - LLC - California - Complete"
const ProductPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product package name is required.'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Base price for the package is required.'],
  },
  productFamily: {
    type: String,
    required: true,
    default: 'Package'
  },
  productOptions: {
    type: [ProductOptionSchema],
    default: [],
  },
  productConstraints: {
    type: [ProductConstraintSchema],
    default: [],
  }
}, { _id: false });

// The Top-Level Schema for the entire document
const ServicePackageSchema = new mongoose.Schema({
  state: {
    type: String,
    required: [true, 'State is required.'],
    trim: true,
    index: true, // Add an index for faster queries by state
  },
  serviceCategory: {
    type: String,
    required: true,
    trim: true,
    default: 'Business Formation',
  },
  entityType: {
    type: String,
    required: [true, 'Entity type is required (e.g., Limited Liability Company).'],
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  productPackages: {
    type: [ProductPackageSchema],
    required: true,
  }
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true,
  // The collection name in MongoDB will be 'servicepackages'
  collection: 'servicepackages',
});

module.exports = mongoose.model('ServicePackage', ServicePackageSchema);