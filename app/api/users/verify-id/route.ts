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
    const { documentUrl } = body;

    if (!documentUrl) {
      return NextResponse.json({ error: "Missing document image" }, { status: 400 });
    }

    const userId = session.user.id;

    const kyc = await prisma.kycVerification.create({
      data: {
        userId,
        type: "ID",
        status: "PENDING",
        documentUrl
      }
    });

    return NextResponse.json({ success: true, kyc });
  } catch (error) {
    console.error("Verify ID API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
