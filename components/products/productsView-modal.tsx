"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Product,
  ProductMaterialView,
  ProductService,
} from "@/services/product_service";

interface Props {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

export default function ProductViewModal({ open, product, onClose }: Props) {
  const [materials, setMaterials] = useState<ProductMaterialView[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  useEffect(() => {
    if (!open || !product) return;

    const loadMaterials = async () => {
      setLoadingMaterials(true);
      const data = await ProductService.getProductMaterials(product.id);
      setMaterials(data);
      setLoadingMaterials(false);
    };

    loadMaterials();
  }, [open, product]);

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>View Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* BASIC INFO */}
          <div>
            <p>
              <b>Name:</b> {product.name}
            </p>
            <p>
              <b>SKU:</b> {product.sku}
            </p>
            <p>
              <b>Category:</b> {product.categoryName}
            </p>
            <p>
              <b>Cost Price:</b> ₱{product.costPrice}
            </p>
            <p>
              <b>Selling Price:</b> ₱{product.sellingPrice}
            </p>
          </div>

          {/* MODIFIERS */}
          <div className="space-y-3">
            <h3 className="font-semibold">Modifiers</h3>

            {product.modifiers.length === 0 && (
              <p className="text-muted-foreground">No modifiers</p>
            )}

            {product.modifiers.map((modifier) => (
              <div key={modifier.id} className="border rounded p-3">
                <p className="font-medium">
                  {modifier.name}
                  {modifier.isRequired && " (Required)"}
                  {modifier.isMultiple && " (Multiple)"}
                </p>

                <ul className="ml-4 list-disc">
                  {modifier.options.map((opt) => (
                    <li key={opt.id}>
                      {opt.name}
                      {opt.priceAdjustment > 0 && ` (+₱${opt.priceAdjustment})`}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* MATERIALS USED */}
          <div className="space-y-3">
            <h3 className="font-semibold">Materials Used</h3>

            {loadingMaterials ? (
              <p className="text-muted-foreground">Loading materials...</p>
            ) : materials.length === 0 ? (
              <p className="text-muted-foreground">
                No materials assigned to this product
              </p>
            ) : (
              <div className="border rounded">
                <table className="w-full text-sm">
                  <thead className="bg-muted border-b">
                    <tr>
                      <th className="px-3 py-2 text-left">Material</th>
                      <th className="px-3 py-2 text-right">Qty / Product</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((m) => (
                      <tr
                        key={m.materialId}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-3 py-2">{m.materialName}</td>
                        <td className="px-3 py-2 text-right">
                          {m.quantityUsed}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
