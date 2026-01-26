import { apiFetch } from "@/lib/api";

export interface ProductSalesByDate {
  date: string;
  quantitySold: number;
  totalSales: number;
}

export interface ProductSalesChart {
  productId: number;
  productName: string;
  sales: ProductSalesByDate[];
}

export const ReportService = {
  getProductSalesChart: async (
    from?: string,
    to?: string,
  ): Promise<ProductSalesChart[]> => {
    const params = new URLSearchParams();

    if (from) params.append("from", from);
    if (to) params.append("to", to);

    // ✅ FIXED ENDPOINT
    return apiFetch<ProductSalesChart[]>(
      `/api/reports/product-sales?${params.toString()}`,
    );
  },
};
