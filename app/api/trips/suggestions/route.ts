import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const depart = searchParams.get("depart");
    const arrivee = searchParams.get("arrivee");

    let whereClause: any = {
      status: "SCHEDULED",
      availableSeats: { gt: 0 },
    };

    const orConditions: any[] = [];

    if (depart) {
      orConditions.push({ departureCity: { contains: depart, mode: "insensitive" } });
    }

    if (arrivee) {
      orConditions.push({ arrivalCity: { contains: arrivee, mode: "insensitive" } });
    }

    if (orConditions.length > 0) {
      whereClause.OR = orConditions;
    }

    // If neither depart nor arrivee is provided, just return upcoming trips
    const trips = await prisma.trip.findMany({
      where: whereClause,
      include: {
        driver: {
          select: {
            name: true,
            image: true,
            rating: true,
            reviewsCount: true,
            idVerified: true,
          },
        },
        vehicle: true,
      },
      orderBy: { departureDate: "asc" },
      take: 6, // Show a few suggestions
    });

    return NextResponse.json(trips);
  } catch (error) {
    console.error("GET /api/trips/suggestions error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
