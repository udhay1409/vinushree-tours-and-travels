"use client";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  ArrowRight,
  Clock,
  Award,
  Users,
  MessageCircle,
  Car,
  Plane,
  Calendar,
  Shield
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "./providers/theme";
import Image from "next/image";

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  whatsapp?: string;
}

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const { themeData } = useTheme();

  useEffect(() => {
    // Set static contact info for travel business
    setContactInfo({
      phone: "+91 90037 82966",
      email: "info@vinushree.com",
      address: "mani road, Uthangudi, Othakadai",
      city: "Madurai",
      state: "Tamil Nadu",
      pincode: "625007",
      country: "India",
      whatsapp: "+91 90037 82966",
      facebook: "https://facebook.com/vinushree",
      instagram: "https://instagram.com/vinushree",
      twitter: "https://twitter.com/vinushree"
    });
  }, []);

  const travelServices = [
    { name: 'One-way Trip', href: '/tariff' },
    { name: 'Round Trip', href: '/tariff' },
    { name: 'Airport Taxi', href: '/tariff' },
    { name: 'Day Rental', href: '/tariff' },
    { name: 'Hourly Package', href: '/tariff' },
    { name: 'Tour Package', href: '/packages' }
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Tariff', href: '/tariff' },
    { name: 'Packages', href: '/packages' },
    { name: 'Contact', href: '/contact' }
  ];

  const destinations = [
    'Chennai', 'Madurai', 'Coimbatore', 'Trichy', 'Salem', 'Tirunelveli'
  ];

  const handleWhatsAppClick = () => {
    const message = "Hi! I'm interested in your travel services. Please provide more details.";
    const whatsappUrl = `https://wa.me/${contactInfo?.whatsapp?.replace(/[^0-9]/g, '') || '919003782966'}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallClick = () => {
    window.open(`tel:${contactInfo?.phone || '+919003782966'}`, '_self');
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-600/10 to-orange-600/10"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">
          {/* Company Info - Enhanced */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-2">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-3 group">
              {themeData?.logo ? (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20">
                  <Image 
                    src={themeData.logo} 
                    alt="Vinushree Tours & Travels Logo" 
                    width={56} 
                    height={56} 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-admin-gradient rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl sm:text-2xl">V</span>
                </div>
              )}
              <div>
                <div className="font-bold text-xl sm:text-2xl bg-admin-gradient bg-clip-text text-transparent">
                  Vinushree
                </div>
                <div className="text-sm sm:text-base font-medium">Tours & Travels</div>
              </div>
            </Link>

            {/* Company Description */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-md">
              Leading provider of professional travel services across Tamil Nadu, delivering safe, comfortable, and memorable journeys with cutting-edge vehicles and expert drivers.
            </p>

            {/* Dynamic Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-admin-primary flex-shrink-0" />
                <a
                  href={`tel:${contactInfo?.phone || "+919003782966"}`}
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  {contactInfo?.phone || "+91 90037 82966"}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-admin-primary flex-shrink-0" />
                <a
                  href={`mailto:${contactInfo?.email || "info@vinushree.com"}`}
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium break-all"
                >
                  {contactInfo?.email || "info@vinushree.com"}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-admin-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm leading-relaxed">
                  {contactInfo ? (
                    `${contactInfo.address}, ${contactInfo.city}, ${contactInfo.state}-${contactInfo.pincode}, ${contactInfo.country}`
                  ) : (
                    "mani road, Uthangudi, Othakadai, Madurai, Tamil Nadu-625007, India"
                  )}
                </span>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm">Follow Us</h4>
              <div className="flex flex-wrap gap-3">
                {contactInfo?.facebook && (
                  <a
                    href={contactInfo.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-2 bg-white/10 hover:bg-blue-600/20 rounded-lg transition-all duration-300 border border-white/20 hover:border-blue-500/50"
                    title="Follow us on Facebook"
                  >
                    <Facebook className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </a>
                )}
                {contactInfo?.instagram && (
                  <a
                    href={contactInfo.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-2 bg-white/10 hover:bg-pink-600/20 rounded-lg transition-all duration-300 border border-white/20 hover:border-pink-500/50"
                    title="Follow us on Instagram"
                  >
                    <Instagram className="h-4 w-4 text-gray-400 group-hover:text-pink-500 transition-colors" />
                  </a>
                )}
                {contactInfo?.whatsapp && (
                  <button
                    onClick={handleWhatsAppClick}
                    className="group p-2 bg-white/10 hover:bg-green-600/20 rounded-lg transition-all duration-300 border border-white/20 hover:border-green-500/50"
                    title="Contact us on WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Our Services</h3>
            <ul className="space-y-3">
              {travelServices.map((service, index) => (
                <li key={index}>
                  <Link
                    href={service.href}
                    className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Popular Destinations</h3>
            <ul className="space-y-3">
              {destinations.map((destination, index) => (
                <li key={index} className="text-gray-300 flex items-center">
                  <MapPin className="h-3 w-3 mr-2 text-admin-primary" />
                  {destination}
                </li>
              ))}
            </ul>
            

          </div>
        </div>
      </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 pb-6 sm:pb-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed px-2">
            © 2025 Vinushree Tours & Travels. All rights reserved. ❤️ 
            <span className="block sm:inline sm:ml-1 hover:text-white transition-colors">
              <a href="https://mntfuture.com/" target="_blank" rel="noopener noreferrer">Developed by MnT</a>
            </span>
          </p>
        </div>
    </footer>
  );
}