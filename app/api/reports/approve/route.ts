import { knock } from "@lib/knock";
import Report from "@models/reportModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";

export const PATCH = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const ids = searchParams.getAll("ids");
  try {
    await connectToDB();

    const updatedReports = await Report.updateMany(
      { _id: { $in: ids } }, 
      { state: true },
      { new: true }
    );

    const reportsWithUsers = await Report.find({ _id: { $in: ids } }).populate(
      "user"
    );

    const recipients = reportsWithUsers.map(report => ({
        id: report.user._id.toString(),
        name: report.user.username,
        email: report.user.email,
        avatar: report.user.image || null,
      }));

      await knock.workflows.trigger("approve-report", {
        actor: process.env.NEXT_PUBLIC_ADMIN_ID,
        recipients: recipients,
      });
    
    return NextResponse.json({ message: "Reports approved" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "failed to update Report" },
      { status: 500 }
    );
  }
};
