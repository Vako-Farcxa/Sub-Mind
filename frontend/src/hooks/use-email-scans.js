"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listEmailScans, startEmailScan } from "@/lib/email-scan-api";

export function useEmailScans() {
  return useQuery({
    queryKey: ["email-scans"],
    queryFn: () => listEmailScans({ limit: 10 }),
  });
}

export function useStartEmailScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startEmailScan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["email-scans"] }),
  });
}
