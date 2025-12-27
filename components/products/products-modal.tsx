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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Product,
  ProductModifier,
  ProductModifierOption,
  ProductService,
} from "@/services/product_service";
import { Category, CategoryService } from "@/services/category_service";

interface Props {
  open: boolean;
  product: Product | null; // null = create
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductModal({
  open,
  product,
  onClose,
  onSaved,
}: Props) {
  const isEdit = !!product;

  const [name, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [costPrice, setCostPrice] = useState<number | "">("");
  const [sellingPrice, setSellingPrice] = useState<number | "">("");
  const [modifiers, setModifiers] = useState<ProductModifier[]>([]);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
    if (product) {
      setProductName(product.name);
      setSku(product.sku);
      setCostPrice(product.costPrice);
      setSellingPrice(product.sellingPrice);
      setModifiers(product.modifiers ?? []);
      setCategoryId(product.categoryId); // 👈 important
    } else {
      setProductName("");
      setSku("");
      setCostPrice(0);
      setSellingPrice(0);
      setModifiers([]);
    }
  }, [product, open]);

  useEffect(() => {
    if (!open) return;

    CategoryService.getAll().then(setCategories);
  }, [open]);

  const addModifier = () => {
    setModifiers([
      ...modifiers,
      {
        id: 0,
        name: "",
        isRequired: false,
        isMultiple: false,
        options: [],
      },
    ]);
  };

  const updateModifier = (
    index: number,
    field: keyof ProductModifier,
    value: any
  ) => {
    const updated = [...modifiers];
    updated[index] = { ...updated[index], [field]: value };
    setModifiers(updated);
  };

  const removeModifier = (index: number) => {
    setModifiers(modifiers.filter((_, i) => i !== index));
  };

  const addOption = (modifierIndex: number) => {
    const updated = [...modifiers];
    updated[modifierIndex].options.push({
      id: 0,
      name: "",
      priceAdjustment: 0,
    });
    setModifiers(updated);
  };

  const updateOption = (
    modifierIndex: number,
    optionIndex: number,
    field: keyof ProductModifierOption,
    value: any
  ) => {
    const updated = [...modifiers];
    updated[modifierIndex].options[optionIndex] = {
      ...updated[modifierIndex].options[optionIndex],
      [field]: value,
    };
    setModifiers(updated);
  };

  const removeOption = (modifierIndex: number, optionIndex: number) => {
    const updated = [...modifiers];
    updated[modifierIndex].options.splice(optionIndex, 1);
    setModifiers(updated);
  };

  const handleSave = async () => {
    try {
      if (!categoryId) {
        alert("Please select a category");
        return;
      }

      setSaving(true);

      if (isEdit && product) {
        await ProductService.update(product.id, {
          name,
          sku,
          categoryId,
          costPrice: Number(costPrice),
          sellingPrice: Number(sellingPrice),
        });

        await ProductService.deleteProductModifiers(product.id);

        for (const m of modifiers) {
          await ProductService.createProductModifiers(product.id, {
            name: m.name,
            isRequired: m.isRequired,
            isMultiple: m.isMultiple,
            options: m.options.map((o) => ({
              name: o.name,
              priceAdjustment: o.priceAdjustment,
            })),
          });
        }
      } else {
        const result = await ProductService.create({
          name,
          sku,
          categoryId,
          costPrice: Number(costPrice),
          sellingPrice: Number(sellingPrice),
        });

        const productId = result.id;

        if (modifiers.length > 0) {
          for (const m of modifiers) {
            await ProductService.createProductModifiers(productId, {
              name: m.name,
              isRequired: m.isRequired,
              isMultiple: m.isMultiple,
              options: m.options.map((o) => ({
                name: o.name,
                priceAdjustment: o.priceAdjustment,
              })),
            });
          }
        }
      }

      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        {/* BASIC INFO */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-3">Name</Label>
            <Input
              value={name}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div>
            <Label className="mb-3">Category</Label>
            <Select
              value={categoryId?.toString()}
              onValueChange={(val) => setCategoryId(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent className="bg-white w-full">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-3">SKU</Label>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} />
          </div>

          <div>
            <Label className="mb-3">Cost Price</Label>
            <Input
              type="number"
              value={costPrice}
              placeholder="Cost price"
              onChange={(e) =>
                setCostPrice(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </div>

          <div>
            <Label className="mb-3">Selling Price</Label>
            <Input
              type="number"
              value={sellingPrice}
              placeholder="Selling price"
              onChange={(e) =>
                setSellingPrice(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </div>
        </div>

        {/* MODIFIERS */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Modifiers</h3>
            <Button size="sm" onClick={addModifier}>
              Add Modifier
            </Button>
          </div>

          {modifiers.map((modifier, mIndex) => (
            <div key={mIndex} className="border rounded p-4 space-y-3">
              <div className="flex gap-3">
                <Input
                  placeholder="Modifier name (Size, Add-ons)"
                  value={modifier.name}
                  onChange={(e) =>
                    updateModifier(mIndex, "name", e.target.value)
                  }
                />

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeModifier(mIndex)}
                >
                  Remove
                </Button>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={modifier.isRequired}
                    onCheckedChange={(v) =>
                      updateModifier(mIndex, "isRequired", v)
                    }
                  />
                  Required
                </label>

                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={modifier.isMultiple}
                    onCheckedChange={(v) =>
                      updateModifier(mIndex, "isMultiple", v)
                    }
                  />
                  Multiple
                </label>
              </div>

              {/* OPTIONS */}
              <div className="space-y-2">
                {modifier.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex gap-2">
                    <Input
                      placeholder="Option name"
                      value={option.name}
                      onChange={(e) =>
                        updateOption(mIndex, oIndex, "name", e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={option.priceAdjustment}
                      onChange={(e) =>
                        updateOption(
                          mIndex,
                          oIndex,
                          "priceAdjustment",
                          +e.target.value
                        )
                      }
                    />
                    <Button
                      variant="ghost"
                      onClick={() => removeOption(mIndex, oIndex)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addOption(mIndex)}
                >
                  Add Option
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
