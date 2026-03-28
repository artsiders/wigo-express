import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const { id } = await params;

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { isApproved } = await req.json();

    const license = await prisma.license.findUnique({
      where: { id },
    });

    if (!license) {
      return new NextResponse("License not found", { status: 404 });
    }

    if (isApproved) {
      // Approve the driver
      await prisma.user.update({
        where: { id: license.userId },
        data: { isDriver: true },
      });
    } else {
      // If rejected, we might want to delete the license or set a status
      // For now, let's keep it simple and just set isDriver to false
      await prisma.user.update({
        where: { id: license.userId },
        data: { isDriver: false },
      });
    }

    return NextResponse.json({ success: true, isApproved });
  } catch (error) {
    console.error("[DRIVERS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
