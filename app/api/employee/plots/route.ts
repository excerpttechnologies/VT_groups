import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Plot from "@/models/Plot";
import { requireEmployee } from "@/lib/roleMiddleware";

export async function GET(req: NextRequest) {
  try {
    const user = await requireEmployee(req);
    await connectDB();

    // Find customers assigned to this employee and populate their plots
    const customerAssignments = await Customer.find({ assignedEmployee: user._id })
      .populate("userId", "name email phone")
      .populate("assignedPlot");

    return NextResponse.json({
      success: true,
      data: customerAssignments
    });

  } catch (error: any) {
    console.error("GET /api/employee/plots error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
