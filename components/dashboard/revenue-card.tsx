"use client";

import { RevenueService } from "@/services/revenue_service";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";

async function getRevenue(from: string, to: string) {
  const res = await RevenueService.getRevenueSummary("week", from, to);
  return res.totalRevenue;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getTodayRange() {
  const today = new Date();
  return {
    from: formatDate(today),
    to: formatDate(today),
  };
}

function getThisWeekRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6); // last 7 days

  return {
    from: formatDate(start),
    to: formatDate(now),
  };
}

function getThisMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    from: formatDate(start),
    to: formatDate(now),
  };
}

type Props = {
  title: string;
  from: string;
  to: string;
};

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

const todayRange = {
  from: formatDate(today),
  to: formatDate(today),
};

const yesterdayRange = {
  from: formatDate(yesterday),
  to: formatDate(yesterday),
};

function calculateTrend(current: number, previous: number) {
  if (previous === 0) {
    return {
      percent: 0,
      isIncrease: current > 0,
      label: "New",
    };
  }

  const percent = ((current - previous) / previous) * 100;

  return {
    percent: Math.abs(percent),
    isIncrease: percent >= 0,
    label: "Yesterday",
  };
}

function RevenueKpiCard({ title, from, to }: Props) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    RevenueService.getRevenueSummary("week", from, to).then((res) =>
      setTotal(res.totalRevenue),
    );
  }, [from, to]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          ₱{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </CardContent>
    </Card>
  );
}

function RevenueTodayKpiCard() {
  const [todayTotal, setTodayTotal] = useState(0);
  const [yesterdayTotal, setYesterdayTotal] = useState(0);

  useEffect(() => {
    Promise.all([
      getRevenue(todayRange.from, todayRange.to),
      getRevenue(yesterdayRange.from, yesterdayRange.to),
    ]).then(([today, yesterday]) => {
      setTodayTotal(today);
      setYesterdayTotal(yesterday);
    });
  }, []);

  const trend = calculateTrend(todayTotal, yesterdayTotal);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">
          Sales Today
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-2xl font-bold">
          ₱{todayTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>

        {/* 🔽 Trend */}
        {yesterdayTotal > 0 && (
          <p
            className={`mt-1 text-sm ${
              trend.isIncrease ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isIncrease ? "▲" : "▼"} {trend.percent.toFixed(2)}% vs
            Yesterday
          </p>
        )}

        {yesterdayTotal === 0 && todayTotal > 0 && (
          <p className="mt-1 text-sm text-green-600">▲ New vs Yesterday</p>
        )}
      </CardContent>
    </Card>
  );
}

export function RevenueCard() {
  const week = getThisWeekRange();
  const month = getThisMonthRange();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <RevenueTodayKpiCard />

      <RevenueKpiCard title="Sales This Week" from={week.from} to={week.to} />

      <RevenueKpiCard
        title="Sales This Month"
        from={month.from}
        to={month.to}
      />
    </div>
  );
}
