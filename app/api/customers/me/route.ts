import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
// Import all models to ensure they are registered with Mongoose
import "@/models";
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

    let customer = await Customer.findOne({ userId: user._id })
      .populate("assignedPlot")
      .populate("assignedEmployee", "name email");

    // If customer profile doesn't exist, create one with default values
    if (!customer) {
      console.log(`Creating default customer profile for user ${user._id}`);
      customer = await Customer.create({
        userId: user._id,
        totalAmount: 0,
        paidAmount: 0,
        status: 'Active',
      });
      console.log(`Customer profile created: ${customer._id}`);
    }

    const payments = await Payment.find({ customerId: customer._id })
      .sort({ paymentDate: -1 })
      .populate("plotId", "plotNumber location")
      .populate("collectedBy", "name");

    return NextResponse.json({
      success: true,
      data: {
        customer,
        payments: payments || []
      }
    });

  } catch (error: any) {
    console.error("GET /api/customers/me error:", error);
    return NextResponse.json({ success: false, message: "Internal server error", error: error.message }, { status: 500 });
  }
}
