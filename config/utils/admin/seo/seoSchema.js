import mongoose from "mongoose";

const seoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
      index: { unique: true }
    },
    pageName: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    keywords: {
      type: String,
      trim: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better performance
seoSchema.index({ isActive: 1 });

const SEO = mongoose.models.SEO || mongoose.model("SEO", seoSchema);

// Default SEO data
const defaultSEOData = [
  {
    id: "home",
    pageName: "Home Page",
    title:
      "Vinushree Tours & Travels - Best Taxi Services in Tamil Nadu",
    description:
      "Book reliable taxi services, tour packages, and travel solutions across Tamil Nadu. One-way trips, round trips, airport taxi, and tour packages available 24/7.",
    keywords:
      "taxi service tamil nadu, tour packages, airport taxi, vinushree tours, chennai taxi, bangalore taxi, travel services, one way trip, round trip",
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "about",
    pageName: "About Us",
    title: "About Vinushree Tours & Travels - Your Trusted Travel Partner",
    description:
      "Learn about Vinushree Tours & Travels, your trusted travel partner in Tamil Nadu. We provide reliable taxi services, tour packages, and travel solutions since 2020.",
    keywords:
      "about vinushree tours, travel company tamil nadu, trusted taxi service, travel partner, company history, reliable transport",
    lastUpdated: new Date("2024-01-14"),
  },
  {
    id: "tariff",
    pageName: "Tariff Page",
    title:
      "Taxi Tariff & Pricing - Vinushree Tours & Travels",
    description:
      "Check our competitive taxi tariff and pricing for one-way trips, round trips, airport taxi, and hourly packages. Transparent pricing with no hidden charges.",
    keywords:
      "taxi tariff, taxi pricing, one way taxi rates, round trip rates, airport taxi charges, hourly package rates, transparent pricing",
    lastUpdated: new Date("2024-01-13"),
  },
  {
    id: "packages",
    pageName: "Packages Page",
    title:
      "Tour Packages Tamil Nadu - Ooty, Kodaikanal, Chennai Tours",
    description:
      "Explore our exciting tour packages for Ooty, Kodaikanal, Chennai, and other Tamil Nadu destinations. Complete packages with accommodation and sightseeing.",
    keywords:
      "tour packages tamil nadu, ooty tour package, kodaikanal tour, chennai tour, hill station packages, south india tours, travel packages",
    lastUpdated: new Date("2024-01-12"),
  },
  {
    id: "contact",
    pageName: "Contact Us",
    title: "Contact Vinushree Tours & Travels - Book Your Taxi Now",
    description:
      "Contact Vinushree Tours & Travels for taxi booking, tour packages, and travel inquiries. Available 24/7 for all your travel needs across Tamil Nadu.",
    keywords:
      "contact vinushree tours, taxi booking, travel inquiry, phone number, whatsapp booking, 24/7 service, customer support",
    lastUpdated: new Date("2024-01-11"),
  },
];

// Auto-seed function
const autoSeedSEO = async () => {
  try {
    const count = await SEO.countDocuments();
    if (count === 0) {
      await SEO.insertMany(defaultSEOData);
      console.log("✅ SEO database auto-seeded with default data");
    }
  } catch (error) {
    console.error("❌ Error auto-seeding SEO data:", error);
  }
};

// Auto-seed when model is first loaded
if (mongoose.connection.readyState === 1) {
  autoSeedSEO();
} else {
  mongoose.connection.once("open", autoSeedSEO);
}

export default SEO;
