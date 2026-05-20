"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  confirmDetectedSubscription,
  dismissDetectedSubscription,
  listDetectedSubscriptions,
} from "@/lib/detected-subscription-api";

export function useDetectedSubscriptions(params = { state: "pending" }) {
  return useQuery({
    queryKey: ["detected-subscriptions", params],
    queryFn: () => listDetectedSubscriptions(params),
  });
}

function useInvalidateDetectedSubscriptions() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["detected-subscriptions"] }),
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] }),
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "summary"] }),
    ]);
}

export function useConfirmDetectedSubscription() {
  const invalidate = useInvalidateDetectedSubscriptions();

  return useMutation({
    mutationFn: confirmDetectedSubscription,
    onSuccess: invalidate,
  });
}

export function useDismissDetectedSubscription() {
  const invalidate = useInvalidateDetectedSubscriptions();

  return useMutation({
    mutationFn: dismissDetectedSubscription,
    onSuccess: invalidate,
  });
}
