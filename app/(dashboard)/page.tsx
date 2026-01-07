import LowStockCard from "@/components/dashboard/low-stock-card";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <LowStockCard />
      {/* other small cards */}
    </div>
  );
}
