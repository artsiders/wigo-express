import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { OfferRideSchema } from "@/schemas/offer";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const depart = searchParams.get("depart");
    const arrivee = searchParams.get("arrivee");
    const dateQuery = searchParams.get("date");

    const cleanLocation = (loc: string | null) => {
      if (!loc) return undefined;
      // Prend le premier segment (ex: "Montréal" de "Montréal, QC, Canada")
      return loc.split(",")[0].trim();
    };

    const searchDepart = cleanLocation(depart);
    const searchArrivee = cleanLocation(arrivee);

    let whereClause: any = {
      status: "SCHEDULED",
      availableSeats: { gt: 0 },
    };

    if (searchDepart) {
      whereClause.departureCity = { contains: searchDepart, mode: "insensitive" };
    }

    if (searchArrivee) {
      whereClause.arrivalCity = { contains: searchArrivee, mode: "insensitive" };
    }

    if (dateQuery) {
      const startOfDay = new Date(dateQuery);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(dateQuery);
      endOfDay.setUTCHours(23, 59, 59, 999);

      whereClause.departureDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
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
            idVerified: true,
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

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    
    const parsedData = OfferRideSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ error: "Données invalides", details: parsedData.error }, { status: 400 });
    }

    const { 
      departureCity, arrivalCity, departureLat, departureLng, arrivalLat, arrivalLng,
      date, time, seats, price, max2Back, instantBooking, petFriendly 
    } = parsedData.data;

    // Check if user is driver
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      include: { vehicles: true }
    });

    if (!user?.isDriver) {
      return NextResponse.json({ error: "Seuls les conducteurs peuvent publier des trajets" }, { status: 403 });
    }

    if (!user.vehicles || user.vehicles.length === 0) {
      return NextResponse.json({ error: "Vous devez ajouter un véhicule avant de publier un trajet" }, { status: 400 });
    }

    // Auto-select first vehicle for MVP
    const vehicleId = user.vehicles[0].id;

    // Create ISO datetime
    const departureDate = new Date(`${date}T${time}:00`);

    console.log("Creating trip with data:", {
      driverId: userId,
      vehicleId,
      departureDate,
      departureCity,
      arrivalCity
    });

    const trip = await prisma.trip.create({
      data: {
        driverId: userId,
        vehicleId,
        departureCity,
        arrivalCity,
        departurePlace: departureCity,
        arrivalPlace: arrivalCity,
        departureDate,
        price,
        totalSeats: seats,
        availableSeats: seats,
        status: "SCHEDULED",
        departureLat: departureLat || null,
        departureLng: departureLng || null,
        arrivalLat: arrivalLat || null,
        arrivalLng: arrivalLng || null,
        max2Back,
        instantBooking,
        pet: petFriendly,
        luggage: true,
        smoking: false,
      }
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/trips Error:", error);
    // Return more info for debugging if it's a Prisma error
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Enregistrement non trouvé ou ressource manquante" }, { status: 500 });
    }
    return NextResponse.json({ 
      error: "Internal Server Error", 
      message: error.message,
      code: error.code 
    }, { status: 500 });
  }
}
