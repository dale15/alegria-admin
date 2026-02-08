"use client";

import ProductModal from "@/components/products/products-modal";
import ProductsTable from "@/components/products/products-table";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Product, ProductService } from "@/services/product_service";
import ProductViewModal from "@/components/products/productsView-modal";
import ProductsDeleteDialog from "@/components/products/productsDelete-dialog";

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getAll();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    setDeleteId(productId);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    await ProductService.delete(deleteId);

    setDeleteOpen(false);
    setDeleteId(null);
    loadProducts();
  };

  const handleExport = async () => {
    const blob = await ProductService.export();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    try {
      const result = await ProductService.import(file);

      if (result.failed > 0) {
        console.warn("Import errors:", result.errors);
        alert(
          `Imported ${result.success} products\n` + `${result.failed} failed`,
        );
      } else {
        alert(`Successfully imported ${result.success} products`);
      }
    } catch (e) {
      console.error(e);
      alert("Import failed");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-muted-foreground">Manage Products</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Add Product</Button>
          <Button onClick={handleExport}>Export</Button>

          <label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                handleImport(file);
                e.target.value = ""; // allow re-upload same file
              }}
            />

            <Button onClick={() => fileInputRef.current?.click()}>
              Import
            </Button>
          </label>
        </div>
      </div>

      <ProductsTable
        products={products}
        loading={loading}
        onRefresh={loadProducts}
        onView={(p) => {
          setViewProduct(p);
          setViewOpen(true);
        }}
        onEdit={(product) => {
          setSelectedProduct(product);
          setOpen(true);
        }}
        onDelete={handleDelete}
      />

      <ProductModal
        open={open}
        product={selectedProduct}
        onClose={() => {
          setOpen(false);
          setSelectedProduct(null);
        }}
        onSaved={() => {
          setOpen(false);
          setSelectedProduct(null);
          loadProducts();
        }}
      />

      <ProductViewModal
        open={viewOpen}
        product={viewProduct}
        onClose={() => {
          setViewOpen(false);
          setViewProduct(null);
        }}
      />

      <ProductsDeleteDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
