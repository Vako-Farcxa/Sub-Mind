"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listNotifications, markNotificationRead, runReminderCycle } from "@/lib/notification-api";
import { getReminderSettings, updateReminderSettings } from "@/lib/reminder-settings-api";

export function useReminderSettings() {
  return useQuery({
    queryKey: ["reminder-settings"],
    queryFn: getReminderSettings,
  });
}

export function useUpdateReminderSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReminderSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminder-settings"] }),
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => listNotifications({ limit: 25 }),
  });
}

export function useRunReminderCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: runReminderCycle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
