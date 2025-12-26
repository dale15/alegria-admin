"use client";

import { Button } from "@/components/ui/button";
import CategoryTable from "@/components/categories/category-table";
import CategoryModal from "@/components/categories/category-modal";
import { useState, useEffect } from "react";
import { Category, CategoryService } from "@/services/category_service";

export default function CategoriesPage() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getAll();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Categories</h2>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>

        <Button onClick={() => setOpen(true)}>Add Category</Button>
      </div>

      <CategoryTable
        categories={categories}
        loading={loading}
        onRefresh={loadCategories}
      />

      {/* Add Modal */}
      <CategoryModal
        open={open}
        category={null}
        onClose={() => setOpen(false)}
        onSaved={() => {
          setOpen(false);
          loadCategories();
        }}
      />
    </div>
  );
}
