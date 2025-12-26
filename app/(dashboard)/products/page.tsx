"use client";

import ProductModal from "@/components/products/products-modal";
import ProductsTable from "@/components/products/products-table";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { useState } from "react";

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-muted-foreground">Manage Products</p>
        </div>

        <Button onClick={() => setOpen(true)}>Add Product</Button>
      </div>
      <ProductsTable />
      <ProductModal
        open={open}
        product={selectedProduct}
        onClose={() => {
          setOpen(false);
          setSelectedProduct(null);
        }}
        onSave={(product) => {
          console.log(product);
          // TODO: call API
        }}
      />
      ;
    </div>
  );
}
