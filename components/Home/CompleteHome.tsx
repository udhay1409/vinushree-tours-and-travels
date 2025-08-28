"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MapPin,
  Clock,
  Users,
  Star,
  Phone,
  MessageCircle,
  Car,
  Plane,
  Calendar,
  Shield,
  Award,
  Heart,
  CheckCircle
} from "lucide-react";
import QuickBookForm from "@/components/QuickBookForm";

// Static data for travel business
const staticBanners = [
  {
    _id: '1',
    title: 'Explore Tamil Nadu',
    subtitle: 'Professional travel services across Tamil Nadu. One-way trips, round trips, airport taxi, day rentals, and tour packages.',
    image: '/kodaikanal-hill-station.png',
    isActive: true
  },
  {
    _id: '2',
    title: 'Comfortable Journeys',
    subtitle: 'Experience safe and comfortable travel with our well-maintained vehicles and experienced drivers.',
    image: '/luxury-taxi-service-in-tamil-nadu.png',
    isActive: true
  }
];

const staticTariffServices = [
  {
    _id: '1',
    title: 'One-way Trip',
    description: 'Comfortable one-way travel to your destination with professional drivers',
    image: '/toyota-innova-crysta-luxury-taxi.png',
    pricing: { basePrice: 12, currency: 'INR' },
    features: ['Professional Driver', 'Clean Vehicle', 'On-time Service'],
    isActive: true
  },
  {
    _id: '2',
    title: 'Round Trip',
    description: 'Complete round trip service with flexible timing and comfortable travel',
    image: '/toyota-innova-taxi.png',
    pricing: { basePrice: 20, currency: 'INR' },
    features: ['Flexible Timing', 'Wait Time Included', 'Return Journey'],
    isActive: true
  },
  {
    _id: '3',
    title: 'Airport Taxi',
    description: 'Reliable airport pickup and drop services available 24/7',
    image: '/airport-taxi.png',
    pricing: { basePrice: 15, currency: 'INR' },
    features: ['24/7 Available', 'Flight Tracking', 'Meet & Greet'],
    isActive: true
  },
  {
    _id: '4',
    title: 'Day Rental',
    description: 'Full day vehicle rental for local sightseeing and business trips',
    image: '/maruti-brezza-suv-taxi.png',
    pricing: { basePrice: 2500, currency: 'INR' },
    features: ['8 Hours Service', 'Local Sightseeing', 'Fuel Included'],
    isActive: true
  },
  {
    _id: '5',
    title: 'Hourly Package',
    description: 'Flexible hourly rental service for short trips and quick errands',
    image: '/wagon-r-taxi.png',
    pricing: { basePrice: 300, currency: 'INR' },
    features: ['Minimum 2 Hours', 'Flexible Timing', 'City Limits'],
    isActive: true
  },
  {
    _id: '6',
    title: 'Tour Package',
    description: 'Complete tour packages to popular destinations in Tamil Nadu',
    image: '/tempo-traveller-12-seater.png',
    pricing: { basePrice: 5000, currency: 'INR' },
    features: ['Multi-day Tours', 'Accommodation Help', 'Local Guide'],
    isActive: true
  }
];

const staticPackages = [
  {
    _id: '1',
    title: 'Kodaikanal Hill Station',
    description: 'Experience the beauty of Kodaikanal with our 2-day tour package',
    image: '/kodaikanal-lake-and-hills-scenic-view.png',
    duration: '2 Days',
    price: 7500,
    destinations: ['Kodaikanal', 'Berijam Lake', 'Coaker\'s Walk'],
    highlights: ['Hill Station', 'Lake Views', 'Pleasant Weather'],
    isActive: true
  },
  {
    _id: '2',
    title: 'Ooty Queen of Hills',
    description: 'Discover the charm of Ooty with our comprehensive tour package',
    image: '/ooty-hills-tea-gardens.png',
    duration: '3 Days',
    price: 12000,
    destinations: ['Ooty', 'Coonoor', 'Kotagiri'],
    highlights: ['Tea Gardens', 'Toy Train', 'Botanical Garden'],
    isActive: true
  },
  {
    _id: '3',
    title: 'Rameswaram Pilgrimage',
    description: 'Sacred pilgrimage tour to Rameswaram temple and surrounding areas',
    image: '/rameswaram-temple.png',
    duration: '2 Days',
    price: 6500,
    destinations: ['Rameswaram', 'Dhanushkodi', 'Pamban Bridge'],
    highlights: ['Temple Visit', 'Beach Views', 'Spiritual Journey'],
    isActive: true
  },
  {
    _id: '4',
    title: 'Madurai Temple City',
    description: 'Explore the historic temples and culture of Madurai',
    image: '/madurai-meenakshi-temple.png',
    duration: '1 Day',
    price: 2500,
    destinations: ['Meenakshi Temple', 'Thirumalai Nayakkar Palace', 'Gandhi Museum'],
    highlights: ['Ancient Temples', 'Rich History', 'Cultural Heritage'],
    isActive: true
  },
  {
    _id: '5',
    title: 'Kodaikanal Pillar Rocks',
    description: 'Visit the famous Pillar Rocks and scenic viewpoints in Kodaikanal',
    image: '/pillar-rocks-kodaikanal.png',
    duration: '2 Days',
    price: 5500,
    destinations: ['Pillar Rocks', 'Bryant Park', 'Coaker\'s Walk'],
    highlights: ['Rock Formations', 'Valley Views', 'Cool Climate'],
    isActive: true
  },
  {
    _id: '6',
    title: 'Thirumalai Palace Tour',
    description: 'Explore the magnificent Thirumalai Nayakkar Palace in Madurai',
    image: '/thirumalai-nayakkar-palace.png',
    duration: '1 Day',
    price: 3500,
    destinations: ['Thirumalai Palace', 'Gandhi Museum', 'Local Markets'],
    highlights: ['Royal Architecture', 'Historical Sites', 'Cultural Experience'],
    isActive: true
  }
];

