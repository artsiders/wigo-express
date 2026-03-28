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
    const { status } = await req.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    const kyc = await prisma.kycVerification.update({
      where: { id },
      data: { status },
    });

    // If approved, update the user's idVerified status
    if (status === "APPROVED") {
      await prisma.user.update({
        where: { id: kyc.userId },
        data: { idVerified: true },
      });
    }

    return NextResponse.json(kyc);
  } catch (error) {
    console.error("[KYC_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
