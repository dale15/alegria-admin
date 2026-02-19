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

export type SalePayment = {
  paymentType: string;
  amount: number;
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
  payments: SalePayment[];
};

export const SalesInvoiceService = {
  getAll: () => apiFetch<SalesInvoice[]>("/sales-invoices"),

  getById: (id: number) => apiFetch<SalesInvoice>(`/sales-invoices/${id}`),
};
