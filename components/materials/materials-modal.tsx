"use client";

import { useEffect, useState } from "react";
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

export default function MaterialModal({
  open,
  material,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    unit: "",
    currentStock: "" as number | "",
    lowStockThreshold: "" as number | "",
    costPerUnit: "" as number | "",
  });

  useEffect(() => {
    if (material) {
      setForm(material);
    } else {
      setForm({
        name: "",
        unit: "",
        currentStock: "",
        lowStockThreshold: "",
        costPerUnit: "",
      });
    }
  }, [material]);

  const handleChange = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.unit) {
      alert("Name and unit are required");
      return;
    }

    const payload = {
      name: form.name,
      unit: form.unit,
      currentStock: form.currentStock === "" ? 0 : Number(form.currentStock),
      lowStockThreshold:
        form.lowStockThreshold === "" ? 0 : Number(form.lowStockThreshold),
      costPerUnit: form.costPerUnit === "" ? 0 : Number(form.costPerUnit),
    };

    if (material) {
      await MaterialService.updateMaterial(material.id, payload);
    } else {
      await MaterialService.addMaterial(payload);
    }

    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {material ? "Edit Material" : "Add Material"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Material name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <Input
            placeholder="Unit (kg, g, ml, pcs)"
            value={form.unit}
            onChange={(e) => handleChange("unit", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Current Stock"
            value={form.currentStock}
            onChange={(e) =>
              handleChange(
                "currentStock",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />
          <Input
            type="number"
            placeholder="Reorder level"
            value={form.lowStockThreshold}
            onChange={(e) =>
              handleChange(
                "lowStockThreshold",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />
          <Input
            type="number"
            placeholder="Cost per unit"
            value={form.costPerUnit}
            onChange={(e) =>
              handleChange(
                "costPerUnit",
                e.target.value === "" ? "" : parseFloat(e.target.value)
              )
            }
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
