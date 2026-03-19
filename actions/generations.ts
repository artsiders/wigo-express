"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getGenerations() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return [];
  }
  
  try {
    const generations = await prisma.generation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return generations;
  } catch (error) {
    console.error("Failed to fetch generations:", error);
    return [];
  }
}

export async function saveGeneration(data: {
  prompt: string;
  tone: string;
  script: string;
  imageUrl: string;
}) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("User must be authenticated to generate videos.");
  }
  
  try {
    const generation = await prisma.generation.create({
      data: {
        ...data,
        userId: session.user.id,
        status: "COMPLETED",
        // Here we mock a videoUrl for the history, using another unsplash image or a video placeholder
        // Since we don't really generate video yet on backend, we'll leave it null or put a placeholder
        videoUrl: null, 
      }
    });
    return generation;
  } catch (error) {
    console.error("Failed to save generation:", error);
    throw new Error("Failed to save generation");
  }
}
