import { z } from "zod";

// Step 1 - Route & Date
export const StepRouteAndDateSchema = z.object({
  departureCity: z.string().min(2, "La ville de départ est requise"),
  arrivalCity: z.string().min(2, "La ville d'arrivée est requise"),
  departureLat: z.number().describe("Latitude de départ"),
  departureLng: z.number().describe("Longitude de départ"),
  arrivalLat: z.number().describe("Latitude d'arrivée"),
  arrivalLng: z.number().describe("Longitude d'arrivée"),
  date: z.string().min(1, "La date est requise").refine((val) => {
    const d = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
  }, "La date ne peut pas être dans le passé"),
  time: z.string().min(1, "L'heure est requise"),
}).refine((data) => data.departureCity !== data.arrivalCity, {
  message: "Le départ et l'arrivée ne peuvent pas être identiques",
  path: ["arrivalCity"],
});

// Step 2 - Options & Price
export const StepOptionsAndPriceSchema = z.object({
  seats: z.number().int().min(1, "Minimum 1 place").max(8, "Maximum 8 places"),
  price: z.number().min(1, "Le prix doit être au moins 1$").max(500, "Prix trop élevé"),
  max2Back: z.boolean(),
  instantBooking: z.boolean(),
  petFriendly: z.boolean(),
});

// Combined Schema
export const OfferRideSchema = z.object({
  // Flattened for easier form management
  departureCity: z.string().min(2, "La ville de départ est requise"),
  arrivalCity: z.string().min(2, "La ville d'arrivée est requise"),
  departureLat: z.number(),
  departureLng: z.number(),
  arrivalLat: z.number(),
  arrivalLng: z.number(),
  date: z.string().min(1, "La date est requise"),
  time: z.string().min(1, "L'heure est requise"),
  seats: z.number().int().min(1).max(8),
  price: z.number().min(1),
  max2Back: z.boolean(),
  instantBooking: z.boolean(),
  petFriendly: z.boolean(),
}).refine((data) => data.departureCity !== data.arrivalCity, {
  message: "Le départ et l'arrivée ne peuvent pas être identiques",
  path: ["arrivalCity"],
});

export type OfferRideFormData = z.infer<typeof OfferRideSchema>;
