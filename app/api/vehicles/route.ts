import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const vehicleSchema = z.object({
  make: z.string().min(2, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  licensePlate: z.string().min(3, "L'immatriculation est requise"),
  color: z.string().optional(),
  seatsCapacity: z.coerce.number().min(1).max(8).default(4),
  features: z.array(z.string()).default([]),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    
    const parsedData = vehicleSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ error: "Invalid data", details: parsedData.error }, { status: 400 });
    }

    // Check if user is driver
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.isDriver) {
      return NextResponse.json({ error: "Only drivers can add vehicles" }, { status: 403 });
    }

    const { make, model, year, licensePlate, color, seatsCapacity, features } = parsedData.data;

    // Check for duplicate license plate
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { licensePlate }
    });

    if (existingVehicle) {
      return NextResponse.json({ error: "Ce numéro d'immatriculation existe déjà." }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        userId,
        make,
        model,
        year,
        licensePlate,
        color: color || "Noir",
        seatsCapacity,
        features,
        photo: "/images/wigo-express-red-card.jpg", // Default placeholder photo for MVP
      }
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("POST /api/vehicles Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
