"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger, 
  SelectValue, 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Loader2,
  Image as ImageIcon,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react";

interface Banner {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  mobileImage?: string;
  status: string;
  order: number;
  showBookingForm: boolean;
  backgroundColor: string;
  textColor: string;
  overlayOpacity: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export default function BannerManagerPage() {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingButtonId, setDeletingButtonId] = useState<string | null>(null);
  const scrollPositionRef = useRef<number>(0);

  // Static sample data for banners
  const sampleBanners: Banner[] = [
    {
      _id: "1",
      title: "Explore Tamil Nadu with Vinushree Tours",
      subtitle: "Your Trusted Travel Partner",
      description: "Experience the best of Tamil Nadu with our reliable taxi services, tour packages, and travel solutions. Book now for comfortable and safe journeys.",
      ctaText: "Book Your Ride",
      ctaLink: "#booking-form",
      image: "/images/banners/tamil-nadu-travel.jpg",
      mobileImage: "/images/banners/tamil-nadu-travel-mobile.jpg",
      status: "active",
      order: 1,
      showBookingForm: true,
      backgroundColor: "#1e40af",
      textColor: "#ffffff",
      overlayOpacity: 0.4,
      seoTitle: "Tamil Nadu Travel Services | Vinushree Tours & Travels",
      seoDescription: "Explore Tamil Nadu with our reliable travel services. Book taxi, tour packages, and travel solutions.",
      seoKeywords: "tamil nadu travel, taxi service, tour packages, vinushree tours"
    },
    {
      _id: "2",
      title: "Airport Taxi Services",
      subtitle: "24/7 Available",
      description: "Reliable airport pickup and drop services across Chennai, Bangalore, and major cities. Pre-book your airport taxi for hassle-free travel.",
      ctaText: "Book Airport Taxi",
      ctaLink: "#booking-form",
      image: "/images/banners/airport-taxi.jpg",
      mobileImage: "/images/banners/airport-taxi-mobile.jpg",
      status: "active",
      order: 2,
      showBookingForm: true,
      backgroundColor: "#059669",
      textColor: "#ffffff",
      overlayOpacity: 0.5,
      seoTitle: "Airport Taxi Services | 24/7 Available | Vinushree Tours",
      seoDescription: "Book reliable airport taxi services. 24/7 available for Chennai, Bangalore airports.",
      seoKeywords: "airport taxi, chennai airport, bangalore airport, taxi booking"
    },
    {
      _id: "3",
      title: "Ooty & Kodaikanal Tour Packages",
      subtitle: "Hill Station Special",
      description: "Discover the beauty of South India's most popular hill stations. Complete tour packages with accommodation, sightseeing, and transportation.",
      ctaText: "View Packages",
      ctaLink: "/packages",
      image: "/images/banners/hill-stations.jpg",
      mobileImage: "/images/banners/hill-stations-mobile.jpg",
      status: "active",
      order: 3,
      showBookingForm: false,
      backgroundColor: "#7c3aed",
      textColor: "#ffffff",
      overlayOpacity: 0.3,
      seoTitle: "Ooty Kodaikanal Tour Packages | Hill Station Tours",
      seoDescription: "Book complete tour packages for Ooty and Kodaikanal. Includes accommodation and sightseeing.",
      seoKeywords: "ooty tour, kodaikanal tour, hill station packages, south india tours"
    }
  ];

