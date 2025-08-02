const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  // Contact Information
  Contact: {
    ContactEmail: { type: String, required: true },
    ContactFirstName: { type: String, required: true },
    ContactLastName: { type: String, required: true },
    ContactPhone: { type: String, required: true },
    ContactEveningPhone: { type: String }
  },

  // Company Information
  CompanyInfo: {
    CompanyDesiredName: { type: String, required: true },
    CompanyAlternativeName: { type: String },
    CompanyBusinessCategory: { type: String, required: true },
    CompanyBusinessDescription: { type: String, required: true },
    socialNumber: { type: String }
  },

  // Business Address
  BusinessAddress: {
    BusinessAddressCountry: { type: String, required: true },
    BusinessAddressAddress1: { type: String, required: true },
    BusinessAddressAddress2: { type: String },
    BusinessAddressCity: { type: String, required: true },
    BusinessAddressState: { type: String, required: true },
    BusinessAddressZip: { type: String, required: true }
  },

  // Registered Agent
  RegisterAgent: {
    RegisteredAgentIsCorpnetAgent: { type: Boolean, default: false },
    RegisteredAgentFirstName: { type: String },
    RegisteredAgentLastName: { type: String },
    RegisteredAgentAddress1: { type: String },
    RegisteredAgentAddress2: { type: String },
    RegisteredAgentCity: { type: String },
    RegisteredAgentState: { type: String },
    RegisteredAgentZip: { type: String },
    RegisteredAgentCountry: { type: String, default: 'US' }
  },

  // Company Participants
  CompanyParticipants: [{
    Type: { type: String, enum: ['Individual', 'Entity'], required: true },
    FirstName: { type: String, required: true },
    MiddleInitial: { type: String },
    LastName: { type: String, required: true },
    Titles: { type: [String], default: [] },
    MailingAddress: {
      Address1: { type: String },
      Address2: { type: String },
      City: { type: String },
      State: { type: String },
      Zip: { type: String },
      Country: { type: String, default: 'US' }
    },
    OwnershipPercentage: { type: Number, required: true },
    IsAuthorizedSigner: { type: Boolean, default: false },
    socialNumber:{ type: String,default:'' }
  }],

  // Package Information
  selectedPackage: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    totalPrice: { type: Number, required: true }
  },

  // Filing Details
  filingSpeed: { type: String, required: true },

  // Stripe Checkout
  stripeCheckoutId: { type: String },
  paymentStatus: { type: String, default: 'pending' },
  paymentAmount: { type: Number },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Business', BusinessSchema);