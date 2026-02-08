"use client";

import { Product, ProductService } from "@/services/product_service";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Props {
  product: ProductSalesChart;
  mode?: "quantity" | "sales";
}

function ProductSalesChartView({ product, mode = "quantity" }: Props) {
  if (!product.sales || product.sales.length === 0) {
    return (
      <div className="h-75 flex items-center justify-center text-muted-foreground">
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
  const [data, setData] = useState<ProductSalesChart | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [mode, setMode] = useState<"quantity" | "sales">("quantity");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState<string | undefined>(undefined);
  const [toDate, setToDate] = useState<string | undefined>(undefined);

  const [dateMode, setDateMode] = useState<"today" | "custom">("today");

  const setThisMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date();

    setFromDate(firstDay.toISOString().slice(0, 10));
    setToDate(today.toISOString().slice(0, 10));
  };

  const getTodayISO = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  };

  // Load products once
  useEffect(() => {
    ProductService.getAll()
      .then((res) => {
        setProducts(res);
        if (res.length) setSelectedProductId(res[0].id);
      })
      .catch(console.error);
  }, []);

  // Load sales whenever product changes
  useEffect(() => {
    if (!selectedProductId) return;

    const from = dateMode === "today" ? getTodayISO() : fromDate;
    const to = dateMode === "today" ? getTodayISO() : toDate;

    ReportService.getProductSalesChart(selectedProductId, from, to)
      .then(setData)
      .catch(() =>
        setData({
          productId: selectedProductId,
          productName: "",
          totalQuantitySold: 0,
          totalSales: 0,
          sales: [],
        }),
      )
      .finally(() => setLoading(false));
  }, [selectedProductId, fromDate, toDate, dateMode]);

  return (
    <Card className="col-span-1 sm:col-span-2 lg:col-span-2">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <CardTitle>Sales per Product</CardTitle>

        {/* <Button size="sm" variant="outline" onClick={setThisMonth}>
          This Month
        </Button> */}

        <div className="flex gap-1">
          <Button
            size="sm"
            variant={dateMode === "today" ? "default" : "outline"}
            onClick={() => setDateMode("today")}
          >
            Today
          </Button>

          <Button
            size="sm"
            variant={dateMode === "custom" ? "default" : "outline"}
            onClick={() => setDateMode("custom")}
          >
            Custom
          </Button>
        </div>

        {dateMode === "custom" && (
          <div className="flex gap-2">
            <input
              type="date"
              value={fromDate ?? ""}
              onChange={(e) => setFromDate(e.target.value || undefined)}
              className="border rounded px-2 py-1 text-sm"
            />

            <input
              type="date"
              value={toDate ?? ""}
              onChange={(e) => setToDate(e.target.value || undefined)}
              className="border rounded px-2 py-1 text-sm"
            />

            {(fromDate || toDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFromDate(undefined);
                  setToDate(undefined);
                }}
              >
                Clear
              </Button>
            )}
          </div>
        )}

        <div className="flex gap-2">
          {/* Product Selector */}
          <Select
            value={selectedProductId?.toString()}
            onValueChange={(value) => setSelectedProductId(Number(value))}
          >
            <SelectTrigger className="w-50">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent className=" bg-white">
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mode Toggle */}
          <div className="flex gap-1">
            <Button
              variant={mode === "quantity" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("quantity")}
            >
              Quantity
            </Button>
            <Button
              variant={mode === "sales" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("sales")}
            >
              Sales
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="h-75 flex items-center justify-center text-muted-foreground">
            Loading…
          </div>
        ) : data ? (
          <ProductSalesChartView product={data} mode={mode} />
        ) : (
          <div className="h-75 flex items-center justify-center text-muted-foreground">
            No sales data
          </div>
        )}
      </CardContent>
    </Card>
  );
}
