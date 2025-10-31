"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/react-query/constants";
import dashboardService from "@/services/dashboardService";

export type DashboardChartGrowthType = {
  error?: string;
  period: "daily" | "weekly" | "monthly";
  data: {
    date: string; // e.g., "25 Oct"
    buyers: number;
    sellers: number;
  }[];
  metadata: {
    startDate: string; // ISO timestamp
    endDate: string; // ISO timestamp
    totalBuyers: number;
    totalSellers: number;
    generatedAt: string; // ISO timestamp
  };
};

export function useDashboardChartGrowth(
  filter: "monthly" | "weekly" | "daily"
) {
  const query = useQuery<DashboardChartGrowthType>({
    queryKey: [QUERY_KEYS.DASHBOARD_DATA_CHART_GROWTH, filter],
    queryFn: async () => {
      const res = (await dashboardService.getDashboardChartGrowth(
        filter
      )) as DashboardChartGrowthType;

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
