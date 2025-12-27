import { apiFetch } from "@/lib/api";

export type ProductModifierOption = {
  id: number;
  name: string;
  priceAdjustment: number;
};

export type ProductModifier = {
  id: number;
  name: string;
  isRequired: boolean;
  isMultiple: boolean;
  options: ProductModifierOption[];
};

export type Product = {
  id: number;
  name: string;
  sku: string;
  categoryId: number;
  categoryName: string;
  costPrice: number;
  sellingPrice: number;
  modifiers: ProductModifier[];
};

/* WRITE MODELS */
export type SaveProductRequest = {
  name: string;
  sku: string;
  categoryId: number;
  costPrice: number;
  sellingPrice: number;
};

export type CreateProductModifierRequest = {
  name: string;
  isRequired: boolean;
  isMultiple: boolean;
  options: {
    name: string;
    priceAdjustment: number;
  }[];
};

export const ProductService = {
  getAll: () => apiFetch<Product[]>("/api/Products"),

  getProductById: (id: number) => apiFetch<Product>(`/api/products/${id}`),

  create: (dto: SaveProductRequest) =>
    apiFetch<Product>("/api/Products/addProducts", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  createProductModifiers: (
    productId: number,
    modifiers: CreateProductModifierRequest
  ) =>
    apiFetch<void>(`/api/products/${productId}/modifiers`, {
      method: "POST",
      body: JSON.stringify(modifiers),
    }),

  update: (
    id: number,
    dto: {
      name: string;
      sku: string;
      categoryId: number;
      costPrice: number;
      sellingPrice: number;
    }
  ) =>
    apiFetch(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    }),

  delete: (productId: number) =>
    apiFetch<void>(`/api/products/${productId}`, {
      method: "DELETE",
    }),

  deleteProductModifiers: (productId: number) =>
    apiFetch<void>(`/api/products/${productId}/modifiers`, {
      method: "DELETE",
    }),
};
