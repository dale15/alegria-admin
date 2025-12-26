"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export type ProductSize = {
  id: string;
  label: string;
  priceAdjustment: number;
};

export type Product = {
  id?: string;
  name: string;
  sku: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  sizes?: ProductSize[];
};

interface Props {
  open: boolean;
  product: Product | null; // null = create
  onClose: () => void;
  onSave: (product: Product) => void;
}

const SIZE_OPTIONS = ["Small", "Medium", "Large"];

export default function ProductModal({
  open,
  product,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<Product>({
    name: "",
    sku: "",
    category: "",
    costPrice: 0,
    sellingPrice: 0,
    sizes: [],
  });

  useEffect(() => {
    if (product) {
      setForm(product);
    } else {
      setForm({
        name: "",
        sku: "",
        category: "",
        costPrice: 0,
        sellingPrice: 0,
        sizes: [],
      });
    }
  }, [product]);

  const isDrink =
    form.category.toLowerCase() === "drinks";

  const toggleSize = (label: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      sizes: checked
        ? [
            ...(prev.sizes ?? []),
            {
              id: label.toLowerCase(),
              label,
              priceAdjustment: 0,
            },
          ]
        : prev.sizes?.filter(
            (s) => s.label !== label
          ),
    }));
  };

  const updateSizePrice = (
    label: string,
    value: number
  ) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes?.map((s) =>
        s.label === label
          ? { ...s, priceAdjustment: value }
          : s
      ),
    }));
  };

  const handleSubmit = () => {
    onSave({
      ...form,
      sizes: isDrink ? form.sizes : undefined,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        {/* BASIC INFO */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>SKU</Label>
            <Input
              value={form.sku}
              onChange={(e) =>
                setForm({
                  ...form,
                  sku: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Category</Label>
            <Input
              placeholder="Drinks / Food"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Cost Price</Label>
            <Input
              type="number"
              value={form.costPrice}
              onChange={(e) =>
                setForm({
                  ...form,
                  costPrice: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <Label>Selling Price</Label>
            <Input
              type="number"
              value={form.sellingPrice}
              onChange={(e) =>
                setForm({
                  ...form,
                  sellingPrice: Number(
                    e.target.value
                  ),
                })
              }
            />
          </div>
        </div>

        {/* SIZE MODIFIER (DRINKS ONLY) */}
        {isDrink && (
          <div className="space-y-3">
            <h4 className="font-semibold">Sizes</h4>

            {SIZE_OPTIONS.map((label) => {
              const size =
                form.sizes?.find(
                  (s) => s.label === label
                );

              return (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-md border p-3"
                >
                  <Checkbox
                    checked={!!size}
                    onCheckedChange={(checked) =>
                      toggleSize(
                        label,
                        Boolean(checked)
                      )
                    }
                  />

                  <span className="w-20">
                    {label}
                  </span>

                  <Input
                    type="number"
                    placeholder="+ price"
                    disabled={!size}
                    value={
                      size?.priceAdjustment ?? ""
                    }
                    onChange={(e) =>
                      updateSizePrice(
                        label,
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
              );
            })}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {product ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
