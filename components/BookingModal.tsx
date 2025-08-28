"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, MessageCircle, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledService?: string;
  prefilledTitle?: string;
}

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

export default function BookingModal({ isOpen, onClose, prefilledService, prefilledTitle }: BookingModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const pickupRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: prefilledService || "",
    pickupLocation: "",
    dropLocation: "",
    travelDate: "",
    travelTime: ""
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
    if (isOpen && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initAutocomplete`;
      script.async = true;
      script.defer = true;
      
      window.initAutocomplete = () => {
        setIsGoogleLoaded(true);
      };
      
      document.head.appendChild(script);
    } else if (window.google) {
      setIsGoogleLoaded(true);
    }
  }, [isOpen]);

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

  // Reset form when modal opens with prefilled data
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        service: prefilledService || "",
      }));
    }
  }, [isOpen, prefilledService]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call to save lead
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create WhatsApp message
      const message = `🚗 *Booking Request*

*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Email:* ${formData.email}
*Service:* ${formData.service}
*Pickup:* ${formData.pickupLocation}
*Drop:* ${formData.dropLocation}
*Date:* ${formData.travelDate}
*Time:* ${formData.travelTime}

Please confirm availability and provide final pricing.`;

      // Open WhatsApp
      const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      toast({
        title: "Booking Request Sent!",
        description: "We'll contact you shortly with availability and pricing details.",
      });

      // Reset form and close modal
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        pickupLocation: "",
        dropLocation: "",
        travelDate: "",
        travelTime: ""
      });
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="h-6 w-6 mr-2 text-admin-primary" />
            Book Your Travel
            {prefilledTitle && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                - {prefilledTitle}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
              className="mt-1"
            />
          </div>

          {/* Service Selection */}
          <div>
            <Label htmlFor="service" className="text-gray-700 font-medium">
              Service Type *
            </Label>
            <Select
              value={formData.service}
              onValueChange={(value) => handleInputChange("service", value)}
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

          {/* Location Fields with Google Autocomplete */}
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
                Travel Date *
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
                Travel Time
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

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-admin-gradient text-white hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Submit & Continue to WhatsApp
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}