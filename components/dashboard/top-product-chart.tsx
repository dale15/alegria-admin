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

export function TopProductsBarChart() {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [chartMode, setMode] = useState<"quantity" | "sales">("quantity");

  useEffect(() => {
    ReportService.getTopProducts(3, chartMode)
      .then(setTopProducts)
      .catch(console.error);
  }, [chartMode]);

  if (!topProducts.length) {
    return (
      <div className="h-75 flex items-center justify-center text-muted-foreground">
        No sales data
      </div>
    );
  }

  const chartData = topProducts.map((p) => ({
    name: p.productName,
    sales: p.totalSales,
    quantity: p.totalQuantitySold,
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Products</CardTitle>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={chartMode === "quantity" ? "default" : "outline"}
            onClick={() => setMode("quantity")}
          >
            Quantity
          </Button>

          <Button
            size="sm"
            variant={chartMode === "sales" ? "default" : "outline"}
            onClick={() => setMode("sales")}
          >
            Sales
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-20} textAnchor="end" height={60} />
            <YAxis
              tickFormatter={(v) => (chartMode === "sales" ? `₱${v}` : v)}
            />
            <Tooltip
              formatter={(value) =>
                chartMode === "sales"
                  ? [`₱${Number(value).toLocaleString()}`, "Sales"]
                  : [value, "Quantity Sold"]
              }
            />
            <Bar
              dataKey={chartMode === "sales" ? "sales" : "quantity"}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
