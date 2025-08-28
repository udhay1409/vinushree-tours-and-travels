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
      address: "123 Travel Street",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600001",
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
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              {themeData?.logo ? (
                <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center">
                  <Image
                    src={themeData.logo}
                    alt="Vinushree Tours & Travels"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-admin-gradient overflow-hidden flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">V</span>
                </div>
              )}
              <div>
                <div className="font-bold text-xl bg-admin-gradient bg-clip-text text-transparent">
                  Vinushree
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  Tours & Travels
                </div>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted travel partner across Tamil Nadu. We provide safe, comfortable, and reliable travel services for all your journey needs.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-admin-primary" />
                <a 
                  href={`tel:${contactInfo?.phone || '+919876543210'}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {contactInfo?.phone || '+91 90037 82966'}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-admin-primary" />
                <a 
                  href={`mailto:${contactInfo?.email || 'info@vinushree.com'}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {contactInfo?.email || 'info@vinushree.com'}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-admin-primary mt-1" />
                <div className="text-gray-300">
                  <div>{contactInfo?.address || '123 Travel Street'}</div>
                  <div>{contactInfo?.city || 'Chennai'}, {contactInfo?.state || 'Tamil Nadu'} - {contactInfo?.pincode || '600001'}</div>
                </div>
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

      {/* Features Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 text-admin-primary mb-2" />
              <h4 className="font-semibold text-white mb-1">Safe & Secure</h4>
              <p className="text-gray-400 text-sm">Licensed & insured vehicles</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-8 w-8 text-admin-primary mb-2" />
              <h4 className="font-semibold text-white mb-1">24/7 Service</h4>
              <p className="text-gray-400 text-sm">Round the clock availability</p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-8 w-8 text-admin-primary mb-2" />
              <h4 className="font-semibold text-white mb-1">Best Rates</h4>
              <p className="text-gray-400 text-sm">Competitive pricing</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-admin-primary mb-2" />
              <h4 className="font-semibold text-white mb-1">Expert Drivers</h4>
              <p className="text-gray-400 text-sm">Experienced professionals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media & Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Vinushree Tours & Travels. All rights reserved.
            </div>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              {contactInfo?.facebook && (
                <a
                  href={contactInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {contactInfo?.twitter && (
                <a
                  href={contactInfo.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {contactInfo?.instagram && (
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {contactInfo?.whatsapp && (
                <button
                  onClick={handleWhatsAppClick}
                  className="text-gray-400 hover:text-green-500 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}