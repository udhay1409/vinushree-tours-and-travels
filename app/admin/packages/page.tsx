"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import RichTextEditor from "@/components/ui/rich-text-editor";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Package,
  Upload,
  ImageIcon,
  Loader2,
  MapPin,
  Calendar,
  Users
} from "lucide-react";
import "@/styles/quill.css";

interface TourPackage {
  _id?: string;
  title: string;
  destination: string;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  price: string;
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  image: string;
  gallery: string[];
  status: string;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  itinerary: ItineraryDay[];
}

interface ItineraryDay {
  day: string;
  title: string;
  description: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalPackages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function PackagesPage() {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingButtonId, setDeletingButtonId] = useState<string | null>(null);
  const scrollPositionRef = useRef<number>(0);

  // Static sample data for packages
  const samplePackages: TourPackage[] = [
    {
      _id: "1",
      title: "Ooty Hill Station Tour",
      destination: "Ooty, Tamil Nadu",
      shortDescription: "Experience the beauty of the Queen of Hill Stations with scenic views, tea gardens, and pleasant weather.",
      fullDescription: "<p>Discover the enchanting hill station of Ooty with our comprehensive tour package. Visit famous attractions like Botanical Gardens, Ooty Lake, and Doddabetta Peak.</p>",
      duration: "3 Days 2 Nights",
      price: "₹8,500 per person",
      inclusions: ["Accommodation", "Breakfast", "Transportation", "Sightseeing"],
      exclusions: ["Lunch & Dinner", "Personal Expenses", "Entry Fees"],
      highlights: ["Botanical Gardens", "Ooty Lake", "Toy Train Ride", "Tea Factory Visit"],
      image: "/images/packages/ooty-main.jpg",
      gallery: ["/images/packages/ooty-1.jpg", "/images/packages/ooty-2.jpg"],
      status: "active",
      featured: true,
      seoTitle: "Ooty Hill Station Tour Package - 3 Days",
      seoDescription: "Book your Ooty tour package with Vinushree Tours & Travels. Experience the Queen of Hill Stations.",
      seoKeywords: "ooty tour, hill station, tamil nadu tourism",
      itinerary: [
        { day: "1", title: "Arrival & Local Sightseeing", description: "Arrive in Ooty, check-in to hotel, visit Botanical Gardens and Ooty Lake" },
        { day: "2", title: "Doddabetta & Tea Gardens", description: "Visit Doddabetta Peak, Tea Factory, and enjoy Toy Train ride" },
        { day: "3", title: "Departure", description: "Check-out and departure with sweet memories" }
      ]
    },
    {
      _id: "2", 
      title: "Kodaikanal Package",
      destination: "Kodaikanal, Tamil Nadu",
      shortDescription: "Explore the Princess of Hill Stations with lakes, valleys, and misty mountains.",
      fullDescription: "<p>Experience the serene beauty of Kodaikanal with visits to Kodai Lake, Coaker's Walk, and Bryant Park.</p>",
      duration: "2 Days 1 Night",
      price: "₹6,500 per person",
      inclusions: ["Accommodation", "Breakfast", "Transportation"],
      exclusions: ["Meals", "Personal Expenses"],
      highlights: ["Kodai Lake", "Coaker's Walk", "Bryant Park", "Silver Cascade Falls"],
      image: "/images/packages/kodai-main.jpg",
      gallery: [],
      status: "active",
      featured: false,
      seoTitle: "Kodaikanal Tour Package - 2 Days",
      seoDescription: "Discover Kodaikanal with our affordable tour packages from Vinushree Tours & Travels.",
      seoKeywords: "kodaikanal tour, hill station package",
      itinerary: [
        { day: "1", title: "Arrival & Sightseeing", description: "Arrive, visit Kodai Lake and Coaker's Walk" },
        { day: "2", title: "Departure", description: "Visit Bryant Park and departure" }
      ]
    }
  ];

  // Initialize with sample data
  useState(() => {
    setPackages(samplePackages);
  });

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalPackages: 2,
    limit: 6,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    shortDescription: "",
    fullDescription: "",
    duration: "",
    price: "",
    inclusions: "",
    exclusions: "",
    highlights: "",
    image: "",
    gallery: [] as string[],
    status: "active",
    featured: false,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  // Check if maximum featured packages limit reached (3 featured packages max)
  const maxFeaturedReached =
    packages.filter((pkg) => pkg.featured).length >= 3;

  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([
    { day: "1", title: "", description: "" },
  ]);

