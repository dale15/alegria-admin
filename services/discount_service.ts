import { apiFetch } from "@/lib/api";

export type Discount = {
  id: number;
  name: string;
  type: "percent" | "fixed";
  value: number;
  isActive: boolean;
};

export type DiscountPayload = {
  name: string;
  type: "percent" | "fixed";
  value: number;
  isActive: boolean;
};

export const DiscountService = {
  getAllDiscounts: () => apiFetch<Discount[]>("/api/Discounts"),

  getDiscountById: (id: number) => apiFetch<Discount>(`/api/Discounts/${id}`),

  getActiveDiscounts: () => apiFetch<Discount>("/api/Discounts/active"),

  createDiscount: (payload: DiscountPayload) =>
    apiFetch<Discount>("/api/Discounts/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    }),

  updateDiscount: (id: number, payload: DiscountPayload) =>
    apiFetch<void>(`/api/Discounts/update-discount/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),

  deleteDiscount: (id: number) =>
    apiFetch<Discount>(`/api/Discounts/delete-discount/${id}`, {
      method: "DELETE",
    }),
};
