import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import { Contact } from "@/components/Contact/Contact";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Dynamic SEO metadata will be handled by the SEO provider
export const metadata = {
  title: "Contact Us - Travel Services | Vinushree Tours & Travels",
  description:
    "Get in touch with Vinushree Tours & Travels for all your travel needs across Tamil Nadu. Book your trip, get quotes, and plan your perfect journey with us.",
  keywords:
    "contact travel services, Tamil Nadu travel booking, tour package inquiry, travel support, trip planning",
}; 

// Static travel services data
const travelServices = [
  "One-way Trip",
  "Round Trip", 
  "Airport Taxi",
  "Day Rental",
  "Hourly Package",
  "Local Pickup/Drop",
  "Tour Package",
  "Other"
];

// Static contact information
const staticContactInfo = {
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  email: "info@vinushree.com",
  address: "123 Travel Street",
  city: "Chennai",
  state: "Tamil Nadu",
  pincode: "600001",
  country: "India",
  pageTitle: "Plan Your Perfect Journey",
  pageDescription: "Ready to explore Tamil Nadu's beautiful destinations? Contact our travel experts today and let us plan your perfect journey with comfort and safety.",
  officeTitle: "Visit Our Office in Chennai, Tamil Nadu",
  officeDescription: "Conveniently located in Chennai, our office is your gateway to exploring Tamil Nadu's wonders",
  mapLocation: "https://maps.google.com/embed?pb=!1m18!1m12!1m3!1d3886.8663654849897!2d80.27073631482226!3d13.044262990816952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267165f1e8b43%3A0x4d7a78e4d2e0c1a5!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1635789012345!5m2!1sen!2sin"
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Contact 
        services={travelServices} 
        contactInfo={staticContactInfo}
      />
      <Footer />
      <FloatingContactButtons />
    </div>
  );
}