  // Quill configuration
  const quillModules = {
    toolbar: {
      container: [[{ list: "ordered" }, { list: "bullet" }], ["clean"]],
    },
  };

  const quillFormats = ["list", "bullet"];

  // Helper function to check if ReactQuill content is empty
  const isQuillContentEmpty = (content: string) => {
    if (!content) return true;
    const textContent = content.replace(/<[^>]*>/g, "").trim();
    return textContent === "";
  };

  const handleEdit = (pkg: TourPackage) => {
    scrollPositionRef.current = window.scrollY;
    
    setEditingId(pkg._id || null);
    setFormData({
      title: pkg.title,
      destination: pkg.destination,
      shortDescription: pkg.shortDescription,
      fullDescription: pkg.fullDescription,
      duration: pkg.duration,
      price: pkg.price,
      inclusions: pkg.inclusions.join(", "),
      exclusions: pkg.exclusions.join(", "),
      highlights: pkg.highlights.join(", "),
      image: pkg.image,
      gallery: pkg.gallery || [],
      status: pkg.status,
      featured: pkg.featured,
      seoTitle: pkg.seoTitle,
      seoDescription: pkg.seoDescription,
      seoKeywords: pkg.seoKeywords,
    });
    setItineraryDays(pkg.itinerary || [{ day: "1", title: "", description: "" }]);
    setSelectedFiles({
      mainImage: null,
      galleryImages: [],
    });
    setIsAddModalOpen(true);
  };

  const handleSave = async () => {
    setIsFormSubmitted(true);
    setIsSaving(true);

    // Validate required fields
    if (
      !formData.title ||
      !formData.destination ||
      !formData.shortDescription ||
      isQuillContentEmpty(formData.fullDescription) ||
      !formData.duration ||
      !formData.price ||
      !formData.inclusions ||
      !formData.highlights ||
      !formData.image ||
      !formData.seoTitle ||
      !formData.seoDescription ||
      !formData.seoKeywords ||
      itineraryDays.some((day) => !day.title || !day.description)
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
      const packageData = {
        ...formData,
        inclusions: formData.inclusions
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
        exclusions: formData.exclusions
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
        highlights: formData.highlights
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
        itinerary: itineraryDays
          .filter((day) => day.title.trim() && day.description.trim())
          .map((day) => ({
            day: day.day,
            title: day.title.trim(),
            description: day.description.trim(),
          })),
      };

      // Simulate success
      toast({
        title: editingId ? "Package Updated" : "Package Added",
        description: `Package has been successfully ${
          editingId ? "updated" : "added"
        }.`,
      });
      
      handleCancel();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save package",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const [deletingPackageId, setDeletingPackageId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeletingPackageId(id);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setDeletingButtonId(id);
    
    try {
      // Simulate API call
      toast({
        title: "Package Deleted",
        description: "Package has been successfully deleted.",
      });
      setDeletingPackageId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete package",
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
      destination: "",
      shortDescription: "",
      fullDescription: "",
      duration: "",
      price: "",
      inclusions: "",
      exclusions: "",
      highlights: "",
      image: "",
      gallery: [],
      status: "active",
      featured: false,
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    });
    setItineraryDays([{ day: "1", title: "", description: "" }]);
    setSelectedFiles({
      mainImage: null,
      galleryImages: [],
    });
    
    requestAnimationFrame(() => {
      window.scrollTo({ 
        top: savedScrollPosition, 
        behavior: "instant" 
      });
    });
  };

  const addItineraryDay = () => {
    const nextDay = (itineraryDays.length + 1).toString();
    setItineraryDays([...itineraryDays, { day: nextDay, title: "", description: "" }]);
  };

  const removeItineraryDay = (index: number) => {
    if (itineraryDays.length > 1) {
      setItineraryDays(itineraryDays.filter((_, i) => i !== index));
    }
  };

