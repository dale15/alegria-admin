import { apiFetch } from "@/lib/api";

export type Material = {
  id: number;
  name: string;
  unit: string; // kg, g, ml, pcs
  currentStock: number;
  lowStockThreshold: number;
  costPerUnit: number;
};

export type CreateMaterialDto = {
  name: string;
  unit: string;
  currentStock: number;
  lowStockThreshold: number;
  costPerUnit: number;
};

export type MaterialStockLog = {
  quantityChange: number;
  reason: string;
  referenceType: string;
  createdAt: string;
};

export const MaterialService = {
  getAll: () => apiFetch<Material[]>("/Materials"),

  addMaterial: (data: CreateMaterialDto) =>
    apiFetch<Material>("/Materials", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateMaterial: (id: number, data: Partial<CreateMaterialDto>) =>
    apiFetch<Material>(`/Materials/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getLowStockMaterials: () => apiFetch<Material[]>("/Materials/low-stock"),

  adjustStock: (id: number, data: { quantityChange: number; reason: string }) =>
    apiFetch<Material>(`/Materials/${id}/adjust`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getStockLogs: (id: number) =>
    apiFetch<MaterialStockLog[]>(`/Materials/${id}/stock-history`),
};
