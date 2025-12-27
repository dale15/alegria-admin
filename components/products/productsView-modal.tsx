"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/services/product_service";

interface Props {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

export default function ProductViewModal({ open, product, onClose }: Props) {
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
