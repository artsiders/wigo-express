import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const driverRequest = await prisma.license.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            bio: true,
            isDriver: true,
            createdAt: true,
          },
        },
      },
    });

    if (!driverRequest) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(driverRequest);
  } catch (error) {
    console.error("[DRIVER_GET_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  const { isApproved } = await request.json();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const driverRequest = await prisma.license.findUnique({
      where: { id },
    });

    if (!driverRequest) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (isApproved) {
      await prisma.user.update({
        where: { id: driverRequest.userId },
        data: { isDriver: true },
      });
    }

    const updatedDriver = await prisma.license.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            bio: true,
            isDriver: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json(updatedDriver);
  } catch (error) {
    console.error("[DRIVER_PATCH_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
