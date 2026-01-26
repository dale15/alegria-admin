import { RevenuePoint } from "@/services/revenue_service";

export type RevenueRange = "today" | "week" | "month" | "year";

function utcStartOfToday() {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
    ),
  );
}

function utcStartOfWeek() {
  const now = utcStartOfToday();
  now.setUTCDate(now.getUTCDate() - 6); // last 7 days INCLUDING today
  return now;
}

function utcStartOfMonth() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0),
  );
}

export function fillRevenueGaps(
  data: RevenuePoint[],
  range: RevenueRange,
): RevenuePoint[] {
  // map existing data by timestamp
  const map = new Map(data.map((d) => [new Date(d.date).getTime(), d.revenue]));

  const nowUtc = new Date();
  const filled: RevenuePoint[] = [];

  // ===== TODAY (24 HOURS) =====
  if (range === "today") {
    const start = new Date(
      Date.UTC(
        nowUtc.getUTCFullYear(),
        nowUtc.getUTCMonth(),
        nowUtc.getUTCDate(),
        0,
        0,
        0,
      ),
    );

    for (let h = 0; h < 24; h++) {
      const d = new Date(start);
      d.setUTCHours(h);

      filled.push({
        date: d.toISOString(),
        revenue: map.get(d.getTime()) ?? 0,
      });
    }
  }

  // ===== WEEK / MONTH (DAILY) =====
  if (range === "week" || range === "month") {
    const start = range === "week" ? utcStartOfWeek() : utcStartOfMonth();

    const end = utcStartOfToday();

    const days = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;

    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setUTCDate(start.getUTCDate() + i);

      filled.push({
        date: d.toISOString(),
        revenue: map.get(d.getTime()) ?? 0,
      });
    }
  }

  // ===== YEAR (MONTHLY) =====
  if (range === "year") {
    const year = new Date().getUTCFullYear();

    // Map backend MONTHLY data
    const map = new Map(
      data.map((d) => {
        const dt = new Date(d.date);
        return [Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), 1), d.revenue];
      }),
    );

    for (let month = 0; month < 12; month++) {
      const d = new Date(Date.UTC(year, month, 1));

      filled.push({
        date: d.toISOString(),
        revenue: map.get(d.getTime()) ?? 0,
      });
    }

    return filled;
  }

  return filled;
}
