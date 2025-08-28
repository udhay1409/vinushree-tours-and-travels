import { notFound } from 'next/navigation';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PackageDetailClient from "@/components/PackageDetailClient";

// Static packages data (same as in packages page)
const staticPackagesData = [
  {
    id: 1,
    slug: 'chennai-to-mahabalipuram',
    title: "Chennai to Mahabalipuram Day Trip",
    description: "Explore the UNESCO World Heritage sites including Shore Temple, Five Rathas, and Arjuna's Penance. Experience the rich cultural heritage and beautiful beaches.",
    image: "/images/mahabalipuram-package.jpg",
    duration: "1 Day",
    price: "₹2,500",
    featured: true,
    highlights: ["Shore Temple", "Five Rathas", "Arjuna's Penance", "Beach Visit", "Local Lunch"],
    inclusions: ["Transportation", "Driver Allowance", "Fuel", "Toll Charges"],
    exclusions: ["Entry Fees", "Personal Expenses", "Meals (except lunch)"],
    itinerary: [
      { time: "06:00 AM", activity: "Pickup from Chennai" },
      { time: "08:30 AM", activity: "Arrive at Mahabalipuram" },
      { time: "09:00 AM", activity: "Visit Shore Temple" },
      { time: "10:30 AM", activity: "Explore Five Rathas" },
      { time: "12:00 PM", activity: "Local lunch break" },
      { time: "01:30 PM", activity: "Arjuna's Penance & Beach visit" },
      { time: "04:00 PM", activity: "Return journey to Chennai" },
      { time: "06:30 PM", activity: "Drop at Chennai" }
    ],
    category: "Cultural"
  },
  {
    id: 2,
    slug: 'ooty-hill-station-tour',
    title: "Ooty Hill Station Tour",
    description: "Experience the Queen of Hills with scenic beauty, pleasant weather, and colonial charm. Visit botanical gardens, lakes, and enjoy toy train rides.",
    image: "/images/ooty-package.jpg",
    duration: "2 Days 1 Night",
    price: "₹8,500",
    featured: true,
    highlights: ["Botanical Garden", "Ooty Lake", "Doddabetta Peak", "Tea Gardens", "Toy Train"],
    inclusions: ["Transportation", "Accommodation", "Breakfast", "Sightseeing"],
    exclusions: ["Lunch & Dinner", "Entry Fees", "Personal Expenses"],
    itinerary: [
      { time: "Day 1 - 06:00 AM", activity: "Pickup and journey to Ooty" },
      { time: "12:00 PM", activity: "Check-in at hotel & lunch" },
      { time: "02:00 PM", activity: "Visit Botanical Garden" },
      { time: "04:00 PM", activity: "Ooty Lake boating" },
      { time: "06:00 PM", activity: "Local market visit" },
      { time: "Day 2 - 08:00 AM", activity: "Breakfast & checkout" },
      { time: "09:00 AM", activity: "Doddabetta Peak visit" },
      { time: "11:00 AM", activity: "Tea Garden tour" },
      { time: "01:00 PM", activity: "Lunch & return journey" },
      { time: "07:00 PM", activity: "Drop at pickup point" }
    ],
    category: "Hill Station"
  },
  {
    id: 3,
    slug: 'kodaikanal-nature-tour',
    title: "Kodaikanal Nature Tour",
    description: "Discover the Princess of Hill Stations with pristine lakes, valleys, and misty mountains. Perfect for nature lovers and photography enthusiasts.",
    image: "/images/kodaikanal-package.jpg",
    duration: "2 Days 1 Night",
    price: "₹7,500",
    featured: true,
    highlights: ["Kodai Lake", "Coaker's Walk", "Bryant Park", "Pillar Rocks", "Silver Cascade"],
    inclusions: ["Transportation", "Accommodation", "Breakfast", "Sightseeing"],
    exclusions: ["Lunch & Dinner", "Entry Fees", "Personal Expenses"],
    itinerary: [
      { time: "Day 1 - 05:00 AM", activity: "Pickup and journey to Kodaikanal" },
      { time: "11:00 AM", activity: "Check-in at hotel" },
      { time: "12:00 PM", activity: "Lunch break" },
      { time: "02:00 PM", activity: "Kodai Lake visit" },
      { time: "04:00 PM", activity: "Coaker's Walk" },
      { time: "06:00 PM", activity: "Bryant Park visit" },
      { time: "Day 2 - 08:00 AM", activity: "Breakfast & checkout" },
      { time: "09:00 AM", activity: "Pillar Rocks visit" },
      { time: "11:00 AM", activity: "Silver Cascade Falls" },
      { time: "01:00 PM", activity: "Lunch & return journey" },
      { time: "07:00 PM", activity: "Drop at pickup point" }
    ],
    category: "Hill Station"
  },
  {
    id: 4,
    slug: 'rameswaram-temple-tour',
    title: "Rameswaram Temple Tour",
    description: "Sacred pilgrimage to one of the Char Dham sites. Visit the famous Ramanathaswamy Temple and experience spiritual bliss.",
    image: "/images/rameswaram-package.jpg",
    duration: "2 Days 1 Night",
    price: "₹6,500",
    featured: false,
    highlights: ["Ramanathaswamy Temple", "Dhanushkodi", "Abdul Kalam Memorial", "Pamban Bridge"],
    inclusions: ["Transportation", "Accommodation", "Breakfast", "Temple Visits"],
    exclusions: ["Lunch & Dinner", "Personal Expenses", "Donations"],
    itinerary: [
      { time: "Day 1 - 05:00 AM", activity: "Pickup and journey to Rameswaram" },
      { time: "12:00 PM", activity: "Check-in at hotel & lunch" },
      { time: "03:00 PM", activity: "Ramanathaswamy Temple visit" },
      { time: "06:00 PM", activity: "Pamban Bridge view" },
      { time: "Day 2 - 06:00 AM", activity: "Early morning temple visit" },
      { time: "08:00 AM", activity: "Breakfast & checkout" },
      { time: "10:00 AM", activity: "Dhanushkodi visit" },
      { time: "12:00 PM", activity: "Abdul Kalam Memorial" },
      { time: "02:00 PM", activity: "Lunch & return journey" },
      { time: "08:00 PM", activity: "Drop at pickup point" }
    ],
    category: "Pilgrimage"
  },
  {
    id: 5,
    slug: 'kanyakumari-sunrise-tour',
    title: "Kanyakumari Sunrise Tour",
    description: "Witness the spectacular sunrise at the southernmost tip of India. Visit Vivekananda Rock Memorial and Thiruvalluvar Statue.",
    image: "/images/kanyakumari-package.jpg",
    duration: "2 Days 1 Night",
    price: "₹7,000",
    featured: false,
    highlights: ["Sunrise Point", "Vivekananda Rock", "Thiruvalluvar Statue", "Gandhi Memorial", "Beach"],
    inclusions: ["Transportation", "Accommodation", "Breakfast", "Ferry Tickets"],
    exclusions: ["Lunch & Dinner", "Personal Expenses", "Entry Fees"],
    itinerary: [
      { time: "Day 1 - 04:00 AM", activity: "Pickup and journey to Kanyakumari" },
      { time: "11:00 AM", activity: "Check-in at hotel" },
      { time: "12:00 PM", activity: "Lunch break" },
      { time: "02:00 PM", activity: "Gandhi Memorial visit" },
      { time: "04:00 PM", activity: "Beach visit & sunset view" },
      { time: "Day 2 - 05:00 AM", activity: "Sunrise viewing" },
      { time: "07:00 AM", activity: "Breakfast" },
      { time: "09:00 AM", activity: "Vivekananda Rock & Thiruvalluvar Statue" },
      { time: "12:00 PM", activity: "Checkout & lunch" },
      { time: "02:00 PM", activity: "Return journey" },
      { time: "08:00 PM", activity: "Drop at pickup point" }
    ],
    category: "Beach"
  },
  {
    id: 6,
    slug: 'madurai-temple-city-tour',
    title: "Madurai Temple City Tour",
    description: "Explore the cultural capital of Tamil Nadu. Visit the magnificent Meenakshi Temple and experience the rich heritage of the city.",
    image: "/images/madurai-package.jpg",
    duration: "1 Day",
    price: "₹3,500",
    featured: false,
    highlights: ["Meenakshi Temple", "Thirumalai Nayakkar Palace", "Gandhi Museum", "Local Markets"],
    inclusions: ["Transportation", "Driver Allowance", "Fuel", "Local Guide"],
    exclusions: ["Meals", "Entry Fees", "Personal Expenses"],
    itinerary: [
      { time: "07:00 AM", activity: "Pickup from your location" },
      { time: "09:00 AM", activity: "Meenakshi Temple visit" },
      { time: "11:00 AM", activity: "Thirumalai Nayakkar Palace" },
      { time: "01:00 PM", activity: "Lunch break" },
      { time: "02:30 PM", activity: "Gandhi Museum visit" },
      { time: "04:00 PM", activity: "Local markets exploration" },
      { time: "05:30 PM", activity: "Return journey" },
      { time: "07:30 PM", activity: "Drop at pickup point" }
    ],
    category: "Cultural"
  }
];

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return staticPackagesData.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const packageData = staticPackagesData.find(pkg => pkg.slug === params.slug);
  
  if (!packageData) {
    return {
      title: 'Package Not Found - Vinushree Tours & Travels',
    };
  }

  return {
    title: `${packageData.title} - Vinushree Tours & Travels`,
    description: packageData.description,
    keywords: `${packageData.title}, Tamil Nadu tour, ${packageData.category}, travel package, Vinushree Tours`,
  };
}

export default function PackageDetailPage({ params }: PageProps) {
  const packageData = staticPackagesData.find(pkg => pkg.slug === params.slug);

  if (!packageData) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <PackageDetailClient packageData={packageData} />
      <Footer />
    </div>
  );
}