import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import User from "@/models/User";
import Plot from "@/models/Plot";
import Payment from "@/models/Payment";
import { requireAuth } from "@/lib/roleMiddleware";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    if (user.role !== "customer") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const customer = await Customer.findOne({ userId: user._id })
      .populate("assignedPlot")
      .populate("assignedEmployee", "name email");

    if (!customer) {
      return NextResponse.json({ success: false, message: "Customer profile not found" }, { status: 404 });
    }

    const payments = await Payment.find({ customerId: customer._id })
      .sort({ paymentDate: -1 })
      .populate("plotId", "plotNumber location")
      .populate("collectedBy", "name");


    return NextResponse.json({
      success: true,
      data: {
        customer,
        payments
      }
    });

  } catch (error: any) {
    console.error("GET /api/customers/me error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
