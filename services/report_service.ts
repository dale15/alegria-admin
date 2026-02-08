import { apiFetch } from "@/lib/api";

export interface ProductSalesByDate {
  date: string;
  quantitySold: number;
  totalSales: number;
}

export interface ProductSalesChart {
  productId: number;
  productName: string;
  totalQuantitySold: number;
  totalSales: number;
  sales: ProductSalesByDate[];
}

export interface TopProduct {
  productId: number;
  productName: string;
  totalQuantitySold: number;
  totalSales: number;
}

export const ReportService = {
  getProductSalesChart: async (
    productId: number,
    from?: string,
    to?: string,
  ): Promise<ProductSalesChart> => {
    const params = new URLSearchParams();

    if (from) params.append("from", from);
    if (to) params.append("to", to);

    return apiFetch<ProductSalesChart>(
      `/reports/product-sales?productId=${productId}&${params.toString()}`,
    );
  },

  getTopProducts: async (
    limit = 5,
    orderBy: "sales" | "quantity" = "sales",
    from?: string,
    to?: string,
  ): Promise<TopProduct[]> => {
    const params = new URLSearchParams();

    console.log(params);

    if (from) params.append("from", from);
    if (to) params.append("to", to);

    return apiFetch<TopProduct[]>(
      `/reports/top-products?limit=${limit}&orderBy=${orderBy}&${params.toString()}`,
    );
  },
};