export default function CompleteHome() {
  const [currentBanner, setCurrentBanner] = useState(0);

  // Auto-rotate banners
  useEffect(() => {
    if (staticBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % staticBanners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleBookNow = (serviceTitle?: string) => {
    // For homepage, scroll to the quick book form
    const formElement = document.getElementById('quick-book-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCallNow = () => {
    window.open('tel:+919003782966', '_self');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Static Banners */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {staticBanners.map((banner, index) => (
            <motion.div
              key={banner._id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentBanner ? 1 : 0 }}
              transition={{ duration: 1 }}
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 bg-admin-gradient/20" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30 text-lg px-6 py-2">
              Welcome to Vinushree Tours & Travels
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {staticBanners[currentBanner]?.title}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                With Comfort & Style
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              {staticBanners[currentBanner]?.subtitle}
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              onClick={() => handleBookNow()}
              size="lg"
              className="bg-admin-gradient text-white border-0 px-8 py-4 text-lg font-semibold transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:scale-105"
            >
              Book Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={handleCallNow}
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold bg-transparent backdrop-blur-sm hover:scale-105"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </Button>
          </motion.div>
        </div>

        {/* Banner Indicators */}
        {staticBanners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {staticBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentBanner ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick Book Form Section */}
      <section id="quick-book-form" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <QuickBookForm />
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
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
              <span className="block text-transparent bg-clip-text bg-admin-gradient">
                Across Tamil Nadu
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto px-2">
              From airport transfers to complete tour packages, we provide reliable and comfortable travel solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {staticTariffServices.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                          ₹{service.pricing.basePrice}+
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 md:p-8">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                        {service.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Button
                          onClick={() => handleBookNow(service.title)}
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
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
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
              Featured
              <span className="block text-transparent bg-clip-text bg-admin-gradient">
                Travel Packages
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto px-2">
              Discover the beauty of Tamil Nadu with our carefully crafted tour packages
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {staticPackages.map((pkg, index) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={pkg.image}
                        alt={pkg.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                          {pkg.duration}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 md:p-8">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                        {pkg.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6 line-clamp-2">
                        {pkg.description}
                      </p>
                      <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {pkg.destinations.slice(0, 2).join(', ')}
                          {pkg.destinations.length > 2 && '...'}
                        </div>
                        <div className="text-base sm:text-lg md:text-xl font-bold text-admin-primary">
                          ₹{pkg.price}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Button
                          onClick={() => handleBookNow(pkg.title)}
                          className="bg-admin-gradient text-white hover:opacity-90 text-sm sm:text-base py-2 sm:py-2.5"
                        >
                          Book Now
                        </Button>
                        <Link
                          href="/packages"
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

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-admin-gradient text-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <motion.div
            className="text-center mb-12 sm:mb-16 md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 sm:mb-6 bg-white/20 text-white border-white/30 px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 px-2">
              Your Trusted Travel Partner
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto px-2">
              Experience the difference with our professional travel services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {[
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Trust & Safety",
                description: "Licensed and insured vehicles with experienced drivers"
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: "Best Pricing",
                description: "Competitive rates with transparent pricing and no hidden costs"
              },
              {
                icon: <MapPin className="h-8 w-8" />,
                title: "Wide Coverage",
                description: "Complete coverage across Tamil Nadu and neighboring states"
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Comfort First",
                description: "Well-maintained vehicles ensuring comfortable journeys"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 px-2">
              Ready to Start Your Journey?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 md:mb-10 max-w-xs sm:max-w-xl md:max-w-2xl mx-auto px-2">
              Book your travel with us today and experience the best of Tamil Nadu
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                onClick={() => handleBookNow()}
                size="lg"
                className="bg-admin-gradient text-white hover:opacity-90 px-8 py-4 text-lg font-semibold hover:scale-105"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Book via WhatsApp
              </Button>
              <Button
                onClick={handleCallNow}
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold bg-transparent backdrop-blur-sm hover:scale-105"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>


    </div>
  );
}