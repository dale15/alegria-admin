"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

import {
  RevenueService,
  RevenuePoint,
  RevenueRange,
} from "@/services/revenue_service";
import { Button } from "../ui/button";
import { fillRevenueGaps } from "../common/fill-revenue-gaps";

export default function RevenueChart() {
  const [range, setRange] = useState<RevenueRange>("today");
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);

  const [data, setData] = useState<RevenuePoint[]>([]);
  const [loading, setLoading] = useState(true);

  const isCustomRange = Boolean(from || to);

  useEffect(() => {
    RevenueService.getRevenueSummary(range, from, to)
      .then((res) => {
        if (from || to) {
          setData(res.revenuePoints);
        } else {
          const filled = fillRevenueGaps(res.revenuePoints, range);
          setData(filled);
        }
      })
      .finally(() => setLoading(false));
  }, [range, from, to]);

  return (
    <Card className="col-span-1 sm:col-span-2 lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sales Revenue</CardTitle>

        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={from ?? ""}
            onChange={(e) => setFrom(e.target.value || null)}
            className="border rounded px-2 py-1"
          />
          <span>to</span>
          <input
            type="date"
            value={to ?? ""}
            onChange={(e) => setTo(e.target.value || null)}
            className="border rounded px-2 py-1"
          />

          {(from || to) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRange(range);
                setFrom(null);
                setTo(null);
              }}
            >
              Clear
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {(["today", "week", "month", "year"] as RevenueRange[]).map((r) => (
            <Button
              key={r}
              size="sm"
              variant={range === r ? "default" : "outline"}
              onClick={() => setRange(r)}
            >
              {r.toUpperCase()}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="h-80">
        {loading ? (
          <p className="text-muted-foreground">Loading revenue…</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const d = new Date(value);

                  if (isCustomRange) {
                    return d.toLocaleDateString();
                  }

                  if (range === "today") {
                    return d.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  }

                  return d.toLocaleDateString();
                }}
              />

              <YAxis />

              <Tooltip
                labelFormatter={(value) => {
                  const d = new Date(value);

                  if (isCustomRange) {
                    return `Date: ${d.toLocaleDateString()}`;
                  }

                  if (range === "today") {
                    return `Time: ${d.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`;
                  }

                  return `Date: ${d.toLocaleDateString()}`;
                }}
                formatter={(value: number) => `₱${value.toLocaleString()}`}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
