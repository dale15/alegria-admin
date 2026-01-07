"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Material, MaterialService } from "@/services/material_service";

interface Props {
  open: boolean;
  material: Material | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function AdjustStockModal({
  open,
  material,
  onClose,
  onSaved,
}: Props) {
  const [quantity, setQuantity] = useState<number | "">("");
  const [reason, setReason] = useState("");

  if (!material) return null;

  const handleAdjust = async () => {
    if (quantity === "" || !reason) {
      alert("Quantity and reason are required");
      return;
    }

    await MaterialService.adjustStock(material.id, {
      quantityChange: Number(quantity),
      reason,
    });

    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock – {material.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="number"
            placeholder="Quantity (+ add / - remove)"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value === "" ? "" : Number(e.target.value))
            }
          />

          {/* <Button onClick={() => setQuantity(-1)}>−1</Button>
          <Button onClick={() => setQuantity(-5)}>−5</Button>
          <Button onClick={() => setQuantity(5)}>+5</Button> */}

          {Number(quantity) < 0 && (
            <p className="text-sm text-red-600">This will reduce inventory</p>
          )}

          <Input
            placeholder="Reason (Spoilage, Count, Damage)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleAdjust}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
