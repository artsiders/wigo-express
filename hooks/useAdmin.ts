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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-kyc"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-drivers"] });
    },
  });
};
