import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Fetching KYC Requests
export const useAdminKyc = () => {
  return useQuery({
    queryKey: ["admin-kyc"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/kyc");
      return data;
    },
  });
};

// Updating KYC Status
export const useUpdateKycStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) => {
      const { data } = await axios.patch(`/api/admin/kyc/${id}`, { status });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-kyc"] });
      queryClient.invalidateQueries({ queryKey: ["admin-kyc", variables.id] });
    },
  });
};

// Fetching Driver Requests (Licenses)
export const useAdminDrivers = () => {
  return useQuery({
    queryKey: ["admin-drivers"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/drivers");
      return data;
    },
  });
};

// Updating Driver Approval Status
export const useUpdateDriverStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isApproved }: { id: string; isApproved: boolean }) => {
      const { data } = await axios.patch(`/api/admin/drivers/${id}`, { isApproved });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-drivers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-drivers", variables.id] });
    },
  });
};

// Fetching KYC Details
export const useAdminKycDetail = (id: string) => {
  return useQuery({
    queryKey: ["admin-kyc", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/kyc/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Fetching Driver Details
export const useAdminDriverDetail = (id: string) => {
  return useQuery({
    queryKey: ["admin-drivers", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/drivers/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
