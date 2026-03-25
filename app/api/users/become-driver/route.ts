import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { number, expiryDate, country, documentUrl } = body;

    if (!number || !expiryDate || !country) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userId = session.user.id;

    // Start transaction to create license and update user
    const result = await prisma.$transaction(async (tx) => {
      const license = await tx.license.create({
        data: {
          userId,
          number,
          expiryDate: new Date(expiryDate),
          country,
          documentUrl: documentUrl || ""
        }
      });

      const kyc = await tx.kycVerification.create({
        data: {
          userId,
          type: "LICENSE",
          status: "PENDING",
          documentUrl: documentUrl || ""
        }
      });

      return { license, kyc };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Become Driver API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
