import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email requis" }),
  password: z.string().min(1, { message: "Mot de passe requis" }),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Nom requis" }),
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Minimum 6 caractères pour le mot de passe" }),
});
