import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface License {
  id: string;
  number: string;
  expiryDate: string;
  country: string;
}

export interface KycVerification {
  id: string;
  type: string;
  status: string;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  bio: string | null;
  isDriver: boolean;
  idVerified: boolean;
  rating: number;
  totalRides: number;
  license: License | null;
  kycVerifications: KycVerification[];
  vehicles?: {
    id: string;
    make: string;
    model: string;
    year: number;
    color: string | null;
    licensePlate: string;
    seatsCapacity: number;
    photo: string | null;
    features: string[];
  }[];
}

export const useProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data } = await axios.get<UserProfile>("/api/users/profile");
      return data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name?: string; bio?: string; image?: string }) => {
      const { data } = await axios.patch("/api/users/profile", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useBecomeDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { number: string; expiryDate: string; country: string; documentUrl: string }) => {
      const { data } = await axios.post("/api/users/become-driver", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useVerifyId = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { documentUrl: string }) => {
      const { data } = await axios.post("/api/users/verify-id", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};
