"use client"

import { Suspense, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MapPin, Clock, Users, Star, Phone, Car, Plane, Shield, Award, Heart } from "lucide-react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import QuickBookForm from "@/components/QuickBookForm"
import PopularRoutes from "@/components/PopularRoutes"
import { useBanner } from "@/hooks/use-banner"
import { useTariff } from "@/hooks/use-tariff"
import { usePackages } from "@/hooks/use-packages"
import { useContact } from "@/hooks/use-contact"
import { Testimonials } from "./Testimonial"

// Static data for travel business
const staticBanners = [
  {
    _id: "1",
    title: "Explore Beautiful Destinations",
    subtitle:
      "Professional travel services for all your needs. One-way trips, round trips, airport taxi, day rentals, and tour packages.",
    image: "/kodaikanal-hill-station.png",
    isActive: true,
  },
  {
    _id: "2",
    title: "Comfortable Journeys",
    subtitle: "Experience safe and comfortable travel with our well-maintained vehicles and experienced drivers.",
    image: "/luxury-taxi-service-in-tamil-nadu.png",
    isActive: true,
  },
]

const staticTariffServices = [
  {
    _id: "1",
    title: "One-way Trip",
    description: "Comfortable one-way travel to your destination with professional drivers",
    image: "/toyota-innova-crysta-luxury-taxi.png",
    pricing: { basePrice: 12, currency: "INR" },
    features: ["Professional Driver", "Clean Vehicle", "On-time Service"],
    isActive: true,
    featured: true,
  },
  {
    _id: "2",
    title: "Round Trip",
    description: "Complete round trip service with flexible timing and comfortable travel",
    image: "/toyota-innova-taxi.png",
    pricing: { basePrice: 20, currency: "INR" },
    features: ["Flexible Timing", "Wait Time Included", "Return Journey"],
    isActive: true,
    featured: true,
  },
  {
    _id: "3",
    title: "Airport Taxi",
    description: "Reliable airport pickup and drop services available 24/7",
    image: "/airport-taxi.png",
    pricing: { basePrice: 15, currency: "INR" },
    features: ["24/7 Available", "Flight Tracking", "Meet & Greet"],
    isActive: true,
    featured: true,
  },
  {
    _id: "4",
    title: "Day Rental",
    description: "Full day vehicle rental for local sightseeing and business trips",
    image: "/maruti-brezza-suv-taxi.png",
    pricing: { basePrice: 2500, currency: "INR" },
    features: ["8 Hours Service", "Local Sightseeing", "Fuel Included"],
    isActive: true,
    featured: false,
  },
  {
    _id: "5",
    title: "Hourly Package",
    description: "Flexible hourly rental service for short trips and quick errands",
    image: "/wagon-r-taxi.png",
    pricing: { basePrice: 300, currency: "INR" },
    features: ["Minimum 2 Hours", "Flexible Timing", "City Limits"],
    isActive: true,
    featured: false,
  },
  {
    _id: "6",
    title: "Tour Package",
    description: "Complete tour packages to popular destinations in Tamil Nadu",
    image: "/tempo-traveller-12-seater.png",
    pricing: { basePrice: 5000, currency: "INR" },
    features: ["Multi-day Tours", "Accommodation Help", "Local Guide"],
    isActive: true,
    featured: false,
  },
]

