import { apiFetch } from "@/lib/api";

export type RevenuePoint = {
  date: string; // ISO datetime
  revenue: number;
};

export type RevenueSummary = {
  totalRevenue: number;
  revenuePoints: RevenuePoint[];
};

export type RevenueRange = "today" | "week" | "month" | "year";

export const RevenueService = {
  getRevenueSummary: (
    range: RevenueRange,
    from?: string | null,
    to?: string | null,
  ) => {
    const params = new URLSearchParams({ range });

    if (from) params.append("from", from);
    if (to) params.append("to", to);

    return apiFetch<RevenueSummary>(`/Revenues?${params.toString()}`);
  },
};
