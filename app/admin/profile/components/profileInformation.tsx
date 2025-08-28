"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Save, MapPin, Phone, Mail, Building, Camera, Upload } from 'lucide-react'

interface CompanyData { 
  companyName: string
  ownerName: string
  email: string
  phone: string
  whatsappNumber: string
  address: string
  city: string
  state: string
  pincode: string
  gstNumber: string
  logo: string | null
  description: string
}

export default function ProfileInformation() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  
  const [companyData, setCompanyData] = useState<CompanyData>({
    companyName: "Vinushree Tours & Travels",
    ownerName: "Admin User",
    email: "info@vinushree.com",
    phone: "+91 98765 43210",
    whatsappNumber: "+91 98765 43210",
    address: "123 Travel Street",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    gstNumber: "33AAAAA0000A1Z5",
    logo: null,
    description: "Your trusted travel partner for unforgettable journeys across Tamil Nadu and beyond.",
  })



  const handleProfileSave = () => {
    setIsSaving(true)
    
    // Simulate saving (in real app, this would save to localStorage or state management)
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Company information has been updated successfully",
      })
      setIsSaving(false)
    }, 1000)
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setCompanyData({ ...companyData, logo: e.target?.result as string })
      toast({
        title: "Success",
        description: "Company logo updated successfully",
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-8">
      {/* Company Logo Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={companyData.logo || "/placeholder.svg"} alt="Company logo" />
            <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-2xl font-bold">
              {companyData.companyName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <label htmlFor="logo-upload" className="absolute -bottom-2 -right-2">
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <Button
              size="sm"
              className="rounded-full w-8 h-8 p-0 bg-gradient-to-r from-amber-500 to-orange-600"
              type="button"
              asChild
            >
              <span>
                <Camera className="h-4 w-4" />
              </span>
            </Button>
          </label>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {companyData.companyName}
          </h3>
          <p className="text-gray-600">Travel & Tourism Company</p>
        </div>
      </div>

      {/* Company Information */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent flex items-center gap-2">
          <Building className="h-5 w-5" />
          Company Information
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="companyName" className="text-base font-semibold">
              Company Name *
            </Label>
            <Input
              id="companyName"
              value={companyData.companyName}
              onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="ownerName" className="text-base font-semibold">
              Owner/Manager Name *
            </Label>
            <Input
              id="ownerName"
              value={companyData.ownerName}
              onChange={(e) => setCompanyData({ ...companyData, ownerName: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={companyData.email}
              onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-base font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={companyData.phone}
              onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="whatsappNumber" className="text-base font-semibold">
              WhatsApp Number *
            </Label>
            <Input
              id="whatsappNumber"
              type="tel"
              value={companyData.whatsappNumber}
              onChange={(e) => setCompanyData({ ...companyData, whatsappNumber: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="gstNumber" className="text-base font-semibold">
              GST Number
            </Label>
            <Input
              id="gstNumber"
              value={companyData.gstNumber}
              onChange={(e) => setCompanyData({ ...companyData, gstNumber: e.target.value })}
              className="mt-2"
              placeholder="33AAAAA0000A1Z5"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Address Information
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label htmlFor="address" className="text-base font-semibold">
              Street Address *
            </Label>
            <Input
              id="address"
              value={companyData.address}
              onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="city" className="text-base font-semibold">
              City *
            </Label>
            <Input
              id="city"
              value={companyData.city}
              onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="state" className="text-base font-semibold">
              State *
            </Label>
            <Input
              id="state"
              value={companyData.state}
              onChange={(e) => setCompanyData({ ...companyData, state: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="pincode" className="text-base font-semibold">
              PIN Code *
            </Label>
            <Input
              id="pincode"
              value={companyData.pincode}
              onChange={(e) => setCompanyData({ ...companyData, pincode: e.target.value })}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Company Description */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
          Company Description
        </h4>
        <div>
          <Label htmlFor="description" className="text-base font-semibold">
            About Your Travel Company
          </Label>
          <Textarea
            id="description"
            value={companyData.description}
            onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
            className="mt-2"
            rows={4}
            placeholder="Describe your travel services, specialties, and what makes your company unique..."
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button 
          onClick={handleProfileSave} 
          className="bg-admin-gradient text-white border-0"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Company Information
            </>
          )}
        </Button>
      </div>
    </div>
  )
}