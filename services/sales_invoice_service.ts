import { apiFetch } from "@/lib/api";

export type SaleModifier = {
  modifierName: number;
  optionName: string;
  priceAdjustment: number;
};

export type SaleItem = {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  modifiers: SaleModifier[];
};

export type SalesInvoice = {
  id: number;
  invoiceNumber: string;
  invoiceDate: string; // ISO string from backend
  subTotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  items: SaleItem[];
};

export const SalesInvoiceService = {
  getAll: () => apiFetch<SalesInvoice[]>("/api/sales-invoices"),

  getById: (id: number) => apiFetch<SalesInvoice>(`/api/sales-invoices/${id}`),
};
