import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          license: true,
          kycVerifications: {
            orderBy: { createdAt: "desc" },
            take: 1
          }
        }
      });
    } catch (dbError) {
      console.warn("Prisma returned an error (missing tables?), falling back to basic user", dbError);
      user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        Object.assign(user, { isDriver: false, idVerified: false, license: null, kycVerifications: [] });
      }
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Sanitize user data before returning
    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
