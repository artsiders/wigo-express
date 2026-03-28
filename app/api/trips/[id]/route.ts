import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Missing Trip ID" }, { status: 400 });
    }

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
            reviewsCount: true,
            idVerified: true,
            bio: true,
            createdAt: true, // memberSince
            totalRides: true,
          },
        },
        vehicle: true,
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error(`GET /api/trips/[id] ${params.id} error:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
