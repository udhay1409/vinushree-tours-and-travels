import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import TariffPageClient from "@/components/TariffPageClient";

// SEO metadata
export const metadata = {
  title: "Travel Tariff & Pricing - Vinushree Tours & Travels",
  description:
    "Explore our competitive travel tariff and pricing for one-way trips, round trips, airport taxi, day rentals, hourly packages across Tamil Nadu.",
  keywords:
    "travel tariff, taxi pricing, tour package rates, airport taxi fare, day rental rates, Tamil Nadu travel cost",
}; 

// Static tariff data
const staticTariffData = [
  {
    id: 1,
    service: "One-way Trip",
    description: "Comfortable one-way travel to your destination with professional drivers",
    price: "₹12/km",
    features: ["Professional Driver", "Clean Vehicle", "On-time Service", "24/7 Support"],
    image: "/images/one-way-trip.jpg",
    minCharge: "₹500"
  },
  {
    id: 2,
    service: "Round Trip",
    description: "Complete round trip service with waiting time included",
    price: "₹10/km",
    features: ["Round Trip", "Waiting Time Included", "Fuel Included", "Toll Charges Extra"],
    image: "/images/round-trip.jpg",
    minCharge: "₹800"
  },
  {
    id: 3,
    service: "Airport Taxi",
    description: "Reliable airport pickup and drop services available 24/7",
    price: "₹15/km",
    features: ["24/7 Available", "Flight Tracking", "Meet & Greet", "Luggage Assistance"],
    image: "/images/airport-taxi.jpg",
    minCharge: "₹600"
  },
  {
    id: 4,
    service: "Day Rental",
    description: "Full day vehicle rental for local sightseeing and business trips",
    price: "₹2,500/day",
    features: ["8 Hours Service", "80 KM Included", "Driver Allowance", "Fuel Included"],
    image: "/images/day-rental.jpg",
    minCharge: "₹2,500"
  },
  {
    id: 5,
    service: "Hourly Package",
    description: "Flexible hourly rental for short trips and local travel",
    price: "₹300/hour",
    features: ["Minimum 2 Hours", "Flexible Timing", "Local Travel", "Waiting Charges Free"],
    image: "/images/hourly-package.jpg",
    minCharge: "₹600"
  },
  {
    id: 6,
    service: "Local Pickup/Drop",
    description: "Quick and reliable local pickup and drop services",
    price: "₹200-500",
    features: ["Within City Limits", "Quick Service", "Affordable Rates", "Safe Travel"],
    image: "/images/local-pickup.jpg",
    minCharge: "₹200"
  },
  {
    id: 7,
    service: "Tour Package",
    description: "Customized tour packages for popular destinations in Tamil Nadu",
    price: "Custom Pricing",
    features: ["Customized Itinerary", "Accommodation Help", "Guide Service", "Multiple Destinations"],
    image: "/images/tour-package.jpg",
    minCharge: "₹5,000"
  }
];

export default function TariffPageRoute() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <TariffPageClient tariffData={staticTariffData} />
      <Footer />
      <FloatingContactButtons />
    </div>
  );
}