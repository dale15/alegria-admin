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
  ProductMaterialForm,
  MaterialOption,
} from "@/services/product_service";
import { Category, CategoryService } from "@/services/category_service";
import { MaterialService } from "@/services/material_service";

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

  const [materials, setMaterials] = useState<ProductMaterialForm[]>([]);
  const [materialOptions, setMaterialOptions] = useState<MaterialOption[]>([]);

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
      setCostPrice("");
      setSellingPrice("");
      setModifiers([]);
    }
  }, [product, open]);

  useEffect(() => {
    if (!open) return;

    CategoryService.getAll().then(setCategories);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const loadMaterials = async () => {
      const allMaterials = await MaterialService.getAll();
      setMaterialOptions(allMaterials);

      if (product) {
        const recipe = await ProductService.getProductMaterials(product.id);
        setMaterials(
          recipe.map((r) => ({
            materialId: r.materialId,
            quantityUsed: r.quantityUsed,
          }))
        );
      } else {
        setMaterials([]);
      }
    };

    loadMaterials();
  }, [open, product]);

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

      const invalidRecipe = materials.some(
        (m) =>
          m.materialId === 0 ||
          m.quantityUsed === "" ||
          Number(m.quantityUsed) <= 0
      );

      if (invalidRecipe) {
        alert("Please complete all material entries");
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

        await ProductService.setProductMaterials(
          product.id,
          materials.map((m) => ({
            materialId: m.materialId,
            quantityUsed: Number(m.quantityUsed),
          }))
        );
      } else {
        const result = await ProductService.create({
          name,
          sku,
          categoryId,
          costPrice: Number(costPrice),
          sellingPrice: Number(sellingPrice),
        });

        const productId = result.id;

        if (materials.length > 0) {
          await ProductService.setProductMaterials(
            productId,
            materials.map((m) => ({
              materialId: m.materialId,
              quantityUsed: Number(m.quantityUsed),
            }))
          );
        }

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
      <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] flex flex-col">
        <DialogHeader className="border-b pb-3">
          <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {/* BASIC INFO */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-3">Name</Label>
              <Input
                value={name}
                placeholder="Product Name"
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-3">Category</Label>
              <Select
                value={categoryId?.toString()}
                onValueChange={(val) => setCategoryId(Number(val))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent className="bg-white w-full">
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-3">SKU</Label>
              <Input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SKU"
              />
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

          {/* MATERIALS USED (RECIPE) */}
          <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Materials Used</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setMaterials((prev) => [
                    ...prev,
                    { materialId: 0, quantityUsed: "" },
                  ])
                }
              >
                Add Material
              </Button>
            </div>

            {materials.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No materials assigned to this product
              </p>
            )}

            {materials.map((row, index) => {
              const selectedMaterial = materialOptions.find(
                (m) => m.id === row.materialId
              );

              return (
                <div key={index} className="border rounded p-4 space-y-3">
                  {/* Material Select */}
                  <div className="flex gap-3 items-center">
                    <Select
                      value={row.materialId?.toString()}
                      onValueChange={(val) => {
                        const materialId = Number(val);
                        setMaterials((prev) =>
                          prev.map((r, i) =>
                            i === index ? { ...r, materialId } : r
                          )
                        );
                      }}
                    >
                      <SelectTrigger className="w-37">
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {materialOptions.map((m) => (
                          <SelectItem key={m.id} value={m.id.toString()}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Quantity */}
                    <Input
                      type="number"
                      placeholder="Qty"
                      className="w-25"
                      value={row.quantityUsed}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? "" : Number(e.target.value);

                        setMaterials((prev) =>
                          prev.map((r, i) =>
                            i === index ? { ...r, quantityUsed: value } : r
                          )
                        );
                      }}
                    />

                    {/* Unit */}
                    <span className="text-sm text-muted-foreground w-10">
                      {selectedMaterial?.unit ?? ""}
                    </span>

                    {/* Remove */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() =>
                        setMaterials((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="border-t pt-3">
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
