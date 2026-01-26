"use client";

import { ReportService, ProductSalesChart } from "@/services/report_service";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Props {
  product: ProductSalesChart;
  mode?: "quantity" | "sales";
}

function ProductSalesChartView({ product, mode = "quantity" }: Props) {
  if (!product.sales.length) {
    return (
      <div className="h-75 flex items-center justify-center text-muted">
        No sales data
      </div>
    );
  }

  const data = product.sales
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((s) => ({
      date: new Date(s.date).toLocaleDateString(),
      quantity: s.quantitySold,
      sales: s.totalSales,
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis
          tickFormatter={(value) => (mode === "sales" ? `₱${value}` : value)}
        />
        <Tooltip
          formatter={(value) =>
            mode === "sales"
              ? [`₱${Number(value).toLocaleString()}`, "Sales"]
              : [value, "Quantity"]
          }
        />
        <Line
          type="monotone"
          dataKey={mode === "quantity" ? "quantity" : "sales"}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function ProductSalesDashboard() {
  const [data, setData] = useState<ProductSalesChart[]>([]);
  const [mode, setMode] = useState<"quantity" | "sales">("quantity");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    ReportService.getProductSalesChart()
      .then((res) => {
        setData(res);
        if (res.length) setSelectedProductId(res[0].productId);
      })
      .catch(console.error);
  }, []);

  const selectedProduct = data.find((p) => p.productId === selectedProductId);

  return (
    <Card className="col-span-1 sm:col-span-2 lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Products</CardTitle>
      </CardHeader>

      <CardContent>
        {selectedProduct ? (
          <ProductSalesChartView product={selectedProduct} mode={mode} />
        ) : (
          <div>No product selected</div>
        )}
      </CardContent>
    </Card>

    // <div className="space-y-6">
    //   {/* Controls */}
    //   <div className="flex gap-4 items-center">
    //     <select
    //       className="border p-2 rounded"
    //       value={selectedProductId ?? ""}
    //       onChange={(e) => setSelectedProductId(Number(e.target.value))}
    //     >
    //       {data.map((product) => (
    //         <option key={product.productId} value={product.productId}>
    //           {product.productName}
    //         </option>
    //       ))}
    //     </select>

    //     <button onClick={() => setMode("quantity")}>Quantity</button>
    //     <button onClick={() => setMode("sales")}>Sales</button>
    //   </div>

    //   {/* Chart */}
    //   {selectedProduct ? (
    //     <ProductSalesChartView product={selectedProduct} mode={mode} />
    //   ) : (
    //     <div>No product selected</div>
    //   )}
    // </div>
  );
}
