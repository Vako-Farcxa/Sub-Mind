"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSubscription,
  deleteSubscription,
  getSubscription,
  getSubscriptionSummary,
  listSubscriptions,
  updateSubscription,
} from "@/lib/subscription-api";

export function useSubscriptions(filters = {}) {
  return useQuery({
    queryKey: ["subscriptions", filters],
    queryFn: () => listSubscriptions(filters),
  });
}

export function useSubscription(id) {
  return useQuery({
    queryKey: ["subscriptions", id],
    queryFn: () => getSubscription(id),
    enabled: Boolean(id),
  });
}

export function useSubscriptionSummary() {
  return useQuery({
    queryKey: ["subscriptions", "summary"],
    queryFn: getSubscriptionSummary,
  });
}

function useInvalidateSubscriptions() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] }),
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "summary"] }),
    ]);
}

export function useCreateSubscription() {
  const invalidateSubscriptions = useInvalidateSubscriptions();

  return useMutation({
    mutationFn: createSubscription,
    onSuccess: invalidateSubscriptions,
  });
}

export function useUpdateSubscription() {
  const invalidateSubscriptions = useInvalidateSubscriptions();

  return useMutation({
    mutationFn: updateSubscription,
    onSuccess: invalidateSubscriptions,
  });
}

export function useDeleteSubscription() {
  const invalidateSubscriptions = useInvalidateSubscriptions();

  return useMutation({
    mutationFn: deleteSubscription,
    onSuccess: invalidateSubscriptions,
  });
}
