"use client";

import ProductModal from "@/components/products/products-modal";
import ProductsTable from "@/components/products/products-table";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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

        <Button onClick={() => setOpen(true)}>Add Product</Button>
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
