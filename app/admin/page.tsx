"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, Settings, Plus, MapPin, Globe, Mail, Loader2, Package } from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function AdminDashboard() {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  
  interface Lead {
    _id: string;
    fullName: string;
    email: string;
    service: string;
    status: string;
    priority: string;
    submittedAt: string;
  }

  interface DashboardData {
    totalLeads: number;
    totalEnquiries: number;
    activePackages: number;
    recentLeads: Lead[];
  }

  // Static data for now - will be replaced with API calls later
  const dashboardData: DashboardData = {
    totalLeads: 24,
    totalEnquiries: 18,
    activePackages: 12,
    recentLeads: [
      {
        _id: "1",
        fullName: "Rajesh Kumar",
        email: "rajesh@email.com",
        service: "Chennai to Bangalore One-way",
        status: "new",
        priority: "high",
        submittedAt: "2024-01-15T10:30:00Z"
      },
      {
        _id: "2", 
        fullName: "Priya Sharma",
        email: "priya@email.com",
        service: "Airport Taxi - Chennai",
        status: "contacted",
        priority: "medium",
        submittedAt: "2024-01-14T15:45:00Z"
      },
      {
        _id: "3",
        fullName: "Arun Vijay",
        email: "arun@email.com", 
        service: "Ooty Tour Package",
        status: "new",
        priority: "high",
        submittedAt: "2024-01-13T09:20:00Z"
      }
    ]
  };

  const stats = [
    {
      title: "Active Leads",
      value: dashboardData.totalLeads.toString(),
      change: "New",
      trend: "up",
      icon: <Users className="h-6 w-6" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "No. of Enquiries",
      value: dashboardData.totalEnquiries.toString(),
      change: "Total",
      trend: "up",
      icon: <Mail className="h-6 w-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Packages",
      value: dashboardData.activePackages.toString(),
      change: "Active",
      trend: "up",
      icon: <Package className="h-6 w-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  // Format date helper function
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
    

  const quickActions = [
    {
      title: "Add New Package",
      href: "/admin/packages",
      icon: <Package className="h-4 w-4" />,
      description: "Create new tour packages",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Manage Tariff",
      href: "/admin/tariff",
      icon: <Settings className="h-4 w-4" />,
      description: "Update service pricing",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "View Leads",
      href: "/admin/leads",
      icon: <Users className="h-4 w-4" />,
      description: "Manage customer inquiries",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Banner Manager",
      href: "/admin/banners",
      icon: <Globe className="h-4 w-4" />,
      description: "Manage homepage banners",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Contact Manager",
      href: "/admin/contact",
      icon: <MapPin className="h-4 w-4" />,
      description: "Update contact details",
      color: "from-pink-500 to-pink-600",
    },
    {
      title: "Profile Settings",
      href: "/admin/profile",
      icon: <Settings className="h-4 w-4" />,
      description: "Company profile settings",
      color: "from-teal-500 to-teal-600",
    },
  ]

  const handleActionClick = (title: string) => {
    setLoadingAction(title)
    // Simulate loading time
    setTimeout(() => {
      setLoadingAction(null)
    }, 800)
  }

  return (
    <div className=" -m-6 min-h-[calc(100vh-4rem)] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <motion.div
          className="bg-admin-gradient rounded-2xl p-8 text-white shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome to Vinushree Tours & Travels!</h1>
              <p className="text-blue-100 text-lg">Manage your travel services, packages, and customer inquiries.</p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                    <Badge
                      variant="default"
                      className="flex items-center gap-1 bg-green-100 text-green-800 border-green-200"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                    <p className="text-xs text-gray-500">vs last month</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Leads */}
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm h-full">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-admin-primary">
                    <Users className="h-5 w-5" />
                    Recent Leads
                  </CardTitle>
                  <Link href="/admin/leads">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-200 text-admin-primary hover:bg-blue-50 bg-transparent"
                      onClick={() => handleActionClick("View All Leads")}
                      disabled={loadingAction === "View All Leads"}
                    >
                      {loadingAction === "View All Leads" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {dashboardData.recentLeads.map((lead) => (
                    <div
                      key={lead._id}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-12 h-12 bg-admin-gradient rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {lead.fullName
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{lead.fullName}</p>
                        <p className="text-sm text-gray-600">{lead.service}</p>
                        <p className="text-xs text-gray-500">{lead.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={lead.status === "new" ? "default" : "secondary"}
                          className={lead.status === "new" ? "bg-blue-100 text-blue-800" : ""}
                        >
                          {lead.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(lead.submittedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 text-admin-primary">
                  <Plus className="h-5 w-5" />
                  Quick Actions
                </CardTitle> 
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link href={action.href}>
                        <Button
                          variant="outline"
                          className="h-24 w-full flex flex-col items-center justify-center space-y-2 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white relative overflow-hidden group"
                          onClick={() => handleActionClick(action.title)}
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                          />
                          <div className="relative z-10 flex flex-col items-center space-y-2">
                          
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white`}>
                                {action.icon}
                              </div>
                            
                            <div className="text-center">
                              <span className="text-xs font-medium text-gray-900 block">{action.title}</span>
                              <span className="text-xs text-gray-500 block mt-1">{action.description}</span>
                            </div>
                          </div>
                        </Button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

     
      </div>
    </div>
  )
}
