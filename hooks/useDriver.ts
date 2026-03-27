import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { DriverApplicationFormData } from "@/schemas/driver";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UploadResult {
  url: string;
  publicId: string;
}

export interface DriverApplicationPayload {
  // Personal
  firstName: string;
  lastName: string;
  phone: string;
  // License
  licenseNumber: string;
  licenseExpiry: string;
  licenseCountry: string;
  licenseDocumentUrl: string;
  // Vehicle
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehiclePlate: string;
  vehicleColor: string;
  vehicleSeats: number;
}

// ─── Hook: Upload Image to Cloudinary ─────────────────────────────────────────

export const useUploadDocument = () => {
  return useMutation<UploadResult, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post<UploadResult>("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    },
  });
};

// ─── Hook: Submit Driver Application ──────────────────────────────────────────

export const useSubmitDriverApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, DriverApplicationPayload>({
    mutationFn: async (payload) => {
      const { data } = await axios.post("/api/users/become-driver", payload);
      return data;
    },
    onSuccess: () => {
      // Invalidate profile so isDriver updates everywhere
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

// ─── Hook: Check Driver Status ────────────────────────────────────────────────

export interface DriverStatus {
  isDriver: boolean;
  idVerified: boolean;
  license: {
    id: string;
    number: string;
    expiryDate: string;
    country: string;
  } | null;
  kycVerifications: Array<{
    type: string;
    status: string;
  }>;
}

export const useDriverStatus = () => {
  return useQuery<DriverStatus>({
    queryKey: ["driverStatus"],
    queryFn: async () => {
      const { data } = await axios.get<DriverStatus>("/api/users/profile");
      return data;
    },
    staleTime: 30 * 1000,
  });
};

// ─── Hook: Submit KYC Identity ────────────────────────────────────────────────

export interface KycIdentityPayload {
  rectoUrl: string;
  versoUrl: string;
  selfieUrl: string;
}

export const useSubmitKycIdentity = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, KycIdentityPayload>({
    mutationFn: async (payload) => {
      const { data } = await axios.post("/api/users/verify-id", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driverStatus"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};
