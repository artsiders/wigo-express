import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const licenses = await prisma.license.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            isDriver: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(licenses);
  } catch (error) {
    console.error("[DRIVERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
