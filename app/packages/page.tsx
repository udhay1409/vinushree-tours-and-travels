import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import PackagesPageClient from "@/components/PackagesPageClient";

// SEO metadata
export const metadata = {
  title: "Tour Packages - Vinushree Tours & Travels",
  description:
    "Discover amazing tour packages across Tamil Nadu. Explore temples, hill stations, beaches, and cultural destinations with our customized travel packages.",
  keywords:
    "Tamil Nadu tour packages, temple tours, hill station packages, beach tours, cultural tours, travel packages",
}; 

// Static packages data with actual images from public folder
const staticPackagesData = [
  {
    id: 1,
    title: "Kodaikanal Hill Station Tour",
    description: "Experience the beauty of Kodaikanal with our comprehensive tour package. Visit pristine lakes, valleys, and misty mountains perfect for nature lovers.",
    image: "/kodaikanal-lake-and-hills-scenic-view.png",
    duration: "2 Days 1 Night",
    price: "₹7,500",
    featured: true,
    highlights: ["Kodai Lake", "Coaker's Walk", "Bryant Park", "Pillar Rocks", "Silver Cascade"],
    inclusions: ["Transportation", "Accommodation", "Breakfast", "Sightseeing"],
    category: "Hill Station"
  },
  {
    id: 2,
    title: "Ooty Queen of Hills",
    description: "Discover the charm of Ooty with scenic beauty, pleasant weather, and colonial heritage. Visit botanical gardens, tea estates, and enjoy toy train rides.",
    image: "/ooty-hills-tea-gardens.png",
    duration: "2 Days 1 Night",
    price: "₹8,500",
    featured: true,
    highlights: ["Botanical Garden", "Ooty Lake", "Doddabetta Peak", "Tea Gardens", "Toy Train"],
    inclusions: ["Transportation", "Accommodation", "Breakfast", "Sightseeing"],
    category: "Hill Station"
  },
  {
    id: 3,
    title: "Rameswaram Pilgrimage Tour",
    description: "Sacred pilgrimage to one of the Char Dham sites. Visit the famous Ramanathaswamy Temple and experience spiritual bliss at this holy destination.",
    image: "/rameswaram-temple.png",
    duration: "2 Days 1 Night",
    price: "₹6,500",
    featured: true,
    highlights: ["Ramanathaswamy Temple", "Dhanushkodi", "Abdul Kalam Memorial", "Pamban Bridge"],
    inclusions: ["Transportation", "Accommodation", "Breakfast", "Temple Visits"],
    category: "Pilgrimage"
  },
  {
    id: 4,
    title: "Madurai Temple City Tour",
    description: "Explore the cultural capital of Tamil Nadu. Visit the magnificent Meenakshi Temple and experience the rich heritage and history of this ancient city.",
    image: "/madurai-meenakshi-temple.png",
    duration: "1 Day",
    price: "₹3,500",
    featured: false,
    highlights: ["Meenakshi Temple", "Thirumalai Nayakkar Palace", "Gandhi Museum", "Local Markets"],
    inclusions: ["Transportation", "Driver Allowance", "Fuel", "Local Guide"],
    category: "Cultural"
  },
  {
    id: 5,
    title: "Kodaikanal Pillar Rocks Tour",
    description: "Visit the famous Pillar Rocks and scenic viewpoints in Kodaikanal. Perfect for photography enthusiasts and nature lovers seeking tranquility.",
    image: "/pillar-rocks-kodaikanal.png",
    duration: "2 Days 1 Night",
    price: "₹5,500",
    featured: false,
    highlights: ["Pillar Rocks", "Bryant Park", "Coaker's Walk", "Valley Views", "Cool Climate"],
    inclusions: ["Transportation", "Accommodation", "Breakfast", "Sightseeing"],
    category: "Hill Station"
  },
  {
    id: 6,
    title: "Thirumalai Palace Heritage Tour",
    description: "Explore the magnificent Thirumalai Nayakkar Palace in Madurai. Discover royal architecture, historical artifacts, and cultural heritage.",
    image: "/thirumalai-nayakkar-palace.png",
    duration: "1 Day",
    price: "₹2,500",
    featured: false,
    highlights: ["Royal Architecture", "Historical Sites", "Cultural Experience", "Palace Museum"],
    inclusions: ["Transportation", "Driver Allowance", "Fuel", "Entry Tickets"],
    category: "Cultural"
  }
];

export default function PackagesPageRoute() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PackagesPageClient packagesData={staticPackagesData} />
      <Footer />
      <FloatingContactButtons />
    </div>
  );
}