// Static testimonials data for travel business (fallback)
const staticTestimonials = [
  {
    _id: "1",
    name: "Rajesh Kumar",
    location: "Chennai",
    avatar: "",
    content: "Excellent service! The driver was punctual and the vehicle was very clean and comfortable. Highly recommend Vinushree Tours for reliable travel.",
    rating: 5,
    servicesType: "Airport Taxi",
    status: "published",
  },
  {
    _id: "2",
    name: "Priya Sharma",
    location: "Coimbatore",
    avatar: "",
    content: "Had a wonderful trip to Ooty with Vinushree Tours. The team was professional and the pricing was very reasonable. Will definitely book again!",
    rating: 5,
    servicesType: "Tour Package",
    status: "published",
  },
  {
    _id: "3",
    name: "Arun Krishnan",
    location: "Madurai",
    avatar: "",
    content: "Best travel service in Tamil Nadu. Highly recommend for family trips and business travel. Safe, comfortable, and reliable service every time.",
    rating: 5,
    servicesType: "Round Trip",
    status: "published",
  },
  {
    _id: "4",
    name: "Meera Patel",
    location: "Trichy",
    avatar: "",
    content: "Amazing experience with their tour packages. The Kodaikanal trip was perfectly organized and the driver was very knowledgeable about local places.",
    rating: 5,
    servicesType: "Tour Package - Kodaikanal",
    status: "published",
  },
  {
    _id: "5",
    name: "Suresh Babu",
    location: "Salem",
    avatar: "",
    content: "Used their airport taxi service multiple times. Always on time, clean vehicles, and professional drivers. Excellent customer service!",
    rating: 5,
    servicesType: "Airport Taxi",
    status: "published",
  },
  {
    _id: "6",
    name: "Lakshmi Devi",
    location: "Tirunelveli",
    avatar: "",
    content: "Booked their day rental for local sightseeing. The driver was courteous and helped us visit all the places we wanted. Great value for money!",
    rating: 5,
    servicesType: "Day Rental",
    status: "published",
  },
]

const staticPackages = [
  {
    _id: "1",
    title: "Kodaikanal Hill Station",
    description: "Experience the beauty of Kodaikanal with our 2-day tour package",
    image: "/kodaikanal-lake-and-hills-scenic-view.png",
    duration: "2 Days",
    price: 7500,
    destinations: ["Kodaikanal", "Berijam Lake", "Coaker's Walk"],
    highlights: ["Hill Station", "Lake Views", "Pleasant Weather"],
    isActive: true,
  },
  {
    _id: "2",
    title: "Ooty Queen of Hills",
    description: "Discover the charm of Ooty with our comprehensive tour package",
    image: "/ooty-hills-tea-gardens.png",
    duration: "3 Days",
    price: 12000,
    destinations: ["Ooty", "Coonoor", "Kotagiri"],
    highlights: ["Tea Gardens", "Toy Train", "Botanical Garden"],
    isActive: true,
  },
  {
    _id: "3",
    title: "Rameswaram Pilgrimage",
    description: "Sacred pilgrimage tour to Rameswaram temple and surrounding areas",
    image: "/rameswaram-temple.png",
    duration: "2 Days",
    price: 6500,
    destinations: ["Rameswaram", "Dhanushkodi", "Pamban Bridge"],
    highlights: ["Temple Visit", "Beach Views", "Spiritual Journey"],
    isActive: true,
  },
  {
    _id: "4",
    title: "Madurai Temple City",
    description: "Explore the historic temples and culture of Madurai",
    image: "/madurai-meenakshi-temple.png",
    duration: "1 Day",
    price: 2500,
    destinations: ["Meenakshi Temple", "Thirumalai Nayakkar Palace", "Gandhi Museum"],
    highlights: ["Ancient Temples", "Rich History", "Cultural Heritage"],
    isActive: true,
  },
  {
    _id: "5",
    title: "Kodaikanal Pillar Rocks",
    description: "Visit the famous Pillar Rocks and scenic viewpoints in Kodaikanal",
    image: "/pillar-rocks-kodaikanal.png",
    duration: "2 Days",
    price: 5500,
    destinations: ["Pillar Rocks", "Bryant Park", "Coaker's Walk"],
    highlights: ["Rock Formations", "Valley Views", "Cool Climate"],
    isActive: true,
  },
  {
    _id: "6",
    title: "Thirumalai Palace Tour",
    description: "Explore the magnificent Thirumalai Nayakkar Palace in Madurai",
    image: "/thirumalai-nayakkar-palace.png",
    duration: "1 Day",
    price: 3500,
    destinations: ["Thirumalai Palace", "Gandhi Museum", "Local Markets"],
    highlights: ["Royal Architecture", "Historical Sites", "Cultural Experience"],
    isActive: true,
  },
]

