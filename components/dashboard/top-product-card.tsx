"use client";

import { ReportService, TopProduct } from "@/services/report_service";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export function TopProductCard() {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  useEffect(() => {
    ReportService.getTopProducts(3, "sales")
      .then(setTopProducts)
      .catch(console.error);
  });

  if (!topProducts.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🥇 Top Product
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-center text-muted-foreground">
            No sales data
          </div>
        </CardContent>
      </Card>
    );
  }

  const topProduct = topProducts[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🥇 Top Product
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <p className="text-lg font-semibold">{topProduct.productName}</p>

          <p className="text-sm text-muted-foreground">
            ₱{topProduct.totalSales.toFixed(2)} Total sales
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
