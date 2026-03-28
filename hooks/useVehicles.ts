import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface CreateVehiclePayload {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color?: string;
  seatsCapacity: number;
  features: string[];
}

export const useAddVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateVehiclePayload) => {
      const { data } = await axios.post("/api/vehicles", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/vehicles/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};
