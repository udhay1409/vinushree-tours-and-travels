import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/models/connectDB";
import Tariff from "@/config/utils/admin/tariff/tariffSchema";
import jwt from "jsonwebtoken";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

interface DecodedToken {
  adminId: string;
  email: string;
  role: string;
}

// GET - Fetch single tariff service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const tariff = await Tariff.findOne({ 
      _id: id, 
      isDeleted: false 
    }).select('-isDeleted -__v');

    if (!tariff) {
      return NextResponse.json(
        { success: false, message: "Tariff service not found" },
        { status: 404 }
      );
    }

    // Increment views for public access
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      await tariff.incrementViews();
    }

    return NextResponse.json({
      success: true,
      data: tariff
    });

  } catch (error) {
    console.error("Error fetching tariff:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tariff service" },
      { status: 500 }
    );
  }
}

// PUT - Update tariff service (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const formData = await request.formData();
    
    // Find existing tariff
    const existingTariff = await Tariff.findOne({ _id: id, isDeleted: false });
    if (!existingTariff) {
      return NextResponse.json(
        { success: false, message: "Tariff service not found" },
        { status: 404 }
      );
    }

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
    let imagePath = existingTariff.image;
    const imageFile = formData.get("mainImage") as File;
    const existingImage = formData.get("existingImage") as string;

    if (imageFile) {
      // Delete old image if it exists and is not a placeholder
      if (existingTariff.image && existingTariff.image.startsWith("/uploads/")) {
        try {
          const oldImagePath = path.join(process.cwd(), "public", existingTariff.image);
          await unlink(oldImagePath);
        } catch (error) {
          console.log("Could not delete old image:", error);
        }
      }

      // Upload new image
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), "public", "uploads", "tariff");
      await mkdir(uploadsDir, { recursive: true });

      const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
      const filepath = path.join(uploadsDir, filename);

      await writeFile(filepath, buffer);
      imagePath = `/uploads/tariff/${filename}`;
    } else if (existingImage) {
      imagePath = existingImage;
    }

    // Update tariff
    const updatedTariff = await Tariff.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Tariff service updated successfully",
      data: updatedTariff
    });

  } catch (error: any) {
    console.error("Error updating tariff:", error);
    
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update tariff service" },
      { status: 500 }
    );
  }
}

// DELETE - Delete tariff service (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Find and hard delete the tariff
    const tariff = await Tariff.findByIdAndDelete(id);

    if (!tariff) {
      return NextResponse.json(
        { success: false, message: "Tariff service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tariff service deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting tariff:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete tariff service" },
      { status: 500 }
    );
  }
}