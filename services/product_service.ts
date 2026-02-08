import { apiFetch, apiFetchBlob } from "@/lib/api";

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
  imageUrl: string;
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

export type ProductMaterialForm = {
  materialId: number;
  quantityUsed: number | "";
};

export type MaterialOption = {
  id: number;
  name: string;
  unit: string;
};

export type ProductMaterialView = {
  materialId: number;
  materialName: string;
  quantityUsed: number;
};

export type ProductImportError = {
  row: number;
  message: string;
};

export type ProductImportResult = {
  success: number;
  failed: number;
  errors: ProductImportError[];
};

export const ProductService = {
  getAll: () => apiFetch<Product[]>("/api/Products"),

  getProductById: (id: number) => apiFetch<Product>(`/api/products/${id}`),

  create: (formData: FormData) =>
    apiFetch<Product>("/api/Products/addProducts", {
      method: "POST",
      body: formData,
    }),

  createProductModifiers: (
    productId: number,
    modifiers: CreateProductModifierRequest,
  ) =>
    apiFetch<void>(`/api/Products/${productId}/modifiers`, {
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
    },
  ) =>
    apiFetch(`/api/Products/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    }),

  delete: (productId: number) =>
    apiFetch<void>(`/api/Products/${productId}`, {
      method: "DELETE",
    }),

  deleteProductModifiers: (productId: number) =>
    apiFetch<void>(`/api/Products/${productId}/modifiers`, {
      method: "DELETE",
    }),

  getProductMaterials: (productId: number) =>
    apiFetch<ProductMaterialView[]>(`/api/Products/${productId}/materials`),

  setProductMaterials: (productId: number, materials: ProductMaterialForm[]) =>
    apiFetch<void>(`/api/Products/${productId}/materials`, {
      method: "POST",
      body: JSON.stringify(materials),
    }),

  export: () =>
    apiFetchBlob(`/api/Products/export`, {
      method: "GET",
    }),

  import: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiFetch<ProductImportResult>(`/api/Products/import`, {
      method: "POST",
      body: formData,
    });
  },
};
