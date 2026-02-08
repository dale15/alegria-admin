import { apiFetch } from "@/lib/api";

export type Category = {
  id: number;
  name: string;
  description: string;
};

export type CreateCategoryDto = {
  name: string;
  description: string;
};

export const CategoryService = {
  getAll: () => apiFetch<Category[]>("/Categories"),

  getCategoryById: (id: number) => apiFetch<Category>(`/categories/${id}`),

  create: (dto: CreateCategoryDto) =>
    apiFetch<Category>("/api/Categories/createCategory", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  update: (id: number, dto: CreateCategoryDto) =>
    apiFetch(`/Categories/updateCategory/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    }),

  remove: (id: number) =>
    apiFetch(`/Categories/${id}`, {
      method: "DELETE",
    }),
};
