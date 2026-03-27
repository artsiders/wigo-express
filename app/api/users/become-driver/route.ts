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
    const {
      // Personal
      firstName,
      lastName,
      phone,
      // License
      licenseNumber,
      licenseExpiry,
      licenseCountry,
      licenseDocumentUrl,
      // Vehicle
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vehiclePlate,
      vehicleColor,
      vehicleSeats,
    } = body;

    // Validate required fields
    if (!licenseNumber || !licenseExpiry || !licenseCountry) {
      return NextResponse.json(
        { error: "Champs du permis manquants" },
        { status: 400 }
      );
    }
    if (!vehicleMake || !vehicleModel || !vehiclePlate || !vehicleYear) {
      return NextResponse.json(
        { error: "Champs du véhicule manquants" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Check if license already exists for this user
    const existingLicense = await prisma.license.findUnique({
      where: { userId },
    });
    if (existingLicense) {
      return NextResponse.json(
        { error: "Vous avez déjà soumis une candidature conducteur" },
        { status: 409 }
      );
    }

    // Transaction: create license + vehicle + KYC record
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update user name/phone if provided
      await tx.user.update({
        where: { id: userId },
        data: {
          ...(firstName && lastName
            ? { name: `${firstName} ${lastName}`.trim() }
            : {}),
        },
      });

      // 2. Create license record
      const license = await tx.license.create({
        data: {
          userId,
          number: licenseNumber,
          expiryDate: new Date(licenseExpiry),
          country: licenseCountry,
          documentUrl: licenseDocumentUrl ?? "",
        },
      });

      // 3. Create vehicle record
      const vehicle = await tx.vehicle.create({
        data: {
          userId,
          make: vehicleMake,
          model: vehicleModel,
          year: Number(vehicleYear),
          licensePlate: vehiclePlate.toUpperCase(),
          color: vehicleColor ?? null,
          seatsCapacity: Number(vehicleSeats) || 3,
        },
      });

      // 4. Create KYC verification record (status: PENDING)
      const kyc = await tx.kycVerification.create({
        data: {
          userId,
          type: "LICENSE",
          status: "PENDING",
          documentUrl: licenseDocumentUrl ?? "",
        },
      });

      return { license, vehicle, kyc };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    console.error("Become Driver API Error:", error);

    // Prisma unique constraint violation (license plate already in use)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Cette plaque d'immatriculation est déjà enregistrée." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
