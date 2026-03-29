import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const depart = searchParams.get("depart");
    const arrivee = searchParams.get("arrivee");
    const dateQuery = searchParams.get("date");

    const cleanLocation = (loc: string | null) => {
      if (!loc) return undefined;
      return loc.split(",")[0].trim();
    };

    const searchDepart = cleanLocation(depart);
    const searchArrivee = cleanLocation(arrivee);

    let whereClause: any = {
      status: "SCHEDULED",
      availableSeats: { gt: 0 },
    };

    const orConditions: any[] = [];

    if (searchDepart && searchArrivee) {
      // Priorité haute : même trajet, autre date
      orConditions.push({
        AND: [
          { departureCity: { contains: searchDepart, mode: "insensitive" } },
          { arrivalCity: { contains: searchArrivee, mode: "insensitive" } },
        ],
      });
    }

    if (searchDepart) {
      orConditions.push({ departureCity: { contains: searchDepart, mode: "insensitive" } });
    }

    if (searchArrivee) {
      orConditions.push({ arrivalCity: { contains: searchArrivee, mode: "insensitive" } });
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
