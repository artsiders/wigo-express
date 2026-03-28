import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const kycRequest = await prisma.kycVerification.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            bio: true,
            createdAt: true,
          },
        },
      },
    });

    if (!kycRequest) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(kycRequest);
  } catch (error) {
    console.error("[KYC_GET_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const { status } = await request.json();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const kycRequest = await prisma.kycVerification.update({
      where: { id: params.id },
      data: { status },
    });

    if (status === "APPROVED") {
      await prisma.user.update({
        where: { id: kycRequest.userId },
        data: { idVerified: true },
      });
    }

    return NextResponse.json(kycRequest);
  } catch (error) {
    console.error("[KYC_PATCH_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
