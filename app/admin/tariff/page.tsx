"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Car,
  Upload,
  Loader2,
  IndianRupee,
  Clock,
  MapPin
} from "lucide-react";

interface TariffService {
  _id?: string;
  vehicleType: string;
  vehicleName: string;
  description: string;
  oneWayRate: string;
  roundTripRate: string;
  driverAllowance: string;
  minimumKmOneWay: string;
  minimumKmRoundTrip: string;
  image: string;
  status: string;
  featured: boolean;
  additionalCharges: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalServices: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function TariffPage() {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [services, setServices] = useState<TariffService[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingButtonId, setDeletingButtonId] = useState<string | null>(null);
  const scrollPositionRef = useRef<number>(0);

  // Vehicle Type Management States
  const [vehicleTypes, setVehicleTypes] = useState<{ _id: string; name: string }[]>([
    { _id: "1", name: "Sedan" },
    { _id: "2", name: "SUV" },
    { _id: "3", name: "Premium" },
    { _id: "4", name: "Luxury" },
    { _id: "5", name: "Tempo" }
  ]);
  const [newVehicleTypeName, setNewVehicleTypeName] = useState("");
  const [showAddVehicleType, setShowAddVehicleType] = useState(false);
  const [editingVehicleType, setEditingVehicleType] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editVehicleTypeName, setEditVehicleTypeName] = useState("");
  const [deletingVehicleTypeId, setDeletingVehicleTypeId] = useState<string | null>(null);
  const [vehicleTypeDropdownOpen, setVehicleTypeDropdownOpen] = useState(false);
  const [explicitlyClosing, setExplicitlyClosing] = useState(false);

  // Static sample data for tariff services
  const sampleServices: TariffService[] = [
    {
      _id: "1",
      vehicleType: "Sedan",
      vehicleName: "Sedan (Dzire/Etios)",
      description: "Comfortable sedan cars perfect for small families and business trips. Air-conditioned with experienced drivers.",
      oneWayRate: "₹14 per km",
      roundTripRate: "₹13 per km",
      driverAllowance: "₹400",
      minimumKmOneWay: "130 km",
      minimumKmRoundTrip: "250 km",
      image: "/images/vehicles/dzire.jpg",
      status: "active",
      featured: true,
      additionalCharges: ["Toll fees extra", "Inter-State Permit charges extra", "Waiting charges ₹100 per hour"],
      seoTitle: "Sedan Taxi Service - Dzire & Etios | Vinushree Tours",
      seoDescription: "Book comfortable sedan taxis (Dzire/Etios) for outstation trips. Starting from ₹14 per km one way.",
      seoKeywords: "sedan taxi, dzire taxi, etios taxi, outstation taxi"
    },
    {
      _id: "2",
      vehicleType: "SUV",
      vehicleName: "SUV (Xylo/Ertiga)",
      description: "Spacious SUVs ideal for group travel and family trips. More luggage space and comfortable seating for 6-7 passengers.",
      oneWayRate: "₹19 per km",
      roundTripRate: "₹17 per km", 
      driverAllowance: "₹500",
      minimumKmOneWay: "130 km",
      minimumKmRoundTrip: "250 km",
      image: "/images/vehicles/ertiga.jpg",
      status: "active",
      featured: true,
      additionalCharges: ["Toll fees extra", "Inter-State Permit charges extra", "Hill station charges ₹300"],
      seoTitle: "SUV Taxi Service - Xylo & Ertiga | Vinushree Tours",
      seoDescription: "Book spacious SUV taxis (Xylo/Ertiga) for group travel. Starting from ₹19 per km one way.",
      seoKeywords: "suv taxi, ertiga taxi, xylo taxi, group travel"
    },
    {
      _id: "3",
      vehicleType: "Premium",
      vehicleName: "Assured Innova",
      description: "Premium Toyota Innova for luxury travel experience. Perfect for business trips and special occasions with maximum comfort.",
      oneWayRate: "₹20 per km",
      roundTripRate: "₹18 per km",
      driverAllowance: "₹500",
      minimumKmOneWay: "130 km", 
      minimumKmRoundTrip: "250 km",
      image: "/images/vehicles/innova.jpg",
      status: "active",
      featured: true,
      additionalCharges: ["Toll fees extra", "Inter-State Permit charges extra", "Premium service guarantee"],
      seoTitle: "Premium Innova Taxi Service | Vinushree Tours",
      seoDescription: "Book premium Toyota Innova for luxury outstation travel. Starting from ₹20 per km one way.",
      seoKeywords: "innova taxi, premium taxi, luxury taxi, toyota innova"
    }
  ];

