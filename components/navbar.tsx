"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Phone,
  X,
  Mail,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
}



// Separate client component for pathname functionality
function NavbarContent() {
  const { themeData } = useTheme();
  const pathname = usePathname();


  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set static contact information for travel business
  useEffect(() => {
    setContactInfo({
      phone: "+91 90037 82966",
      email: "info@vinushree.com",
      address: "mani road, Uthangudi, Othakadai",
      city: "Madurai",
      state: "Tamil Nadu",
      pincode: "625007",
      country: "India"
    });
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Tariff", href: "/tariff" },
    { name: "Packages", href: "/packages" },
    { name: "Contact", href: "/contact" },
  ];

  const handleBookNow = () => {
    // Navigate to the booking form on homepage
    if (pathname === '/') {
      // If on homepage, scroll to the form
      const formElement = document.getElementById('quick-book-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      // If on other pages, navigate to homepage with form section
      window.location.href = '/#quick-book-form';
    }
    setIsOpen(false);
  };



  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Bar with Dynamic Contact Info - Responsive */}
      <div className="bg-admin-gradient text-white py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm">
        <div className="container mx-auto flex flex-col sm:flex-row lg:flex-row justify-between items-center gap-1 sm:gap-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-center lg:justify-start gap-2 sm:gap-4 lg:gap-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <Phone className="h-3 w-3 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
              <a
                href={`tel:${contactInfo?.phone || "+91 90037 82966"}`}
                className="font-medium text-xs sm:text-xs lg:text-sm hover:text-white/80 transition-colors"
              >
                {contactInfo?.phone || "+91 90037 82966"}
              </a>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Mail className="h-3 w-3 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
              <a
                href={`mailto:${
                  contactInfo?.email || "info@vinushree.com"
                }`}
                className="font-medium text-xs sm:text-xs lg:text-sm hover:text-white/80 transition-colors truncate max-w-[200px] sm:max-w-none"
              >
                {contactInfo?.email || "info@vinushree.com"}
              </a>
            </div>
          </div>
          <div className="hidden lg:flex xl:flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="font-medium text-sm">
              {contactInfo
                ? `${contactInfo.address}, ${contactInfo.city}, ${contactInfo.state}-${contactInfo.pincode}`
                : "mani road, Uthangudi, Othakadai, Madurai, Tamil Nadu-625007"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation - Responsive */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-100"
            : "bg-white/98 backdrop-blur-sm shadow-lg"
        }`}
      >
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
            {/* Logo - Responsive */}
            <Link
              href="/"
              className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3 group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center bg-white shadow-md">
                <Image
                  src={themeData?.logo || "/vinushree-tours-logo.png"}
                  alt={`${themeData?.siteName || "Vinushree Tours"} Logo`}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-lg lg:text-xl xl:text-2xl bg-admin-gradient bg-clip-text text-transparent">
                  {themeData?.siteName?.split(' ')[0] || "Vinushree"}
                </div>
                <div className="text-xs sm:text-xs lg:text-sm text-gray-600 font-medium">
                  {themeData?.siteName?.includes('Tours') 
                    ? 'Tours & Travels' 
                    : themeData?.siteName?.split(' ').slice(1).join(' ') || 'Tours & Travels'}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-all font-semibold text-base xl:text-lg relative group ${
                    isActive(item.href)
                      ? "text-transparent bg-clip-text bg-admin-gradient"
                      : "text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-admin-gradient"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-admin-gradient transition-all duration-300 ${
                      isActive(item.href)
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              ))}

              <Button
                onClick={handleBookNow}
                className="bg-admin-gradient text-white border-0 px-4 xl:px-6 py-2 font-semibold text-sm xl:text-base transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Book Now
              </Button>
              {/* WhatsApp Button */}
              <Button
                onClick={() => window.open(`https://wa.me/${contactInfo?.phone?.replace(/[^0-9]/g, '') || '919003782966'}?text=Hi, I'm interested in your travel services`, '_blank')}
                variant="outline"
                className="border-admin-primary text-admin-primary hover:bg-admin-gradient hover:text-white px-4 xl:px-6 py-2 font-semibold text-sm xl:text-base transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <Phone className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>

            {/* Mobile Menu Button - Responsive */}
            <button
              className="lg:hidden p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Responsive */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-gray-100 shadow-xl"
            >
              <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`block transition-all font-semibold text-base sm:text-lg py-2.5 sm:py-3 px-2 rounded-lg hover:bg-gray-50 ${
                        isActive(item.href)
                          ? "text-transparent bg-clip-text bg-admin-gradient"
                          : "text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-admin-gradient"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (navItems.length + 1) * 0.1 }}
                >
                  <Button
                    onClick={handleBookNow}
                    className="w-full bg-admin-gradient hover:opacity-90 text-white border-0 py-2.5 sm:py-3 font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg"
                  >
                    Book Now
                  </Button>
                </motion.div>

                {/* Mobile Get Brochure Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="pt-3 sm:pt-4 border-t border-gray-200"
                >
                  <Button
                    onClick={() => window.open(`https://wa.me/${contactInfo?.phone?.replace(/[^0-9]/g, '') || '919003782966'}?text=Hi, I'm interested in your travel services`, '_blank')}
                    variant="outline"
                    className="w-full border-admin-primary text-admin-primary hover:bg-admin-gradient hover:text-white py-2.5 sm:py-3 font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg mb-3"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>


    </>
  );
}

// Main Navbar component wrapper
export default function Navbar() {
  return <NavbarContent />;
}