  // Initialize with sample data
  useState(() => {
    setBanners(sampleBanners);
  });

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    ctaText: "",
    ctaLink: "",
    image: "",
    mobileImage: "",
    status: "active",
    order: 1,
    showBookingForm: true,
    backgroundColor: "#1e40af",
    textColor: "#ffffff",
    overlayOpacity: 0.4,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  const handleEdit = (banner: Banner) => {
    scrollPositionRef.current = window.scrollY;
    
    setEditingId(banner._id || null);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      ctaText: banner.ctaText,
      ctaLink: banner.ctaLink,
      image: banner.image,
      mobileImage: banner.mobileImage || "",
      status: banner.status,
      order: banner.order,
      showBookingForm: banner.showBookingForm,
      backgroundColor: banner.backgroundColor,
      textColor: banner.textColor,
      overlayOpacity: banner.overlayOpacity,
      seoTitle: banner.seoTitle,
      seoDescription: banner.seoDescription,
      seoKeywords: banner.seoKeywords,
    });
    setSelectedFiles({
      desktopImage: null,
      mobileImage: null,
    });
    setIsAddModalOpen(true);
  };

  const handleSave = async () => {
    setIsFormSubmitted(true);
    setIsSaving(true);

    // Validate required fields
    if (
      !formData.title ||
      !formData.subtitle ||
      !formData.description ||
      !formData.ctaText ||
      !formData.image ||
      !formData.seoTitle ||
      !formData.seoDescription ||
      !formData.seoKeywords
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    try {
      // Simulate API call - replace with actual API later
      const bannerData = {
        ...formData,
        order: Number(formData.order),
        overlayOpacity: Number(formData.overlayOpacity),
      };

      // Simulate success
      toast({
        title: editingId ? "Banner Updated" : "Banner Added",
        description: `Banner has been successfully ${
          editingId ? "updated" : "added"
        }.`,
      });
      
      handleCancel();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save banner",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const [deletingBannerId, setDeletingBannerId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeletingBannerId(id);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setDeletingButtonId(id);
    
    try {
      // Simulate API call
      toast({
        title: "Banner Deleted",
        description: "Banner has been successfully deleted.",
      });
      setDeletingBannerId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeletingButtonId(null);
    }
  };

  const handleCancel = () => {
    const savedScrollPosition = scrollPositionRef.current;
    
    setIsAddModalOpen(false);
    setEditingId(null);
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      ctaText: "",
      ctaLink: "",
      image: "",
      mobileImage: "",
      status: "active",
      order: 1,
      showBookingForm: true,
      backgroundColor: "#1e40af",
      textColor: "#ffffff",
      overlayOpacity: 0.4,
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    });
    setSelectedFiles({
      desktopImage: null,
      mobileImage: null,
    });
    
    requestAnimationFrame(() => {
      window.scrollTo({ 
        top: savedScrollPosition, 
        behavior: "instant" 
      });
    });
  };

  const [selectedFiles, setSelectedFiles] = useState<{
    desktopImage: File | null;
    mobileImage: File | null;
  }>({
    desktopImage: null,
    mobileImage: null,
  });

  const handleImageUpload = (type: "desktop" | "mobile") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        if (type === "desktop") {
          setSelectedFiles((prev) => ({ ...prev, desktopImage: files[0] }));
          const previewUrl = URL.createObjectURL(files[0]);
          setFormData((prev) => ({ ...prev, image: previewUrl }));
        } else {
          setSelectedFiles((prev) => ({ ...prev, mobileImage: files[0] }));
          const previewUrl = URL.createObjectURL(files[0]);
          setFormData((prev) => ({ ...prev, mobileImage: previewUrl }));
        }

        toast({
          title: "Image Selected",
          description: `${type === "desktop" ? "Desktop" : "Mobile"} image selected. Click Save to upload.`,
        });
      }
    };
    input.click();
  };

  const toggleBannerStatus = (id: string) => {
    setBanners(banners.map(banner => 
      banner._id === id 
        ? { ...banner, status: banner.status === "active" ? "inactive" : "active" }
        : banner
    ));
    
    const banner = banners.find(b => b._id === id);
    toast({
      title: "Banner Status Updated",
      description: `Banner is now ${banner?.status === "active" ? "inactive" : "active"}.`,
    });
  };

  const moveBanner = (id: string, direction: "up" | "down") => {
    const currentIndex = banners.findIndex(b => b._id === id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === banners.length - 1)
    ) {
      return;
    }

    const newBanners = [...banners];
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    
    // Swap banners
    [newBanners[currentIndex], newBanners[targetIndex]] = 
    [newBanners[targetIndex], newBanners[currentIndex]];
    
    // Update order numbers
    newBanners.forEach((banner, index) => {
      banner.order = index + 1;
    });
    
    setBanners(newBanners);
    
    toast({
      title: "Banner Order Updated",
      description: `Banner moved ${direction}.`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-admin-gradient bg-clip-text text-transparent">
            Banner Manager
          </h1>
          <p className="text-gray-600 mt-2">
            Upload and manage homepage banners for Vinushree Tours & Travels
          </p>
        </div>

        <Dialog
          open={isAddModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsFormSubmitted(false);
              const savedScrollPosition = scrollPositionRef.current;
              handleCancel();
              
              setTimeout(() => {
                window.scrollTo({ 
                  top: savedScrollPosition, 
                  behavior: "instant" 
                });
              }, 50);
            } else {
              scrollPositionRef.current = window.scrollY;
            }
            setIsAddModalOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                scrollPositionRef.current = window.scrollY;
                setEditingId(null);
                setFormData({
                  title: "",
                  subtitle: "",
                  description: "",
                  ctaText: "",
                  ctaLink: "",
                  image: "",
                  mobileImage: "",
                  status: "active",
                  order: banners.length + 1,
                  showBookingForm: true,
                  backgroundColor: "#1e40af",
                  textColor: "#ffffff",
                  overlayOpacity: 0.4,
                  seoTitle: "",
                  seoDescription: "",
                  seoKeywords: "",
                });
                setSelectedFiles({
                  desktopImage: null,
                  mobileImage: null,
                });
                setIsAddModalOpen(true);
              }}
              className="bg-admin-gradient text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Banner
            </Button>
          </DialogTrigger>    
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle className="text-2xl bg-admin-gradient bg-clip-text text-transparent">
                {editingId ? "Edit Banner" : "Add New Banner"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-8 p-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Banner Content
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title" className="text-base font-semibold">
                      Banner Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., Explore Tamil Nadu with Vinushree Tours"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.title
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.title && (
                      <p className="text-sm text-red-500 mt-1">
                        Banner title is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="subtitle" className="text-base font-semibold">
                      Banner Subtitle <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) =>
                        setFormData({ ...formData, subtitle: e.target.value })
                      }
                      placeholder="e.g., Your Trusted Travel Partner"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.subtitle
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.subtitle && (
                      <p className="text-sm text-red-500 mt-1">
                        Banner subtitle is required
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-base font-semibold">
                    Banner Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Detailed description of the banner content and services"
                    rows={4}
                    className={`mt-2 ${
                      isFormSubmitted && !formData.description
                        ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {isFormSubmitted && !formData.description && (
                    <p className="text-sm text-red-500 mt-1">
                      Banner description is required
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="ctaText" className="text-base font-semibold">
                      Call-to-Action Text <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ctaText"
                      value={formData.ctaText}
                      onChange={(e) =>
                        setFormData({ ...formData, ctaText: e.target.value })
                      }
                      placeholder="e.g., Book Your Ride"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.ctaText
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.ctaText && (
                      <p className="text-sm text-red-500 mt-1">
                        CTA text is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="ctaLink" className="text-base font-semibold">
                      Call-to-Action Link
                    </Label>
                    <Input
                      id="ctaLink"
                      value={formData.ctaLink}
                      onChange={(e) =>
                        setFormData({ ...formData, ctaLink: e.target.value })
                      }
                      placeholder="e.g., #booking-form or /packages"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Banner Images */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Banner Images
                </h3>
                
                {/* Desktop Image */}
                <div>
                  <Label className="text-base font-semibold">
                    Desktop Image (1920x1080 recommended) <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-2 space-y-4">
                    <Button
                      type="button"
                      onClick={() => handleImageUpload("desktop")}
                      variant="outline"
                      className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-blue-400"
                    >
                      <div className="text-center">
                        <Monitor className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Click to upload desktop banner image
                        </p>
                      </div>
                    </Button>
                    {formData.image && (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Desktop banner preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  {isFormSubmitted && !formData.image && (
                    <p className="text-sm text-red-500 mt-1">
                      Desktop banner image is required
                    </p>
                  )}
                </div>

                {/* Mobile Image */}
                <div>
                  <Label className="text-base font-semibold">
                    Mobile Image (750x1334 recommended)
                  </Label>
                  <div className="mt-2 space-y-4">
                    <Button
                      type="button"
                      onClick={() => handleImageUpload("mobile")}
                      variant="outline"
                      className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-blue-400"
                    >
                      <div className="text-center">
                        <Smartphone className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Click to upload mobile banner image (optional)
                        </p>
                      </div>
                    </Button>
                    {formData.mobileImage && (
                      <div className="relative">
                        <img
                          src={formData.mobileImage}
                          alt="Mobile banner preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    If not provided, desktop image will be used for mobile devices
                  </p>
                </div>
              </div>

              {/* Banner Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Banner Settings
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="status" className="text-base font-semibold">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="order" className="text-base font-semibold">
                      Display Order
                    </Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({ ...formData, order: Number(e.target.value) })
                      }
                      placeholder="1"
                      min="1"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="backgroundColor" className="text-base font-semibold">
                      Background Color
                    </Label>
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) =>
                        setFormData({ ...formData, backgroundColor: e.target.value })
                      }
                      className="mt-2 h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="textColor" className="text-base font-semibold">
                      Text Color
                    </Label>
                    <Input
                      id="textColor"
                      type="color"
                      value={formData.textColor}
                      onChange={(e) =>
                        setFormData({ ...formData, textColor: e.target.value })
                      }
                      className="mt-2 h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="overlayOpacity" className="text-base font-semibold">
                      Overlay Opacity
                    </Label>
                    <Input
                      id="overlayOpacity"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.overlayOpacity}
                      onChange={(e) =>
                        setFormData({ ...formData, overlayOpacity: Number(e.target.value) })
                      }
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Current: {(formData.overlayOpacity * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showBookingForm"
                    checked={formData.showBookingForm}
                    onChange={(e) =>
                      setFormData({ ...formData, showBookingForm: e.target.checked })
                    }
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="showBookingForm" className="text-base font-semibold">
                    Show Booking Form on this Banner
                  </Label>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  SEO Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="seoTitle" className="text-base font-semibold">
                      SEO Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="seoTitle"
                      value={formData.seoTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, seoTitle: e.target.value })
                      }
                      placeholder="SEO optimized title for search engines"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.seoTitle
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.seoTitle && (
                      <p className="text-sm text-red-500 mt-1">
                        SEO title is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="seoDescription" className="text-base font-semibold">
                      SEO Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="seoDescription"
                      value={formData.seoDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, seoDescription: e.target.value })
                      }
                      placeholder="Meta description for search engines (150-160 characters)"
                      rows={3}
                      className={`mt-2 ${
                        isFormSubmitted && !formData.seoDescription
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.seoDescription && (
                      <p className="text-sm text-red-500 mt-1">
                        SEO description is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="seoKeywords" className="text-base font-semibold">
                      SEO Keywords <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="seoKeywords"
                      value={formData.seoKeywords}
                      onChange={(e) =>
                        setFormData({ ...formData, seoKeywords: e.target.value })
                      }
                      placeholder="Comma-separated keywords for SEO"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.seoKeywords
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.seoKeywords && (
                      <p className="text-sm text-red-500 mt-1">
                        SEO keywords are required
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-admin-gradient text-white border-0"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingId ? "Update Banner" : "Save Banner"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banner Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold bg-admin-gradient bg-clip-text text-transparent mb-2">
              {banners.length}
            </div>
            <div className="text-gray-600 text-sm font-medium">Total Banners</div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold bg-admin-gradient bg-clip-text text-transparent mb-2">
              {banners.filter(b => b.status === "active").length}
            </div>
            <div className="text-gray-600 text-sm font-medium">Active Banners</div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <EyeOff className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold bg-admin-gradient bg-clip-text text-transparent mb-2">
              {banners.filter(b => b.status === "inactive").length}
            </div>
            <div className="text-gray-600 text-sm font-medium">Inactive Banners</div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Monitor className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold bg-admin-gradient bg-clip-text text-transparent mb-2">
              {banners.filter(b => b.showBookingForm).length}
            </div>
            <div className="text-gray-600 text-sm font-medium">With Booking Form</div>
          </CardContent>
        </Card>
      </div>

      {/* Banners List */}
      <div className="space-y-6">
        {banners.map((banner, index) => (
          <Card key={banner._id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="flex">
              {/* Banner Preview */}
              <div className="w-1/3 relative">
                <img
                  src={banner.image || "/images/placeholder-banner.jpg"}
                  alt={banner.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant={banner.status === "active" ? "default" : "secondary"}
                    className={
                      banner.status === "active"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }
                  >
                    {banner.status}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    Order: {banner.order}
                  </Badge>
                </div>
                {banner.showBookingForm && (
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      Booking Form
                    </Badge>
                  </div>
                )}
              </div>

              {/* Banner Content */}
              <CardContent className="flex-1 p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {banner.title}
                    </h3>
                    <p className="text-lg text-gray-700 mb-2">
                      {banner.subtitle}
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {banner.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Monitor className="h-4 w-4" />
                      <span>Desktop</span>
                    </div>
                    {banner.mobileImage && (
                      <div className="flex items-center gap-1">
                        <Smartphone className="h-4 w-4" />
                        <span>Mobile</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span>CTA:</span>
                      <span className="font-medium">{banner.ctaText}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleBannerStatus(banner._id!)}
                        className="flex items-center gap-2"
                      >
                        {banner.status === "active" ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        {banner.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveBanner(banner._id!, "up")}
                        disabled={index === 0}
                        className="flex items-center gap-2"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveBanner(banner._id!, "down")}
                        disabled={index === banners.length - 1}
                        className="flex items-center gap-2"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(banner)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(banner._id!)}
                        className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {banners.length === 0 && (
        <Card className="shadow-xl border-0">
          <CardContent className="p-16 text-center">
            <div className="w-20 h-20 bg-admin-gradient rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No banners found</h3>
            <p className="text-gray-600 mb-6">
              Create your first homepage banner to get started.
            </p>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-admin-gradient text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Banner
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingBannerId}
        onOpenChange={() => setDeletingBannerId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              banner and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingBannerId && handleDelete(deletingBannerId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting && deletingButtonId === deletingBannerId ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Banner"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}