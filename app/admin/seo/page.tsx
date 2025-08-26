"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Save, Search, Edit } from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function SEOManagerPage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  // Sample SEO data for Vinushree Tours & Travels
  const [seoPages, setSeoPages] = useState([
    {
      id: "1",
      pageName: "Home Page",
      title: "Vinushree Tours & Travels - Best Taxi Services in Tamil Nadu",
      description: "Book reliable taxi services, tour packages, and travel solutions across Tamil Nadu. One-way trips, round trips, airport taxi, and tour packages available 24/7.",
      keywords: "taxi service tamil nadu, tour packages, airport taxi, vinushree tours, chennai taxi, bangalore taxi, travel services",
      lastUpdated: "2024-01-15"
    },
    {
      id: "2", 
      pageName: "About Page",
      title: "About Vinushree Tours & Travels - Your Trusted Travel Partner",
      description: "Learn about Vinushree Tours & Travels, your trusted travel partner in Tamil Nadu. We provide reliable taxi services, tour packages, and travel solutions since 2010.",
      keywords: "about vinushree tours, travel company tamil nadu, trusted taxi service, travel partner, company history",
      lastUpdated: "2024-01-14"
    },
    {
      id: "3",
      pageName: "Tariff Page", 
      title: "Taxi Tariff & Pricing - Vinushree Tours & Travels",
      description: "Check our competitive taxi tariff and pricing for one-way trips, round trips, airport taxi, and hourly packages. Transparent pricing with no hidden charges.",
      keywords: "taxi tariff, taxi pricing, one way taxi rates, round trip rates, airport taxi charges, hourly package rates",
      lastUpdated: "2024-01-13"
    },
    {
      id: "4",
      pageName: "Packages Page",
      title: "Tour Packages Tamil Nadu - Ooty, Kodaikanal, Chennai Tours",
      description: "Explore our exciting tour packages for Ooty, Kodaikanal, Chennai, and other Tamil Nadu destinations. Complete packages with accommodation and sightseeing.",
      keywords: "tour packages tamil nadu, ooty tour package, kodaikanal tour, chennai tour, hill station packages, south india tours",
      lastUpdated: "2024-01-12"
    },
    {
      id: "5",
      pageName: "Contact Page",
      title: "Contact Vinushree Tours & Travels - Book Your Taxi Now",
      description: "Contact Vinushree Tours & Travels for taxi booking, tour packages, and travel inquiries. Available 24/7 for all your travel needs across Tamil Nadu.",
      keywords: "contact vinushree tours, taxi booking, travel inquiry, phone number, whatsapp booking, 24/7 service",
      lastUpdated: "2024-01-11"
    }
  ]);

  const [formData, setFormData] = useState({
    pageName: "",
    title: "",
    description: "",
    keywords: "",
  })

  // Initialize with sample data
  useEffect(() => {
    setLoading(false);
  }, [])

  const handleEdit = (page: any) => {
    setEditingId(page.id)
    setFormData({
      pageName: page.pageName,
      title: page.title,
      description: page.description,
      keywords: page.keywords,
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!formData.pageName || !formData.title || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    if (editingId) {
      // Update the SEO page in state
      setSeoPages(seoPages.map(page => 
        page.id === editingId 
          ? { ...page, ...formData, lastUpdated: new Date().toISOString().split('T')[0] }
          : page
      ));
      
      toast({
        title: "Success",
        description: "SEO page updated successfully",
      })
      
      handleCancel()
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingId(null)
    setFormData({
      pageName: "",
      title: "",
      description: "",
      keywords: "",
    })
  }





  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-4xl font-bold bg-admin-gradient bg-clip-text text-transparent">
            SEO Manager
          </h1>
          <p className="text-gray-600 mt-2">Optimize SEO for Vinushree Tours & Travels website pages - manage meta titles, descriptions, and keywords</p>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl  text-admin-primary">
                {editingId ? "Edit Page SEO" : "Add New Page SEO"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="pageName" className="text-base font-semibold">
                    Page Name *
                  </Label>
                  <Input
                    id="pageName"
                    value={formData.pageName}
                    onChange={(e) => setFormData({ ...formData, pageName: e.target.value })}
                    placeholder="e.g., Home Page"
                    className="mt-2"
                    disabled
                  />
                </div>
               
              </div>

              <div>
                <Label htmlFor="title" className="text-base font-semibold">
                  Meta Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="SEO optimized page title"
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">Length: {formData.title.length}/60 characters</p>
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-semibold">
                  Meta Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description for search engines"
                  rows={3}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">Length: {formData.description.length}/160 characters</p>
              </div>

              <div>
                <Label htmlFor="keywords" className="text-base font-semibold">
                  Keywords
                </Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                  className="mt-2"
                />
              </div>

             

              <div className="flex gap-4">
                <Button onClick={handleSave} className="bg-admin-gradient text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save SEO Settings
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>




      {/* SEO Pages List */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2 bg-admin-gradient bg-clip-text text-transparent">
              <Search className="h-5 w-5 text-admin-primary" />
              Page SEO Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {seoPages.map((page) => (
                <div key={page.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{page.pageName}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(page)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Title: </span>
                      <span className="text-sm text-gray-600">{page.title}</span>
                      <span className={`text-xs ml-2 ${page.title.length > 60 ? "text-red-500" : "text-green-500"}`}>
                        ({page.title.length}/60)
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Description: </span>
                      <span className="text-sm text-gray-600">{page.description}</span>
                      <span
                        className={`text-xs ml-2 ${page.description.length > 160 ? "text-red-500" : "text-green-500"}`}
                      >
                        ({page.description.length}/160)
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Keywords: </span>
                      <span className="text-sm text-gray-600">{page.keywords}</span>
                    </div>
                    <div className="text-xs text-gray-500">Last updated: {page.lastUpdated}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
