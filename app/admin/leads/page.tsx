"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Download,
  Car,
  Package
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

interface TravelLead {
  _id?: string;
  id: number;
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  travelDate: string;
  pickupLocation: string;
  dropLocation: string;
  passengers: number;
  message: string;
  status: "new" | "contacted" | "confirmed" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  source: "website" | "whatsapp" | "phone" | "referral";
  submittedAt: string;
  lastUpdated: string;
  estimatedCost?: string;
  notes?: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function LeadManager() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<TravelLead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<TravelLead | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const scrollPositionRef = useRef<number>(0);

  // Travel services for Vinushree Tours & Travels
  const travelServices = [
    "One-way Trip",
    "Round Trip", 
    "Airport Taxi",
    "Day Rental",
    "Hourly Package",
    "Local Pickup/Drop",
    "Tour Package - Ooty",
    "Tour Package - Kodaikanal",
    "Tour Package - Chennai",
    "Tour Package - Bangalore",
    "Corporate Travel",
    "Wedding Transportation"
  ];

  // Sample travel leads for Vinushree Tours & Travels
  const [leads, setLeads] = useState<TravelLead[]>([
    {
      id: 1,
      _id: "1",
      fullName: "Rajesh Kumar",
      email: "rajesh@email.com",
      phone: "+91 98765 43210",
      serviceType: "Airport Taxi",
      travelDate: "2024-02-15",
      pickupLocation: "Chennai Airport",
      dropLocation: "Anna Nagar, Chennai",
      passengers: 2,
      message: "Need airport pickup for early morning flight. Please confirm availability.",
      status: "new",
      priority: "high",
      source: "website",
      submittedAt: "2024-01-15T10:30:00Z",
      lastUpdated: "2024-01-15T10:30:00Z",
      estimatedCost: "₹800",
      notes: ""
    },
    {
      id: 2,
      _id: "2", 
      fullName: "Priya Sharma",
      email: "priya@email.com",
      phone: "+91 87654 32109",
      serviceType: "Tour Package - Ooty",
      travelDate: "2024-02-20",
      pickupLocation: "Bangalore",
      dropLocation: "Ooty",
      passengers: 4,
      message: "Family trip to Ooty for 3 days. Need complete package with accommodation.",
      status: "contacted",
      priority: "medium",
      source: "whatsapp",
      submittedAt: "2024-01-14T15:45:00Z",
      lastUpdated: "2024-01-14T16:30:00Z",
      estimatedCost: "₹25,000",
      notes: "Interested in premium package. Follow up on 16th Jan."
    },
    {
      id: 3,
      _id: "3",
      fullName: "Arun Vijay",
      email: "arun@email.com",
      phone: "+91 76543 21098",
      serviceType: "One-way Trip",
      travelDate: "2024-02-18",
      pickupLocation: "Chennai",
      dropLocation: "Bangalore",
      passengers: 1,
      message: "Business trip to Bangalore. Prefer sedan car with professional driver.",
      status: "confirmed",
      priority: "medium",
      source: "phone",
      submittedAt: "2024-01-13T09:20:00Z",
      lastUpdated: "2024-01-13T14:15:00Z",
      estimatedCost: "₹4,200",
      notes: "Confirmed booking. Payment pending."
    },
    {
      id: 4,
      _id: "4",
      fullName: "Meera Nair",
      email: "meera@email.com", 
      phone: "+91 65432 10987",
      serviceType: "Day Rental",
      travelDate: "2024-02-16",
      pickupLocation: "Coimbatore",
      dropLocation: "Local sightseeing",
      passengers: 3,
      message: "Need car for full day local sightseeing in Coimbatore. 8 hours package.",
      status: "completed",
      priority: "low",
      source: "referral",
      submittedAt: "2024-01-12T11:00:00Z",
      lastUpdated: "2024-01-16T18:00:00Z",
      estimatedCost: "₹2,400",
      notes: "Trip completed successfully. Customer satisfied."
    }
  ]);