  const updateItineraryDay = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const updatedDays = [...itineraryDays];
    updatedDays[index][field] = value;
    setItineraryDays(updatedDays);
  };

  const [selectedFiles, setSelectedFiles] = useState<{
    mainImage: File | null;
    galleryImages: File[];
  }>({
    mainImage: null,
    galleryImages: [],
  });

  const handleImageUpload = (type: "main" | "gallery") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = type === "gallery";
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        if (type === "main") {
          setSelectedFiles((prev) => ({ ...prev, mainImage: files[0] }));
          const previewUrl = URL.createObjectURL(files[0]);
          setFormData((prev) => ({ ...prev, image: previewUrl }));
        } else {
          setSelectedFiles((prev) => ({
            ...prev,
            galleryImages: [...prev.galleryImages, ...files],
          }));
          const previewUrls = files.map((file) => URL.createObjectURL(file));
          setFormData((prev) => ({
            ...prev,
            gallery: [...prev.gallery, ...previewUrls],
          }));
        }

        toast({
          title: "Images Selected",
          description: `${files.length} image(s) selected. Click Save to upload.`,
        });
      }
    };
    input.click();
  };

  const removeGalleryImage = (index: number) => {
    const removedUrl = formData.gallery[index];

    if (removedUrl && removedUrl.startsWith("blob:")) {
      const blobIndex = formData.gallery
        .filter((url) => url.startsWith("blob:"))
        .indexOf(removedUrl);
      if (blobIndex !== -1) {
        setSelectedFiles((prev) => ({
          ...prev,
          galleryImages: prev.galleryImages.filter((_, i) => i !== blobIndex),
        }));
      }
    }

    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
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
            Packages Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your tour packages with detailed itineraries and pricing
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
                  destination: "",
                  shortDescription: "",
                  fullDescription: "",
                  duration: "",
                  price: "",
                  inclusions: "",
                  exclusions: "",
                  highlights: "",
                  image: "",
                  gallery: [],
                  status: "active",
                  featured: false,
                  seoTitle: "",
                  seoDescription: "",
                  seoKeywords: "",
                });
                setItineraryDays([{ day: "1", title: "", description: "" }]);
                setSelectedFiles({
                  mainImage: null,
                  galleryImages: [],
                });
                setIsAddModalOpen(true);
              }}
              className="bg-admin-gradient text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Package
            </Button>
          </DialogTrigger>    
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle className="text-2xl bg-admin-gradient bg-clip-text text-transparent">
                {editingId ? "Edit Package" : "Add New Package"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-8 p-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title" className="text-base font-semibold">
                      Package Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., Ooty Hill Station Tour"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.title
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.title && (
                      <p className="text-sm text-red-500 mt-1">
                        Package title is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="destination" className="text-base font-semibold">
                      Destination <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="destination"
                      value={formData.destination}
                      onChange={(e) =>
                        setFormData({ ...formData, destination: e.target.value })
                      }
                      placeholder="e.g., Ooty, Tamil Nadu"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.destination
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.destination && (
                      <p className="text-sm text-red-500 mt-1">
                        Destination is required
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="duration" className="text-base font-semibold">
                      Duration <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      placeholder="e.g., 3 Days 2 Nights"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.duration
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.duration && (
                      <p className="text-sm text-red-500 mt-1">
                        Duration is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-base font-semibold">
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="e.g., ₹8,500 per person"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.price
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.price && (
                      <p className="text-sm text-red-500 mt-1">
                        Price is required
                      </p>
                    )}
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <Label htmlFor="shortDescription" className="text-base font-semibold">
                    Short Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shortDescription: e.target.value,
                      })
                    }
                    placeholder="Brief description for package cards and listings"
                    rows={3}
                    className={`mt-2 ${
                      isFormSubmitted && !formData.shortDescription
                        ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {isFormSubmitted && !formData.shortDescription && (
                    <p className="text-sm text-red-500 mt-1">
                      Short description is required
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="fullDescription" className="text-base font-semibold">
                    Full Description <span className="text-red-500">*</span>
                  </Label>
                  <div className={`mt-2 ${isFormSubmitted && isQuillContentEmpty(formData.fullDescription) ? "quill-error" : ""}`}>
                    <RichTextEditor
                      value={formData.fullDescription}
                      onChange={(content: string) => setFormData({
                        ...formData,
                        fullDescription: content,
                      })}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Detailed description for package detail page. Use the toolbar to add bullet points and numbered lists."
                    />
                  </div>
                  {isFormSubmitted && isQuillContentEmpty(formData.fullDescription) && (
                    <p className="text-sm text-red-500 mt-1">
                      Full description is required
                    </p>
                  )}
                </div>
              </div>

              {/* Package Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Package Details
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="inclusions" className="text-base font-semibold">
                      Inclusions (comma-separated) <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="inclusions"
                      value={formData.inclusions}
                      onChange={(e) =>
                        setFormData({ ...formData, inclusions: e.target.value })
                      }
                      placeholder="e.g., Accommodation, Breakfast, Transportation, Sightseeing"
                      rows={3}
                      className={`mt-2 ${
                        isFormSubmitted && !formData.inclusions
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.inclusions && (
                      <p className="text-sm text-red-500 mt-1">
                        Inclusions are required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="exclusions" className="text-base font-semibold">
                      Exclusions (comma-separated)
                    </Label>
                    <Textarea
                      id="exclusions"
                      value={formData.exclusions}
                      onChange={(e) =>
                        setFormData({ ...formData, exclusions: e.target.value })
                      }
                      placeholder="e.g., Lunch & Dinner, Personal Expenses, Entry Fees"
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="highlights" className="text-base font-semibold">
                    Package Highlights (comma-separated) <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="highlights"
                    value={formData.highlights}
                    onChange={(e) =>
                      setFormData({ ...formData, highlights: e.target.value })
                    }
                    placeholder="e.g., Botanical Gardens, Ooty Lake, Toy Train Ride, Tea Factory Visit"
                    rows={3}
                    className={`mt-2 ${
                      isFormSubmitted && !formData.highlights
                        ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {isFormSubmitted && !formData.highlights && (
                    <p className="text-sm text-red-500 mt-1">
                      Highlights are required
                    </p>
                  )}
                </div>
              </div>

              {/* Itinerary */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                    Itinerary
                  </h3>
                  <Button
                    type="button"
                    onClick={addItineraryDay}
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Day
                  </Button>
                </div>
                {itineraryDays.map((day, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-900">Day {day.day}</h4>
                      {itineraryDays.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeItineraryDay(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">
                          Day Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={day.title}
                          onChange={(e) =>
                            updateItineraryDay(index, "title", e.target.value)
                          }
                          placeholder="e.g., Arrival & Local Sightseeing"
                          className={`mt-1 ${
                            isFormSubmitted && !day.title
                              ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                              : ""
                          }`}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          value={day.description}
                          onChange={(e) =>
                            updateItineraryDay(index, "description", e.target.value)
                          }
                          placeholder="Detailed description of activities for this day"
                          rows={2}
                          className={`mt-1 ${
                            isFormSubmitted && !day.description
                              ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                              : ""
                          }`}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Images */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Images
                </h3>
                
                {/* Main Image */}
                <div>
                  <Label className="text-base font-semibold">
                    Main Image <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-2 space-y-4">
                    <Button
                      type="button"
                      onClick={() => handleImageUpload("main")}
                      variant="outline"
                      className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-blue-400"
                    >
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Click to upload main image
                        </p>
                      </div>
                    </Button>
                    {formData.image && (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Main package image"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  {isFormSubmitted && !formData.image && (
                    <p className="text-sm text-red-500 mt-1">
                      Main image is required
                    </p>
                  )}
                </div>

                {/* Gallery Images */}
                <div>
                  <Label className="text-base font-semibold">
                    Gallery Images (Optional)
                  </Label>
                  <div className="mt-2 space-y-4">
                    <Button
                      type="button"
                      onClick={() => handleImageUpload("gallery")}
                      variant="outline"
                      className="w-full h-24 border-2 border-dashed border-gray-300 hover:border-blue-400"
                    >
                      <div className="text-center">
                        <ImageIcon className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Add gallery images
                        </p>
                      </div>
                    </Button>
                    {formData.gallery.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {formData.gallery.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Gallery image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Settings
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
                  <div className="flex items-center space-x-2 mt-8">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      disabled={!formData.featured && maxFeaturedReached}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="featured" className="text-base font-semibold">
                      Featured Package
                    </Label>
                    {!formData.featured && maxFeaturedReached && (
                      <p className="text-xs text-gray-500">
                        (Max 3 featured packages)
                      </p>
                    )}
                  </div>
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
                      {editingId ? "Update Package" : "Save Package"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg._id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative">
              <img
                src={pkg.image || "/images/placeholder-package.jpg"}
                alt={pkg.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge
                  variant={pkg.status === "active" ? "default" : "secondary"}
                  className={
                    pkg.status === "active"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }
                >
                  {pkg.status}
                </Badge>
              </div>
              {pkg.featured && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Featured
                  </Badge>
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pkg.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{pkg.destination}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="font-semibold text-blue-600">
                      {pkg.price}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {pkg.shortDescription}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {pkg.highlights.slice(0, 3).map((highlight, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                  {pkg.highlights.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{pkg.highlights.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(pkg)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(pkg._id!)}
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingPackageId}
        onOpenChange={() => setDeletingPackageId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              package and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingPackageId && handleDelete(deletingPackageId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting && deletingButtonId === deletingPackageId ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Package"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}