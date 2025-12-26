

export type ProductSize = {
  id: string;
  label: string; // Small, Medium, Large
  priceAdjustment: number;
};

export type Product = {
  id?: string;
  name: string;
  sku: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  sizes?: ProductSize[]; // 👈 drinks only
};