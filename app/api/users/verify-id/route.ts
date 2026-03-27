import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { rectoUrl, versoUrl, selfieUrl } = body;

    if (!rectoUrl || !versoUrl || !selfieUrl) {
      return NextResponse.json(
        { error: "Tous les documents (Recto, Verso, Selfie) sont requis." },
        { status: 400 }
      );
    }

    // Vérifier s'il y a déjà une vérification d'identité en cours
    const pendingIdentity = await prisma.kycVerification.findFirst({
      where: {
        userId,
        type: { in: ["IDENTITY_RECTO", "IDENTITY_VERSO", "SELFIE"] },
        status: "PENDING",
      },
    });

    if (pendingIdentity) {
      return NextResponse.json(
        { error: "Une vérification d'identité est déjà en cours d'examen." },
        { status: 409 }
      );
    }

    // Créer les 3 entrées dans une transaction
    const results = await prisma.$transaction([
      prisma.kycVerification.create({
        data: { userId, type: "IDENTITY_RECTO", status: "PENDING", documentUrl: rectoUrl },
      }),
      prisma.kycVerification.create({
        data: { userId, type: "IDENTITY_VERSO", status: "PENDING", documentUrl: versoUrl },
      }),
      prisma.kycVerification.create({
        data: { userId, type: "SELFIE", status: "PENDING", documentUrl: selfieUrl },
      }),
    ]);

    return NextResponse.json({ success: true, count: results.length });
  } catch (error) {
    console.error("KYC Identity API Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la soumission du KYC." },
      { status: 500 }
    );
  }
}
