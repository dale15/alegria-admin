import {apiFetch} from '@/lib/api';

export type Category =  {
    id: number;
    name: string;
    description: string;
}

export type CreateCategoryDto = {
    name: string;
    description: string;
}

export const CategoryService = {
    getAll: () => apiFetch<Category[]>('/api/Categories'),

    getCategoryById: (id: number) => apiFetch<Category>(`/api/categories/${id}`),

    create: (dto: CreateCategoryDto) =>
    apiFetch<Category>("/api/Categories/createCategory", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  update: (id: number, dto: CreateCategoryDto) =>
    apiFetch(`/api/Categories/updateCategory/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    }),

  remove: (id: number) =>
    apiFetch(`/api/Categories/${id}`, {
      method: "DELETE",
    }),
}