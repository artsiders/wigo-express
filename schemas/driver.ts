import { z } from "zod";

// Step 1 - Personal Information
export const Step1Schema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z
    .string()
    .min(14, "Le numéro doit contenir 10 chiffres") // format (XXX) XXX-XXXX = 14 chars
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Format invalide : (XXX) XXX-XXXX"),
});

// Step 2 - Driver's License
export const Step2Schema = z.object({
  licenseNumber: z
    .string()
    .min(4, "Numéro de permis invalide")
    .max(20, "Numéro de permis trop long"),
  licenseExpiry: z
    .string()
    .min(1, "La date d'expiration est requise")
    .refine((date) => {
      if (!date) return false;
      return new Date(date) > new Date();
    }, "Le permis est expiré ou la date est invalide"),
  licenseCountry: z.string().min(1, "Le pays est requis"),
  licenseDocumentUrl: z
    .string()
    .min(1, "Veuillez uploader une photo de votre permis")
    .url("URL du document invalide"),
});

// Step 3 - Vehicle
export const Step3Schema = z.object({
  vehicleMake: z.string().min(2, "La marque est requise"),
  vehicleModel: z.string().min(1, "Le modèle est requis"),
  vehicleYear: z
    .number()
    .int()
    .min(2000, "Véhicule trop ancien (min. 2000)")
    .max(new Date().getFullYear() + 1, "Année invalide"),
  vehiclePlate: z
    .string()
    .min(4, "Plaque d'immatriculation invalide")
    .max(15, "Plaque trop longue"),
  vehicleColor: z.string().min(2, "La couleur est requise"),
  vehicleSeats: z
    .number()
    .int()
    .min(1, "Minimum 1 place")
    .max(8, "Maximum 8 places"),
});

// Step 4 - Confirmation
export const Step4Schema = z.object({
  acceptTerms: z.boolean().refine((v) => v === true, {
    message: "Vous devez accepter les conditions générales",
  }),
});

// Full combined schema
export const DriverApplicationSchema = Step1Schema.merge(Step2Schema)
  .merge(Step3Schema)
  .merge(Step4Schema);

export type DriverApplicationFormData = z.infer<typeof DriverApplicationSchema>;

export type Step1Data = z.infer<typeof Step1Schema>;
export type Step2Data = z.infer<typeof Step2Schema>;
export type Step3Data = z.infer<typeof Step3Schema>;
export type Step4Data = z.infer<typeof Step4Schema>;
