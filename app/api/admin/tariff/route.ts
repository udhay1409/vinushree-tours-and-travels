import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/models/connectDB";
import Tariff from "@/config/utils/admin/tariff/tariffSchema";
import jwt from "jsonwebtoken";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

interface DecodedToken {
  adminId: string;
  email: string;
  role: string;
}

// GET - Fetch all tariff services with pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const vehicleType = searchParams.get("vehicleType");

    // Build query for active tariffs only (for public API)
    let query: any = { 
      status: "active", 
      isDeleted: false 
    };

    // For admin requests, check authorization
    const authHeader = request.headers.get("authorization");
    let isAdmin = false;
    
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        isAdmin = true;
        // Admin can see all tariffs
        query = { isDeleted: false };
      } catch (error) {
        // Not admin, continue with public query
      }
    }

    // Filter by vehicle type if provided
    if (vehicleType && vehicleType !== "all") {
      query.vehicleType = new RegExp(vehicleType, 'i');
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const total = await Tariff.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get tariffs with sorting (featured first, then newest)
    const tariffs = await Tariff.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-isDeleted -__v'); // Exclude internal fields

    // Pagination metadata
    const pagination = {
      currentPage: page,
      totalPages,
      totalTariffs: total,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return NextResponse.json({
      success: true,
      data: tariffs,
      pagination: isAdmin ? pagination : undefined
    });

  } catch (error) {
    console.error("Error fetching tariffs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tariffs" },
      { status: 500 }
    );
  }
}

// POST - Create new tariff service (Admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify admin authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authorization header required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    try {
      jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    // Extract form fields
    const vehicleType = formData.get("vehicleType") as string;
    const vehicleName = formData.get("vehicleName") as string;
    const description = formData.get("description") as string;
    const oneWayRate = formData.get("oneWayRate") as string;
    const roundTripRate = formData.get("roundTripRate") as string;
    const driverAllowance = formData.get("driverAllowance") as string;
    const minimumKmOneWay = formData.get("minimumKmOneWay") as string;
    const minimumKmRoundTrip = formData.get("minimumKmRoundTrip") as string;
    const status = formData.get("status") as string;
    const featured = formData.get("featured") === "true";
    const seoTitle = formData.get("seoTitle") as string;
    const seoDescription = formData.get("seoDescription") as string;
    const seoKeywords = formData.get("seoKeywords") as string;

    // Parse arrays
    const additionalCharges = JSON.parse(formData.get("additionalCharges") as string || "[]");

    // Handle image upload
    const imageFile = formData.get("mainImage") as File;
    let imagePath = "";

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "tariff");
      await mkdir(uploadsDir, { recursive: true });

      // Generate unique filename
      const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
      const filepath = path.join(uploadsDir, filename);

      await writeFile(filepath, buffer);
      imagePath = `/uploads/tariff/${filename}`;
    }

    // Validate required fields
    if (!vehicleType || !vehicleName || !description || !oneWayRate || !roundTripRate || 
        !driverAllowance || !minimumKmOneWay || !minimumKmRoundTrip || !imagePath) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Create new tariff
    const newTariff = new Tariff({
      vehicleType,
      vehicleName,
      description,
      oneWayRate,
      roundTripRate,
      driverAllowance,
      minimumKmOneWay,
      minimumKmRoundTrip,
      image: imagePath,
      status,
      featured,
      additionalCharges,
      seoTitle,
      seoDescription,
      seoKeywords,
    });

    await newTariff.save();

    return NextResponse.json({
      success: true,
      message: "Tariff service created successfully",
      data: newTariff
    });

  } catch (error: any) {
    console.error("Error creating tariff:", error);
    
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create tariff service" },
      { status: 500 }
    );
  }
}