  const [newLead, setNewLead] = useState<{
    fullName: string;
    email: string;
    phone: string;
    serviceType: string;
    travelDate: string;
    pickupLocation: string;
    dropLocation: string;
    passengers: number;
    message: string;
    status: "new" | "contacted" | "confirmed" | "completed" | "cancelled";
    priority: "low" | "medium" | "high";
    source: "website" | "whatsapp" | "phone" | "referral";
    estimatedCost: string;
    notes: string;
  }>({
    fullName: "",
    email: "",
    phone: "",
    serviceType: "",
    travelDate: "",
    pickupLocation: "",
    dropLocation: "",
    passengers: 1,
    message: "",
    status: "new",
    priority: "medium",
    source: "website",
    estimatedCost: "",
    notes: "",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "contacted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "website":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "whatsapp":
        return "bg-green-100 text-green-800 border-green-200";
      case "phone":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "referral":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4" />;
      case "contacted":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.dropLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || lead.priority === priorityFilter;
    const matchesService =
      serviceFilter === "all" || lead.serviceType === serviceFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesService;
  });

  const handleEditLead = (lead: TravelLead) => {
    scrollPositionRef.current = window.scrollY;
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const handleViewLead = (lead: TravelLead) => {
    scrollPositionRef.current = window.scrollY;
    setSelectedLead(lead);
    setIsViewModalOpen(true);
  };

  const handleDeleteLead = (lead: TravelLead) => {
    setLeadToDelete(lead);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteLead = async () => {
    if (!leadToDelete) return;

    try {
      setIsLoading(true);
      
      // Remove from local state
      setLeads(leads.filter((lead) => lead.id !== leadToDelete.id));

      toast({
        title: "Lead Deleted",
        description: `${leadToDelete.fullName}'s lead has been successfully deleted.`,
      });

      setIsDeleteModalOpen(false);
      setLeadToDelete(null);
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast({
        title: "Error",
        description: "Failed to delete lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLead = async (updatedLead: TravelLead) => {
    try {
      setIsSaving(true);

      // Update local state
      setLeads(
        leads.map((lead) =>
          lead.id === updatedLead.id
            ? { ...updatedLead, lastUpdated: new Date().toISOString() }
            : lead
        )
      );

      setIsEditModalOpen(false);
      setSelectedLead(null);

      toast({
        title: "Lead Updated",
        description: `${updatedLead.fullName}'s information has been updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating lead:", error);
      toast({
        title: "Error",
        description: "Failed to update lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLead = async () => {
    setIsFormSubmitted(true);

    if (
      !newLead.fullName ||
      !newLead.email ||
      !newLead.phone ||
      !newLead.serviceType ||
      !newLead.travelDate ||
      !newLead.pickupLocation ||
      !newLead.message
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newLead.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Add new lead to state
      const leadData = {
        id: leads.length + 1,
        _id: Date.now().toString(),
        ...newLead,
        submittedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      
      setLeads([leadData, ...leads]);

      setNewLead({
        fullName: "",
        email: "",
        phone: "",
        serviceType: "",
        travelDate: "",
        pickupLocation: "",
        dropLocation: "",
        passengers: 1,
        message: "",
        status: "new",
        priority: "medium",
        source: "website",
        estimatedCost: "",
        notes: "",
      });
      setIsAddModalOpen(false);
      setIsFormSubmitted(false);

      toast({
        title: "Lead Added Successfully",
        description: `${newLead.fullName} has been added to your leads.`,
      });
    } catch (error) {
      console.error("Error adding lead:", error);
      toast({
        title: "Error",
        description: "Failed to add lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportLeads = () => {
    // Create CSV content
    const headers = [
      "Name", "Email", "Phone", "Service", "Travel Date", 
      "Pickup", "Drop", "Passengers", "Status", "Priority", 
      "Source", "Estimated Cost", "Submitted At"
    ];
    
    const csvContent = [
      headers.join(","),
      ...filteredLeads.map(lead => [
        lead.fullName,
        lead.email,
        lead.phone,
        lead.serviceType,
        lead.travelDate,
        lead.pickupLocation,
        lead.dropLocation,
        lead.passengers,
        lead.status,
        lead.priority,
        lead.source,
        lead.estimatedCost || "",
        new Date(lead.submittedAt).toLocaleDateString()
      ].join(","))
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vinushree-leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `${filteredLeads.length} leads exported to CSV file.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = [
    {
      title: "Total Leads",
      value: leads.length.toString(),
      icon: <Users className="h-6 w-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "New Leads",
      value: leads.filter((l) => l.status === "new").length.toString(),
      icon: <AlertCircle className="h-6 w-6" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Confirmed",
      value: leads.filter((l) => l.status === "confirmed").length.toString(),
      icon: <CheckCircle className="h-6 w-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "High Priority",
      value: leads.filter((l) => l.priority === "high").length.toString(),
      icon: <Star className="h-6 w-6" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-full mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl font-bold bg-admin-gradient bg-clip-text text-transparent">
              Lead Manager
            </h1>
            <p className="text-gray-600 mt-2">
              View all enquiries submitted via the website with WhatsApp integration and export options
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleExportLeads}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            
            <Dialog
              open={isAddModalOpen}
              onOpenChange={(open) => {
                setIsAddModalOpen(open);
                if (!open) {
                  setIsFormSubmitted(false);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-admin-gradient text-white shadow-lg hover:shadow-2xl transition-all duration-300">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Lead
                </Button>
              </DialogTrigger>       
       <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl bg-admin-gradient bg-clip-text text-transparent font-bold flex items-center gap-2">
                    <UserPlus className="h-6 w-6" />
                    Add New Travel Lead
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      Customer Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={newLead.fullName}
                      onChange={(e) =>
                        setNewLead({ ...newLead, fullName: e.target.value })
                      }
                      placeholder="Enter customer name"
                      className={
                        isFormSubmitted && !newLead.fullName
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }
                    />
                    {isFormSubmitted && !newLead.fullName && (
                      <p className="text-xs text-red-500 mt-1">
                        Name is required
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newLead.email}
                      onChange={(e) =>
                        setNewLead({ ...newLead, email: e.target.value })
                      }
                      placeholder="Enter email address"
                      className={
                        isFormSubmitted && !newLead.email
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }
                    />
                    {isFormSubmitted && !newLead.email && (
                      <p className="text-xs text-red-500 mt-1">
                        Email is required
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={newLead.phone}
                      onChange={(e) =>
                        setNewLead({ ...newLead, phone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                      className={
                        isFormSubmitted && !newLead.phone
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }
                    />
                    {isFormSubmitted && !newLead.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        Phone is required
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceType" className="text-sm font-medium">
                      Service Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newLead.serviceType}
                      onValueChange={(value) =>
                        setNewLead({ ...newLead, serviceType: value })
                      }
                    >
                      <SelectTrigger
                        className={
                          isFormSubmitted && !newLead.serviceType
                            ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {travelServices.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isFormSubmitted && !newLead.serviceType && (
                      <p className="text-xs text-red-500 mt-1">
                        Service type is required
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelDate" className="text-sm font-medium">
                      Travel Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="travelDate"
                      type="date"
                      value={newLead.travelDate}
                      onChange={(e) =>
                        setNewLead({ ...newLead, travelDate: e.target.value })
                      }
                      className={
                        isFormSubmitted && !newLead.travelDate
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }
                    />
                    {isFormSubmitted && !newLead.travelDate && (
                      <p className="text-xs text-red-500 mt-1">
                        Travel date is required
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passengers" className="text-sm font-medium">
                      Number of Passengers
                    </Label>
                    <Input
                      id="passengers"
                      type="number"
                      min="1"
                      max="20"
                      value={newLead.passengers}
                      onChange={(e) =>
                        setNewLead({ ...newLead, passengers: Number(e.target.value) })
                      }
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupLocation" className="text-sm font-medium">
                      Pickup Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pickupLocation"
                      value={newLead.pickupLocation}
                      onChange={(e) =>
                        setNewLead({ ...newLead, pickupLocation: e.target.value })
                      }
                      placeholder="Enter pickup location"
                      className={
                        isFormSubmitted && !newLead.pickupLocation
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }
                    />
                    {isFormSubmitted && !newLead.pickupLocation && (
                      <p className="text-xs text-red-500 mt-1">
                        Pickup location is required
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dropLocation" className="text-sm font-medium">
                      Drop Location
                    </Label>
                    <Input
                      id="dropLocation"
                      value={newLead.dropLocation}
                      onChange={(e) =>
                        setNewLead({ ...newLead, dropLocation: e.target.value })
                      }
                      placeholder="Enter drop location"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-medium">
                      Priority
                    </Label>
                    <Select
                      value={newLead.priority}
                      onValueChange={(value) =>
                        setNewLead({
                          ...newLead,
                          priority: value as "low" | "medium" | "high",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source" className="text-sm font-medium">
                      Lead Source
                    </Label>
                    <Select
                      value={newLead.source}
                      onValueChange={(value) =>
                        setNewLead({
                          ...newLead,
                          source: value as "website" | "whatsapp" | "phone" | "referral",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedCost" className="text-sm font-medium">
                      Estimated Cost
                    </Label>
                    <Input
                      id="estimatedCost"
                      value={newLead.estimatedCost}
                      onChange={(e) =>
                        setNewLead({ ...newLead, estimatedCost: e.target.value })
                      }
                      placeholder="₹5,000"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">
                      Customer Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      value={newLead.message}
                      onChange={(e) =>
                        setNewLead({ ...newLead, message: e.target.value })
                      }
                      placeholder="Enter customer requirements and message"
                      rows={3}
                      className={
                        isFormSubmitted && !newLead.message
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }
                    />
                    {isFormSubmitted && !newLead.message && (
                      <p className="text-xs text-red-500 mt-1">
                        Message is required
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium">
                      Internal Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={newLead.notes}
                      onChange={(e) =>
                        setNewLead({ ...newLead, notes: e.target.value })
                      }
                      placeholder="Internal notes for follow-up"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddLead}
                    disabled={isSaving}
                    className="bg-admin-gradient text-white"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Lead
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="initial"
          animate="animate"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                    >
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">
                        {stat.title}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search leads by name, email, phone, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={serviceFilter} onValueChange={setServiceFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Service Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      {travelServices.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leads Table */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 bg-admin-gradient bg-clip-text text-transparent">
                <Users className="h-5 w-5 text-admin-primary" />
                Travel Leads ({filteredLeads.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Travel Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {lead.fullName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {lead.email}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {lead.serviceType.includes("Tour") ? (
                              <Package className="h-4 w-4 text-purple-600" />
                            ) : (
                              <Car className="h-4 w-4 text-blue-600" />
                            )}
                            <span className="font-medium">{lead.serviceType}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1 mb-1">
                              <Calendar className="h-3 w-3 text-gray-500" />
                              {new Date(lead.travelDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1 mb-1">
                              <MapPin className="h-3 w-3 text-green-600" />
                              {lead.pickupLocation}
                            </div>
                            {lead.dropLocation && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-red-600" />
                                {lead.dropLocation}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              {lead.passengers} passenger{lead.passengers > 1 ? 's' : ''}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(lead.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(lead.status)}
                              {lead.status}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(lead.priority)}>
                            {lead.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSourceColor(lead.source)}>
                            {lead.source === "whatsapp" && <WhatsAppIcon className="h-3 w-3 mr-1" />}
                            {lead.source}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-green-600">
                            {lead.estimatedCost || "TBD"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {formatDate(lead.submittedAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewLead(lead)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditLead(lead)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteLead(lead)}
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredLeads.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No leads found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || serviceFilter !== "all"
                      ? "Try adjusting your search criteria."
                      : "Add your first travel lead to get started."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Lead Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-admin-gradient bg-clip-text text-transparent font-bold flex items-center gap-2">
                <Edit className="h-6 w-6" />
                Edit Travel Lead
              </DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editFullName" className="text-sm font-medium">
                    Customer Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="editFullName"
                    value={selectedLead.fullName}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, fullName: e.target.value })
                    }
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmail" className="text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={selectedLead.email}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, email: e.target.value })
                    }
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPhone" className="text-sm font-medium">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="editPhone"
                    type="tel"
                    value={selectedLead.phone}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editServiceType" className="text-sm font-medium">
                    Service Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedLead.serviceType}
                    onValueChange={(value) =>
                      setSelectedLead({ ...selectedLead, serviceType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {travelServices.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editTravelDate" className="text-sm font-medium">
                    Travel Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="editTravelDate"
                    type="date"
                    value={selectedLead.travelDate}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, travelDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPassengers" className="text-sm font-medium">
                    Number of Passengers
                  </Label>
                  <Input
                    id="editPassengers"
                    type="number"
                    min="1"
                    max="20"
                    value={selectedLead.passengers}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, passengers: Number(e.target.value) })
                    }
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPickupLocation" className="text-sm font-medium">
                    Pickup Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="editPickupLocation"
                    value={selectedLead.pickupLocation}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, pickupLocation: e.target.value })
                    }
                    placeholder="Enter pickup location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDropLocation" className="text-sm font-medium">
                    Drop Location
                  </Label>
                  <Input
                    id="editDropLocation"
                    value={selectedLead.dropLocation}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, dropLocation: e.target.value })
                    }
                    placeholder="Enter drop location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStatus" className="text-sm font-medium">
                    Status
                  </Label>
                  <Select
                    value={selectedLead.status}
                    onValueChange={(value) =>
                      setSelectedLead({
                        ...selectedLead,
                        status: value as "new" | "contacted" | "confirmed" | "completed" | "cancelled",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPriority" className="text-sm font-medium">
                    Priority
                  </Label>
                  <Select
                    value={selectedLead.priority}
                    onValueChange={(value) =>
                      setSelectedLead({
                        ...selectedLead,
                        priority: value as "low" | "medium" | "high",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editSource" className="text-sm font-medium">
                    Lead Source
                  </Label>
                  <Select
                    value={selectedLead.source}
                    onValueChange={(value) =>
                      setSelectedLead({
                        ...selectedLead,
                        source: value as "website" | "whatsapp" | "phone" | "referral",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEstimatedCost" className="text-sm font-medium">
                    Estimated Cost
                  </Label>
                  <Input
                    id="editEstimatedCost"
                    value={selectedLead.estimatedCost || ""}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, estimatedCost: e.target.value })
                    }
                    placeholder="₹5,000"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="editMessage" className="text-sm font-medium">
                    Customer Message <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="editMessage"
                    value={selectedLead.message}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, message: e.target.value })
                    }
                    placeholder="Enter customer requirements and message"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="editNotes" className="text-sm font-medium">
                    Internal Notes
                  </Label>
                  <Textarea
                    id="editNotes"
                    value={selectedLead.notes || ""}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, notes: e.target.value })
                    }
                    placeholder="Internal notes for follow-up"
                    rows={2}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedLead && handleUpdateLead(selectedLead)}
                disabled={isSaving}
                className="bg-admin-gradient text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update Lead
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Lead Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-admin-gradient bg-clip-text text-transparent">
                Lead Details
              </DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Customer Name</Label>
                    <p className="text-lg font-semibold">{selectedLead.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Service Type</Label>
                    <p className="text-lg font-semibold">{selectedLead.serviceType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <p>{selectedLead.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <p>{selectedLead.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Travel Date</Label>
                    <p>{new Date(selectedLead.travelDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Passengers</Label>
                    <p>{selectedLead.passengers}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Pickup Location</Label>
                    <p>{selectedLead.pickupLocation}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Drop Location</Label>
                    <p>{selectedLead.dropLocation || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <Badge className={getStatusColor(selectedLead.status)}>
                      {selectedLead.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Priority</Label>
                    <Badge className={getPriorityColor(selectedLead.priority)}>
                      {selectedLead.priority}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Source</Label>
                    <Badge className={getSourceColor(selectedLead.source)}>
                      {selectedLead.source}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Estimated Cost</Label>
                    <p className="font-semibold text-green-600">{selectedLead.estimatedCost || "TBD"}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Customer Message</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedLead.message}</p>
                </div>
                {selectedLead.notes && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Internal Notes</Label>
                    <p className="mt-1 p-3 bg-yellow-50 rounded-lg">{selectedLead.notes}</p>
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  <p>Submitted: {formatDate(selectedLead.submittedAt)}</p>
                  <p>Last Updated: {formatDate(selectedLead.lastUpdated)}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Lead</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this lead? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteLead}
                className="bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Lead"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}