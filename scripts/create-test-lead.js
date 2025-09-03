import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Lead Schema
const leadSchema = new mongoose.Schema(
  {
    // Contact Information
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      default: "",
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Travel Service Information
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },
    travelDate: {
      type: String,
      required: true,
    },
    travelTime: {
      type: String,
      trim: true,
      default: "",
    },
    returnDate: {
      type: String,
      trim: true,
      default: "",
    },
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },
    dropLocation: {
      type: String,
      trim: true,
      default: "",
    },
    passengers: {
      type: Number,
      default: 1,
      min: 1,
      max: 20,
    },

    // Customer Message
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Lead Management
    status: {
      type: String,
      enum: ["new", "contacted", "confirmed", "completed", "cancelled"],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // Lead Source Tracking
    source: {
      type: String,
      enum: ["website", "whatsapp", "phone", "referral"],
      default: "website",
    },

    // Additional Fields
    estimatedCost: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    reviewLink: {
      type: String,
      trim: true,
      default: "",
    },
    reviewToken: {
      type: String,
      trim: true,
      default: "",
    },

    // Timestamps
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

const testLead = {
  fullName: "Test Customer",
  email: "test@example.com",
  phone: "9876543210",
  serviceType: "Airport Taxi",
  travelDate: "2025-01-15",
  travelTime: "10:00",
  pickupLocation: "Chennai Airport",
  dropLocation: "T. Nagar",
  passengers: 2,
  message: "Need airport pickup service for 2 passengers",
  status: "new",
  priority: "medium",
  source: "website",
  estimatedCost: "₹800",
  notes: "Test lead for review system"
};

async function createTestLead() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    const newLead = new Lead(testLead);
    const savedLead = await newLead.save();
    
    console.log('✓ Test lead created successfully!');
    console.log('Lead ID:', savedLead._id);
    console.log('Customer:', savedLead.fullName);
    console.log('Status:', savedLead.status);
    
    console.log('\nNow you can:');
    console.log('1. Go to admin panel → Lead Manager');
    console.log('2. Find the test lead and edit it');
    console.log('3. Change status to "completed"');
    console.log('4. Save and check for review link');

    process.exit(0);
  } catch (error) {
    console.error('Error creating test lead:', error);
    process.exit(1);
  }
}

createTestLead();