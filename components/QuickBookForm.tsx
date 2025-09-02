"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { useToast } from "@/hooks/use-toast";

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

export default function QuickBookForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const pickupRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    pickupLocation: "",
    dropLocation: "",
    travelDate: "",
    travelTime: "",
    returnDate: ""
  });



  const services = [
    "One-way Trip",
    "Round Trip", 
    "Airport Taxi",
    "Day Rental",
    "Hourly Package",
    "Local Pickup/Drop",
    "Tour Package"
  ];

  // Load Google Maps API
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initAutocomplete`;
      script.async = true;
      script.defer = true;
      
      window.initAutocomplete = () => {
        setIsGoogleLoaded(true);
      };
      
      document.head.appendChild(script);
    } else {
      setIsGoogleLoaded(true);
    }
  }, []);

  // Initialize autocomplete when Google is loaded
  useEffect(() => {
    if (isGoogleLoaded && window.google && pickupRef.current && dropRef.current) {
      const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupRef.current, {
        componentRestrictions: { country: 'IN' },
        fields: ['formatted_address', 'geometry', 'name'],
        types: ['establishment', 'geocode']
      });

      const dropAutocomplete = new window.google.maps.places.Autocomplete(dropRef.current, {
        componentRestrictions: { country: 'IN' },
        fields: ['formatted_address', 'geometry', 'name'],
        types: ['establishment', 'geocode']
      });

      pickupAutocomplete.addListener('place_changed', () => {
        const place = pickupAutocomplete.getPlace();
        if (place.formatted_address) {
          setFormData(prev => ({ ...prev, pickupLocation: place.formatted_address }));
        }
      });

      dropAutocomplete.addListener('place_changed', () => {
        const place = dropAutocomplete.getPlace();
        if (place.formatted_address) {
          setFormData(prev => ({ ...prev, dropLocation: place.formatted_address }));
        }
      });
    }
  }, [isGoogleLoaded]);

  // Listen for service prefill events from homepage services
  useEffect(() => {
    const handlePrefillService = (event: CustomEvent) => {
      setFormData(prev => ({ ...prev, service: event.detail }));
    };

    window.addEventListener('prefillService', handlePrefillService as EventListener);
    return () => {
      window.removeEventListener('prefillService', handlePrefillService as EventListener);
    };
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuickBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call to save lead
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create WhatsApp message with form data
      const message = `🚗 *Quick Booking Request*
      
*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Service:* ${formData.service}
*Pickup:* ${formData.pickupLocation}
*Drop:* ${formData.dropLocation}
*Pickup Date:* ${formData.travelDate}
*Pickup Time:* ${formData.travelTime}${formData.returnDate ? `\n*Return Date:* ${formData.returnDate}` : ''}

Please provide availability and pricing details.`;

      const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      toast({
        title: "Booking Request Sent!",
        description: "We'll contact you shortly with availability and pricing details.",
      });

      // Reset form
      setFormData({
        name: "",
        phone: "",
        service: "",
        pickupLocation: "",
        dropLocation: "",
        travelDate: "",
        travelTime: "",
        returnDate: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
            <WhatsAppIcon className="h-6 w-6 mr-2 text-admin-primary" />
            Quick Book Now
          </CardTitle>
          <p className="text-gray-600">Get instant quote and availability</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleQuickBook} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  className="mt-1"
                />
              </div>
            </div>



            {/* Service Selection */}
            <div>
              <Label htmlFor="service" className="text-gray-700 font-medium">
                Service Type *
              </Label>
              <Select
                value={formData.service}
                onValueChange={(value) => {
                  handleInputChange("service", value);
                  // Clear return date if not Round Trip
                  if (value !== "Round Trip") {
                    setFormData(prev => ({ ...prev, returnDate: "" }));
                  }
                }}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickup" className="text-gray-700 font-medium flex items-center">
                  <Navigation className="h-4 w-4 mr-1 text-green-500" />
                  Pickup Location *
                </Label>
                <Input
                  ref={pickupRef}
                  id="pickup"
                  type="text"
                  required
                  value={formData.pickupLocation}
                  onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                  placeholder="Enter pickup location"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="drop" className="text-gray-700 font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-red-500" />
                  Drop Location *
                </Label>
                <Input
                  ref={dropRef}
                  id="drop"
                  type="text"
                  required
                  value={formData.dropLocation}
                  onChange={(e) => handleInputChange("dropLocation", e.target.value)}
                  placeholder="Enter drop location"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Travel Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="travelDate" className="text-gray-700 font-medium">
                  Pickup Date *
                </Label>
                <Input
                  id="travelDate"
                  type="date"
                  required
                  value={formData.travelDate}
                  onChange={(e) => handleInputChange("travelDate", e.target.value)}
                  className="mt-1"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="travelTime" className="text-gray-700 font-medium">
                  Pickup Time
                </Label>
                <Input
                  id="travelTime"
                  type="time"
                  value={formData.travelTime}
                  onChange={(e) => handleInputChange("travelTime", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Return Date for Round Trip */}
            {formData.service === "Round Trip" && (
              <div>
                <Label htmlFor="returnDate" className="text-gray-700 font-medium">
                  Return Date *
                </Label>
                <Input
                  id="returnDate"
                  type="date"
                  required={formData.service === "Round Trip"}
                  value={formData.returnDate}
                  onChange={(e) => handleInputChange("returnDate", e.target.value)}
                  className="mt-1"
                  min={formData.travelDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-admin-gradient text-white hover:opacity-90 py-3 text-lg font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting Request...
                </>
              ) : (
                <>
                  <WhatsAppIcon className="h-5 w-5 mr-2" />
                  Submit Now
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}