  // Initialize with sample data
  useState(() => {
    setServices(sampleServices);
  });

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalServices: 3,
    limit: 6,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [formData, setFormData] = useState({
    vehicleType: "",
    vehicleName: "",
    description: "",
    oneWayRate: "",
    roundTripRate: "",
    driverAllowance: "",
    minimumKmOneWay: "",
    minimumKmRoundTrip: "",
    image: "",
    status: "active",
    featured: false,
    additionalCharges: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  // Check if maximum featured services limit reached (3 featured services max)
  const maxFeaturedReached =
    services.filter((service) => service.featured).length >= 3;

  const handleEdit = (service: TariffService) => {
    scrollPositionRef.current = window.scrollY;
    
    setEditingId(service._id || null);
    setFormData({
      vehicleType: service.vehicleType,
      vehicleName: service.vehicleName,
      description: service.description,
      oneWayRate: service.oneWayRate,
      roundTripRate: service.roundTripRate,
      driverAllowance: service.driverAllowance,
      minimumKmOneWay: service.minimumKmOneWay,
      minimumKmRoundTrip: service.minimumKmRoundTrip,
      image: service.image,
      status: service.status,
      featured: service.featured,
      additionalCharges: service.additionalCharges.join(", "),
      seoTitle: service.seoTitle,
      seoDescription: service.seoDescription,
      seoKeywords: service.seoKeywords,
    });
    setSelectedFiles({
      mainImage: null,
    });
    setIsAddModalOpen(true);
  };

  const handleSave = async () => {
    setIsFormSubmitted(true);
    setIsSaving(true);

    // Validate required fields
    if (
      !formData.vehicleType ||
      !formData.vehicleName ||
      !formData.description ||
      !formData.oneWayRate ||
      !formData.roundTripRate ||
      !formData.driverAllowance ||
      !formData.minimumKmOneWay ||
      !formData.minimumKmRoundTrip ||
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
      const serviceData = {
        ...formData,
        additionalCharges: formData.additionalCharges
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
      };

      // Simulate success
      toast({
        title: editingId ? "Service Updated" : "Service Added",
        description: `Tariff service has been successfully ${
          editingId ? "updated" : "added"
        }.`,
      });
      
      handleCancel();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save tariff service",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeletingServiceId(id);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setDeletingButtonId(id);
    
    try {
      // Simulate API call
      toast({
        title: "Service Deleted",
        description: "Tariff service has been successfully deleted.",
      });
      setDeletingServiceId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tariff service",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeletingButtonId(null);
    }
  };

  // Vehicle Type Management Functions
  const handleAddVehicleType = async () => {
    if (!newVehicleTypeName.trim()) {
      toast({
        title: "Error",
        description: "Vehicle type name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call - replace with actual API later
      const newVehicleType = {
        _id: Date.now().toString(),
        name: newVehicleTypeName.trim()
      };
      
      setVehicleTypes([...vehicleTypes, newVehicleType]);
      
      toast({
        title: "Vehicle Type Added",
        description: "New vehicle type has been successfully added.",
      });
      setNewVehicleTypeName("");
      setShowAddVehicleType(false);
      setExplicitlyClosing(true);
      setVehicleTypeDropdownOpen(false);
      // Auto-select the newly added vehicle type
      setFormData({ ...formData, vehicleType: newVehicleType.name });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add vehicle type",
        variant: "destructive",
      });
    }
  };

  const handleEditVehicleType = async () => {
    if (!editVehicleTypeName.trim() || !editingVehicleType) {
      toast({
        title: "Error",
        description: "Vehicle type name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call - replace with actual API later
      setVehicleTypes(vehicleTypes.map(type => 
        type._id === editingVehicleType.id 
          ? { ...type, name: editVehicleTypeName.trim() }
          : type
      ));
      
      toast({
        title: "Vehicle Type Updated",
        description: "Vehicle type has been successfully updated.",
      });
      setEditingVehicleType(null);
      setEditVehicleTypeName("");
      setExplicitlyClosing(true);
      setVehicleTypeDropdownOpen(false);
      // Update form data if the edited vehicle type was selected
      if (formData.vehicleType === editingVehicleType.name) {
        setFormData({ ...formData, vehicleType: editVehicleTypeName.trim() });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vehicle type",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVehicleType = async (vehicleTypeId: string) => {
    try {
      // Simulate API call - replace with actual API later
      const vehicleTypeToDelete = vehicleTypes.find(type => type._id === vehicleTypeId);
      setVehicleTypes(vehicleTypes.filter(type => type._id !== vehicleTypeId));
      
      toast({
        title: "Vehicle Type Deleted",
        description: "Vehicle type has been successfully deleted.",
      });
      setDeletingVehicleTypeId(null);
      
      // Clear form data if the deleted vehicle type was selected
      if (formData.vehicleType === vehicleTypeToDelete?.name) {
        setFormData({ ...formData, vehicleType: "" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vehicle type",
        variant: "destructive",
      });
    }
  };

  const handleCancelAddVehicleType = () => {
    setShowAddVehicleType(false);
    setNewVehicleTypeName("");
    setExplicitlyClosing(true);
    setVehicleTypeDropdownOpen(false);
  };

  const handleCancel = () => {
    const savedScrollPosition = scrollPositionRef.current;
    
    setIsAddModalOpen(false);
    setEditingId(null);
    setFormData({
      vehicleType: "",
      vehicleName: "",
      description: "",
      oneWayRate: "",
      roundTripRate: "",
      driverAllowance: "",
      minimumKmOneWay: "",
      minimumKmRoundTrip: "",
      image: "",
      status: "active",
      featured: false,
      additionalCharges: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    });
    setSelectedFiles({
      mainImage: null,
    });
    
    requestAnimationFrame(() => {
      window.scrollTo({ 
        top: savedScrollPosition, 
        behavior: "instant" 
      });
    });
  };

  const [selectedFiles, setSelectedFiles] = useState<{
    mainImage: File | null;
  }>({
    mainImage: null,
  });

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        setSelectedFiles((prev) => ({ ...prev, mainImage: files[0] }));
        const previewUrl = URL.createObjectURL(files[0]);
        setFormData((prev) => ({ ...prev, image: previewUrl }));

        toast({
          title: "Image Selected",
          description: "Vehicle image selected. Click Save to upload.",
        });
      }
    };
    input.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tariff services...</p>
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
            Tariff Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your vehicle tariff services with pricing and descriptions
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
                  vehicleType: "",
                  vehicleName: "",
                  description: "",
                  oneWayRate: "",
                  roundTripRate: "",
                  driverAllowance: "",
                  minimumKmOneWay: "",
                  minimumKmRoundTrip: "",
                  image: "",
                  status: "active",
                  featured: false,
                  additionalCharges: "",
                  seoTitle: "",
                  seoDescription: "",
                  seoKeywords: "",
                });
                setSelectedFiles({
                  mainImage: null,
                });
                setIsAddModalOpen(true);
              }}
              className="bg-admin-gradient text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Service
            </Button>
          </DialogTrigger>  
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle className="text-2xl bg-admin-gradient bg-clip-text text-transparent">
                {editingId ? "Edit Tariff Service" : "Add New Tariff Service"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-8 p-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Vehicle Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Label className="text-base font-semibold">
                      Vehicle Type <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-2 space-y-2">
                      <Select
                        value={formData.vehicleType}
                        onValueChange={(value) => {
                          if (value === "add_new_vehicle_type") {
                            // This case should not happen now since we're not using SelectItem for add new vehicle type
                            setEditingVehicleType(null);
                            setEditVehicleTypeName("");
                            setShowAddVehicleType(true);
                            setNewVehicleTypeName("");
                            setVehicleTypeDropdownOpen(true);
                          } else {
                            setFormData({ ...formData, vehicleType: value });
                            setVehicleTypeDropdownOpen(false);
                          }
                        }}
                        open={vehicleTypeDropdownOpen}
                        onOpenChange={(open) => {
                          if (
                            !open &&
                            (editingVehicleType || showAddVehicleType) &&
                            !explicitlyClosing
                          ) {
                            // Force it to stay open when we're in add/edit mode
                            setVehicleTypeDropdownOpen(true);
                            return;
                          }
                          setVehicleTypeDropdownOpen(open);
                          if (explicitlyClosing) {
                            setExplicitlyClosing(false);
                          }
                          // Reset states when dropdown closes naturally
                          if (!open && !explicitlyClosing) {
                            setShowAddVehicleType(false);
                            setEditingVehicleType(null);
                            setNewVehicleTypeName("");
                            setEditVehicleTypeName("");
                          }
                        }}
                      >
                        <SelectTrigger className={`w-full ${
                          isFormSubmitted && !formData.vehicleType
                            ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                            : ""
                        }`}>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent className="z-50" data-no-search="true">
                          {vehicleTypes.map((vehicleType) => (
                            <div
                              key={vehicleType._id}
                              className="flex items-center justify-between group"
                            >
                              <SelectItem
                                value={vehicleType.name}
                                className="flex-1"
                              >
                                {vehicleType.name}
                              </SelectItem>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-blue-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAddVehicleType(false);
                                    setNewVehicleTypeName("");
                                    setEditingVehicleType({
                                      id: vehicleType._id,
                                      name: vehicleType.name,
                                    });
                                    setEditVehicleTypeName(vehicleType.name);
                                    setVehicleTypeDropdownOpen(true);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-red-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletingVehicleTypeId(vehicleType._id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ))}

                          <div
                            className="cursor-pointer hover:bg-gray-100 px-2 py-1.5 text-sm flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setEditingVehicleType(null);
                              setEditVehicleTypeName("");
                              setShowAddVehicleType(true);
                              setNewVehicleTypeName("");
                              // Don't change vehicleTypeDropdownOpen here - let it stay open
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Vehicle Type
                          </div>

                          {showAddVehicleType && (
                            <div
                              className="p-4 border-t bg-gray-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <Label className="text-sm font-semibold">
                                  Add New Vehicle Type
                                </Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCancelAddVehicleType}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  value={newVehicleTypeName}
                                  onChange={(e) =>
                                    setNewVehicleTypeName(e.target.value)
                                  }
                                  placeholder="Enter vehicle type name"
                                  className="flex-1"
                                  autoFocus
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      handleAddVehicleType();
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    // Prevent the Select component from capturing these key events
                                    e.stopPropagation();
                                  }}
                                  onFocus={(e) => {
                                    // Prevent Select from treating this as search input
                                    e.stopPropagation();
                                  }}
                                />
                                <Button
                                  type="button"
                                  onClick={handleAddVehicleType}
                                  size="sm"
                                  className="bg-admin-gradient text-white"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          )}

                          {editingVehicleType && (
                            <div
                              className="p-4 border-t bg-gray-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <Label className="text-sm font-semibold">
                                  Edit Vehicle Type
                                </Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingVehicleType(null);
                                    setEditVehicleTypeName("");
                                    setExplicitlyClosing(true);
                                    setVehicleTypeDropdownOpen(false);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  value={editVehicleTypeName}
                                  onChange={(e) =>
                                    setEditVehicleTypeName(e.target.value)
                                  }
                                  placeholder="Enter vehicle type name"
                                  className="flex-1"
                                  autoFocus
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      handleEditVehicleType();
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    // Prevent the Select component from capturing these key events
                                    e.stopPropagation();
                                  }}
                                  onFocus={(e) => {
                                    // Prevent Select from treating this as search input
                                    e.stopPropagation();
                                  }}
                                />
                                <Button
                                  type="button"
                                  onClick={handleEditVehicleType}
                                  size="sm"
                                  className="bg-admin-gradient text-white"
                                >
                                  <Save className="h-4 w-4 mr-1" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      {isFormSubmitted && !formData.vehicleType && (
                        <p className="text-sm text-red-500 mt-1">
                          Vehicle type is required
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="vehicleName" className="text-base font-semibold">
                      Vehicle Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="vehicleName"
                      value={formData.vehicleName}
                      onChange={(e) =>
                        setFormData({ ...formData, vehicleName: e.target.value })
                      }
                      placeholder="e.g., Sedan (Dzire/Etios)"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.vehicleName
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.vehicleName && (
                      <p className="text-sm text-red-500 mt-1">
                        Vehicle name is required
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-base font-semibold">
                    Description <span className="text-red-500">*</span>
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
                    placeholder="Detailed description of the vehicle and its features"
                    rows={4}
                    className={`mt-2 ${
                      isFormSubmitted && !formData.description
                        ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {isFormSubmitted && !formData.description && (
                    <p className="text-sm text-red-500 mt-1">
                      Description is required
                    </p>
                  )}
                </div>
              </div>

              {/* Pricing Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Pricing Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="oneWayRate" className="text-base font-semibold">
                      One Way Rate <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="oneWayRate"
                      value={formData.oneWayRate}
                      onChange={(e) =>
                        setFormData({ ...formData, oneWayRate: e.target.value })
                      }
                      placeholder="e.g., ₹14 per km"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.oneWayRate
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.oneWayRate && (
                      <p className="text-sm text-red-500 mt-1">
                        One way rate is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="roundTripRate" className="text-base font-semibold">
                      Round Trip Rate <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="roundTripRate"
                      value={formData.roundTripRate}
                      onChange={(e) =>
                        setFormData({ ...formData, roundTripRate: e.target.value })
                      }
                      placeholder="e.g., ₹13 per km"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.roundTripRate
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.roundTripRate && (
                      <p className="text-sm text-red-500 mt-1">
                        Round trip rate is required
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="driverAllowance" className="text-base font-semibold">
                      Driver Allowance <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="driverAllowance"
                      value={formData.driverAllowance}
                      onChange={(e) =>
                        setFormData({ ...formData, driverAllowance: e.target.value })
                      }
                      placeholder="e.g., ₹400"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.driverAllowance
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.driverAllowance && (
                      <p className="text-sm text-red-500 mt-1">
                        Driver allowance is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="minimumKmOneWay" className="text-base font-semibold">
                      Min KM (One Way) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="minimumKmOneWay"
                      value={formData.minimumKmOneWay}
                      onChange={(e) =>
                        setFormData({ ...formData, minimumKmOneWay: e.target.value })
                      }
                      placeholder="e.g., 130 km"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.minimumKmOneWay
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.minimumKmOneWay && (
                      <p className="text-sm text-red-500 mt-1">
                        Minimum KM is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="minimumKmRoundTrip" className="text-base font-semibold">
                      Min KM (Round Trip) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="minimumKmRoundTrip"
                      value={formData.minimumKmRoundTrip}
                      onChange={(e) =>
                        setFormData({ ...formData, minimumKmRoundTrip: e.target.value })
                      }
                      placeholder="e.g., 250 km"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.minimumKmRoundTrip
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.minimumKmRoundTrip && (
                      <p className="text-sm text-red-500 mt-1">
                        Minimum KM is required
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="additionalCharges" className="text-base font-semibold">
                    Additional Charges (comma-separated)
                  </Label>
                  <Textarea
                    id="additionalCharges"
                    value={formData.additionalCharges}
                    onChange={(e) =>
                      setFormData({ ...formData, additionalCharges: e.target.value })
                    }
                    placeholder="e.g., Toll fees extra, Inter-State Permit charges extra, Waiting charges ₹100 per hour"
                    rows={3}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Vehicle Image */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Vehicle Image
                </h3>
                
                <div>
                  <Label className="text-base font-semibold">
                    Vehicle Image <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-2 space-y-4">
                    <Button
                      type="button"
                      onClick={handleImageUpload}
                      variant="outline"
                      className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-blue-400"
                    >
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Click to upload vehicle image
                        </p>
                      </div>
                    </Button>
                    {formData.image && (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Vehicle image"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  {isFormSubmitted && !formData.image && (
                    <p className="text-sm text-red-500 mt-1">
                      Vehicle image is required
                    </p>
                  )}
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
                      Featured Service
                    </Label>
                    {!formData.featured && maxFeaturedReached && (
                      <p className="text-xs text-gray-500">
                        (Max 3 featured services)
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
                      {editingId ? "Update Service" : "Save Service"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service._id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative">
              <img
                src={service.image || "/images/placeholder-vehicle.jpg"}
                alt={service.vehicleName}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge
                  variant={service.status === "active" ? "default" : "secondary"}
                  className={
                    service.status === "active"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }
                >
                  {service.status}
                </Badge>
              </div>
              {service.featured && (
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
                    {service.vehicleName}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Car className="h-4 w-4 mr-1" />
                    <span className="text-sm">{service.vehicleType}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                    {service.description}
                  </p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">One Way:</span>
                    <span className="font-semibold text-blue-600">{service.oneWayRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Round Trip:</span>
                    <span className="font-semibold text-green-600">{service.roundTripRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Driver Allowance:</span>
                    <span className="font-semibold">{service.driverAllowance}</span>
                  </div>
                </div>

                <div className="pt-2 border-t text-xs text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>Min KM (One Way):</span>
                    <span>{service.minimumKmOneWay}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Min KM (Round Trip):</span>
                    <span>{service.minimumKmRoundTrip}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(service._id!)}
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

      {/* Delete Service Confirmation Dialog */}
      <AlertDialog
        open={!!deletingServiceId}
        onOpenChange={() => setDeletingServiceId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              tariff service and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingServiceId && handleDelete(deletingServiceId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting && deletingButtonId === deletingServiceId ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Service"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Vehicle Type Confirmation Dialog */}
      <AlertDialog
        open={!!deletingVehicleTypeId}
        onOpenChange={() => setDeletingVehicleTypeId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this vehicle type? This action cannot be undone.
              All services using this vehicle type will need to be updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingVehicleTypeId && handleDeleteVehicleType(deletingVehicleTypeId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Vehicle Type
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}