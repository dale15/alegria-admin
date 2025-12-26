"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import CategoryModal from "./category-modal";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Category, CategoryService } from "@/services/category_service";

interface Props {
  categories: Category[];
  loading: boolean;
  onRefresh: () => void;
}

export default function CategoryTable({
  categories,
  loading,
  onRefresh,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const handleDelete = async () => {
    if (!deleteCategory) return;

    await CategoryService.remove(deleteCategory.id);
    setDeleteCategory(null);
    onRefresh(); // ✅ refresh from parent
  };

  return (
    <>
      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[20]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  Loading categories...
                </TableCell>
              </TableRow>
            )}

            {!loading && categories.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No categories found.
                </TableCell>
              </TableRow>
            )}

            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description || "—"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setSelectedCategory(category)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setDeleteCategory(category)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      <CategoryModal
        open={!!selectedCategory}
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
        onSaved={onRefresh}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteCategory}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteCategory?.name}"?`}
        confirmText="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteCategory(null)}
      />
    </>
  );
}
