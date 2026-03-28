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

    // Fetch published trips
    const published = await prisma.trip.findMany({
      where: { driverId: userId },
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
      orderBy: { createdAt: "desc" },
    });

    // Fetch booked trips
    const bookings = await prisma.booking.findMany({
      where: { passengerId: userId },
      include: {
        trip: {
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
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Map booked trips to match structure (or just return the bookings)
    // We return bookings directly so the frontend knows the bookedSeats, status, etc.
    
    return NextResponse.json({
      published,
      booked: bookings,
    });
  } catch (error) {
    console.error("GET /api/trips/me error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
