"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/react-query/constants";
import dashboardService from "@/services/dashboardService";

type GrowthType = "positive" | "negative" | "neutral";

interface StatCategory {
  total: number;
  growthPercentage: number;
  growthType: GrowthType;
  lastMonthCount: number;
  currentMonthCount: number;
}

interface Metadata {
  calculatedAt: string;
  currentMonth: string;
  lastMonth: {
    start: string;
    end: string;
  };
}

export interface DashboardStatsResponse {
  error?: string;
  users: StatCategory;
  buyers: StatCategory;
  sellers: StatCategory;
  bookings: StatCategory;
  metadata: Metadata;
}

export function useGetDashboardMonthlyStats() {
  const query = useQuery<DashboardStatsResponse>({
    queryKey: [QUERY_KEYS.DASHBOARD_DATA_MONTHLY],
    queryFn: async () => {
      const res =
        (await dashboardService.getDashboardMonthlyStats()) as DashboardStatsResponse;

      if (res.error) {
        throw new Error(res.error);
      }

      return res;
    },
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
