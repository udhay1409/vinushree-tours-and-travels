import { NextRequest, NextResponse } from "next/server";
import Lead from "@/config/utils/admin/lead/leadSchema";
import connectDB from "@/config/models/connectDB";

// POST - Create new lead from frontend forms
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const newLead = new Lead(body);
    const savedLead = await newLead.save();

    return NextResponse.json({
      success: true,
      data: savedLead,
      message: "Lead created successfully",
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 }
    );
  }
}