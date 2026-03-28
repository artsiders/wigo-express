import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const depart = searchParams.get("depart");
    const arrivee = searchParams.get("arrivee");
    // const date = searchParams.get("date"); // for future MVP enhancements

    let whereClause: any = {
      status: "SCHEDULED",
      availableSeats: { gt: 0 }
    };

    if (depart) {
      whereClause.departureCity = { contains: depart, mode: "insensitive" };
    }
    
    if (arrivee) {
      whereClause.arrivalCity = { contains: arrivee, mode: "insensitive" };
    }

    const trips = await prisma.trip.findMany({
      where: whereClause,
      include: {
        driver: {
          select: {
            name: true,
            image: true,
            rating: true,
            reviewsCount: true,
            isVerified: true,
          },
        },
        vehicle: true,
      },
      orderBy: { departureDate: "asc" },
      take: 20, // Limit for MVP
    });

    return NextResponse.json(trips);
  } catch (error) {
    console.error("GET /api/trips error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
