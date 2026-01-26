import LowStockCard from "@/components/dashboard/low-stock-card";
import ProductSalesDashboard from "@/components/dashboard/report-chart";
import { RevenueCard } from "@/components/dashboard/revenue-card";
import RevenueChart from "@/components/dashboard/revenue-chart";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="sm:col-span-4">
        <RevenueCard />
      </div>

      <LowStockCard />

      <RevenueChart />

      <ProductSalesDashboard />
    </div>
  );
}