export default function CompleteHome() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const { banner, isLoading } = useBanner("home") // dynamic hero banner for Home
  const { tariffData } = useTariff() // dynamic tariff services
  const { packagesData } = usePackages() // dynamic packages
  const { contactInfo } = useContact() // dynamic contact information
  const [testimonials, setTestimonials] = useState([])
  const [testimonialsLoading, setTestimonialsLoading] = useState(true)

  // Auto-rotate banners (only if no dynamic banner; otherwise no rotation needed)
  useEffect(() => {
    if (!banner && staticBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % staticBanners.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [banner])

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/admin/testimonial?status=published')
        const result = await response.json()
        
        if (result.success) {
          setTestimonials(result.data)
        } else {
          // Use static testimonials as fallback
          setTestimonials(staticTestimonials)
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error)
        // Use static testimonials as fallback
        setTestimonials(staticTestimonials)
      } finally {
        setTestimonialsLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  const handleBookNow = (serviceTitle?: string) => {
    // For homepage, scroll to the quick book form
    const formElement = document.getElementById("quick-book-form")
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  const handleBookPackage = (packageTitle: string) => {
    const message = `Hi, I'm interested in the ${packageTitle} package. Please provide more details and availability.`;
    const whatsappNumber = contactInfo?.whatsappNumber || contactInfo?.primaryPhone || '919003782966';
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  const handleCallNow = () => {
    const phoneNumber = contactInfo?.primaryPhone || '+919003782966';
    window.open(`tel:${phoneNumber}`, "_self")
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Banner Images */}
      <section className="relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            {/* Image Layer */}
            <div className="absolute inset-0 opacity-100 transition-opacity duration-700">
              <Image
                src={banner?.status === "active" && banner?.image ? banner.image : "/placeholder.svg"}
                alt={banner?.title || "Home banner"}
                fill
                className={`object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                priority
              />
            </div>
            
            {/* Dark Overlay Layer */}
            <div className="absolute inset-0 bg-black/50" />
            
            {/* Gradient Overlay Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-transparent" />
            
            {/* Admin Gradient Layer */}
            <div className="absolute inset-0 bg-admin-gradient/20" />
            
            {/* Optional: Animated Gradient Layer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-yellow-600/20 via-transparent to-orange-600/20"
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 md:py-16 lg:py-20 xl:px-8 relative z-10 max-w-7xl">
          <div className="max-w-5xl mx-auto text-center text-white">
            <div>
              <Badge className="mb-4 sm:mb-6 md:mb-8 hover:bg-admin-secondary bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1.5 sm:px-6 sm:py-2 md:px-8 md:py-3 text-xs sm:text-sm md:text-base rounded-full shadow-lg">
                <Car className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-2 sm:mr-3" />
                Welcome to Vinushree Tours & Travels
              </Badge>
            </div>

            {/* Optional dynamic banner title (keeps existing headline below) */}
            {banner?.title && (
              <p className="text-white/90 text-base sm:text-lg md:text-xl mb-2 sm:mb-3">{banner.title}</p>
            )}

            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="block">Travel With Us</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400">
                  In Comfort
                </span>
              </h1>
            </div>

            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-4 sm:mb-6 text-white/90 font-light">
              Since 2020
            </p>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-8 sm:mb-10 md:mb-12 text-white/80 max-w-4xl mx-auto leading-relaxed px-2 sm:px-4">
              Experience professional travel services with comfort and reliability. From airport transfers to
              complete tour packages, we ensure safe, comfortable, and memorable journeys to your destinations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <div className="w-full sm:w-auto">
                <Button
                  onClick={() => handleBookNow()}
                  size="lg"
                  className="w-full sm:w-auto bg-admin-gradient text-white border-0 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg font-semibold transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
                >
                  Book Now
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </Button>
              </div>

              <div className="w-full sm:w-auto">
                <Button
                  onClick={handleCallNow}
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg font-semibold bg-transparent backdrop-blur-sm shadow-2xl hover:shadow-white/10"
                >
                  <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Call Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Indicators - show only when using static rotation */}
        {!banner && staticBanners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {staticBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentBanner ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                number: "1000+",
                label: "Happy Customers",
                icon: <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
              },
              {
                number: "50+",
                label: "Destinations",
                icon: <MapPin className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
              },
              {
                number: "5+",
                label: "Years Experience",
                icon: <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
              },
              {
                number: "99%",
                label: "Customer Satisfaction",
                icon: <Star className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  initial: { opacity: 0, scale: 0.8 },
                  animate: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.6 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 h-full">
                  <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8 text-center">
                    <motion.div
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 md:mb-6 bg-admin-gradient rounded-full flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-white">{stat.icon}</div>
                    </motion.div>
                    <motion.div
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-admin-gradient bg-clip-text text-transparent mb-1 sm:mb-2"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium leading-tight">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Book Form Section */}
      <section id="quick-book-form" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <QuickBookForm />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-admin-gradient relative overflow-hidden">
        {/* Animated overlay gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-yellow-600/30 via-transparent to-orange-600/30"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-bl from-orange-500/20 via-transparent to-yellow-500/20"
            animate={{
              opacity: [0.7, 0.3, 0.7],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Straight line animations */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute w-px h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{
                scaleY: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
          ))}

          {/* Horizontal lines */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`hline-${i}`}
              className="absolute h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{
                left: `${15 + i * 20}%`,
                top: `${30 + i * 15}%`,
              }}
              animate={{
                scaleX: [0, 1, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.6,
              }}
            />
          ))}

          {/* Floating bubbles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`bubble-${i}`}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white/30 rounded-full"
              style={{
                left: `${5 + i * 8}%`,
                top: `${10 + (i % 4) * 20}%`,
              }}
              animate={{
                y: [-15, 15, -15],
                x: [-10, 10, -10],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 5 + i * 0.3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Larger floating orbs */}
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-white/10 to-yellow-300/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-orange-300/20 to-white/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 7,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative max-w-7xl z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20"
            variants={{
              initial: { opacity: 0, y: 60 },
              animate: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Badge className="mb-4 sm:mb-6 bg-admin-gradient text-white px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Since 2020
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8">
              Travel Excellence
              <span className="block text-yellow-200">Since 2020</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed px-2 sm:px-4">
              Vinushree Tours & Travels is your trusted travel partner, specializing in comfortable
              and reliable travel services that make every journey memorable with professional drivers and
              well-maintained vehicles.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Shield className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />,
                title: "Our Mission",
                description:
                  "To provide safe, comfortable, and reliable travel services across Tamil Nadu, ensuring every journey is memorable and stress-free for our valued customers.",
                gradient: "from-blue-600 to-purple-600",
              },
              {
                icon: <Award className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />,
                title: "Our Vision",
                description:
                  "To be the most trusted travel partner in Tamil Nadu, recognized for our commitment to excellence, customer satisfaction, and professional service standards.",
                gradient: "from-purple-600 to-pink-600",
              },
              {
                icon: <Heart className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />,
                title: "Our Values",
                description:
                  "Safety, reliability, customer satisfaction, and integrity are the core values that guide our services, ensuring exceptional travel experiences for every customer.",
                gradient: "from-green-600 to-teal-600",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  initial: { opacity: 0, y: 60 },
                  animate: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6 }}
                className="md:col-span-2 lg:col-span-1 md:last:col-start-1 md:last:col-end-3 lg:last:col-start-auto lg:last:col-end-auto"
              >
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-4 sm:p-6 md:p-8 text-center relative">
                    <motion.div
                      className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br ${item.gradient} rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-white">{item.icon}</div>
                    </motion.div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-yellow-200/25 to-orange-200/25 rounded-full blur-3xl"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-orange-200/20 to-yellow-200/20 rounded-full blur-2xl"
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <motion.div
            className="text-center mb-12 sm:mb-16 md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 sm:mb-6 bg-admin-gradient text-white px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm">
              Our Services
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 px-2">
              Travel Services
              <span className="block text-transparent bg-clip-text bg-admin-gradient">For Every Destination</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto px-2">
              From airport transfers to complete tour packages, we provide reliable and comfortable travel solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {(tariffData.length > 0 ? tariffData.slice(0, 6) : staticTariffServices).map((service, index) => (
              <motion.div
                key={service._id || service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.vehicleName || service.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                          ₹{service.oneWayRate ? service.oneWayRate.replace(/[₹$]/g, '').replace(/per\s*km/gi, '').replace(/\/km/gi, '').trim() : service.pricing?.basePrice}+
                        </Badge>
                      </div>
                      {service.featured && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-green-500 text-white">
                            ⭐ Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4 sm:p-6 md:p-8">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                        {service.vehicleName || service.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Button
                          onClick={() => handleBookNow(service.vehicleName || service.title)}
                          className="bg-admin-gradient text-white hover:opacity-90 text-sm sm:text-base py-2 sm:py-2.5"
                        >
                          Book Now
                        </Button>
                        <Link
                          href="/tariff"
                          className="text-admin-primary hover:text-admin-secondary transition-colors font-medium text-xs sm:text-sm"
                        >
                          View Details
                          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 inline" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/tariff">
              <Button className="bg-admin-gradient text-white hover:opacity-90 px-8 py-3 text-lg font-semibold">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <motion.div
            className="text-center mb-12 sm:mb-16 md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 sm:mb-6 bg-admin-gradient text-white px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm">
              Tour Packages
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 px-2">
              Popular
              <span className="block text-transparent bg-clip-text bg-admin-gradient">Travel Packages</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto px-2">
              Discover the beauty of Tamil Nadu with our carefully crafted tour packages
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {(packagesData.length > 0 ? packagesData.slice(0, 6) : staticPackages).map((pkg, index) => (
              <motion.div
                key={pkg._id || pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-105 h-full">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image src={pkg.image || "/placeholder.svg"} alt={pkg.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                          {pkg.duration}
                        </Badge>
                      </div>
                      {pkg.featured && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-green-500 text-white">
                            ⭐ Bestseller
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-grow">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                        {pkg.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6 line-clamp-2 flex-grow">
                        {pkg.description}
                      </p>
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-admin-primary">
                          {pkg.price}
                        </span>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <Button
                          onClick={() => handleBookPackage(pkg.title)}
                          className="bg-admin-gradient text-white hover:opacity-90 text-sm sm:text-base py-2 sm:py-2.5"
                        >
                          Book Now
                        </Button>
                        <Link
                          href={pkg.slug ? `/packages/${pkg.slug}` : "/packages"}
                          className="text-admin-primary hover:text-admin-secondary transition-colors font-medium text-xs sm:text-sm"
                        >
                          View Details
                          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 inline" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/packages">
              <Button className="bg-admin-gradient text-white hover:opacity-90 px-8 py-3 text-lg font-semibold">
                View All Packages
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <PopularRoutes showAll={true} />

      {/* Dynamic Testimonials Section */}
      <Testimonials testimonials={testimonials} />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-admin-gradient relative overflow-hidden">
        {/* Animated overlay gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-yellow-600/30 via-transparent to-orange-600/30"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-bl from-orange-500/20 via-transparent to-yellow-500/20"
            animate={{
              opacity: [0.7, 0.3, 0.7],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Small floating bubbles like About section */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating bubbles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`bubble-${i}`}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white/30 rounded-full"
              style={{
                left: `${5 + i * 8}%`,
                top: `${10 + (i % 4) * 20}%`,
              }}
              animate={{
                y: [-15, 15, -15],
                x: [-10, 10, -10],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 5 + i * 0.3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center relative z-10 max-w-7xl">
          <motion.div
            variants={{
              initial: { opacity: 0, y: 60 },
              animate: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Badge className="mb-3 sm:mb-4 md:mb-6 bg-admin-secondary text-white border-white/30 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 text-xs sm:text-sm md:text-base">
              <Plane className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Ready to Travel?
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 text-white">
              Start Your Journey
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                With Us Today
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4">
              Experience the comfort and reliability of our travel services. Book your journey across Tamil Nadu and
              discover the beauty of the state with our professional team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  onClick={() => {
                    const whatsappNumber = contactInfo?.whatsappNumber || contactInfo?.primaryPhone || '919003782966';
                    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi, I would like to book a trip. Please provide more details.`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  size="lg"
                  className="w-full sm:w-auto bg-white text-admin-secondary hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <WhatsAppIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Book via WhatsApp
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  onClick={handleCallNow}
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-transparent backdrop-blur-sm"
                >
                  <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Call Now
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
