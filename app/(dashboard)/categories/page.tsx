"use client";

import { Button } from "@/components/ui/button";
import CategoryTable from "@/components/categories/category-table";
import CategoryModal from "@/components/categories/category-modal";
import { useState } from "react";

export default function CategoriesPage() {
  const [open, setOpen] = useState(false);

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

      <CategoryTable />

      {/* Add Modal */}
      <CategoryModal
        open={open}
        category={null}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
