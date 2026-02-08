import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Discount, DiscountService } from "@/services/discount_service";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  discount: Discount | null;
  onClose: () => void;
  onSaved: () => void;
}

type DiscountForm = {
  name: string;
  type: "percent" | "fixed";
  value: number;
  isActive: boolean;
};

const emptyForm: DiscountForm = {
  name: "",
  type: "percent",
  value: 0,
  isActive: true,
};

export default function DiscountModal({
  open,
  discount,
  onClose,
  onSaved,
}: Props) {
  const isEdit = !!discount;
  const [form, setForm] = useState<DiscountForm>(emptyForm);

  useEffect(() => {
    if (!open) return;

    if (discount) {
      setForm({
        name: discount.name,
        type: discount.type,
        value: discount.value,
        isActive: discount.isActive,
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, discount]);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    if (form.type === "percent" && (form.value <= 0 || form.value > 100)) {
      return;
    }
    if (form.type === "fixed" && form.value <= 0) return;

    const payload = {
      name: form.name,
      type: form.type,
      value: form.value,
      isActive: form.isActive,
    };

    if (isEdit && discount) {
      await DiscountService.updateDiscount(discount.id, payload);
    } else {
      await DiscountService.createDiscount(payload);
    }

    onSaved(); // refresh list in parent
    onClose(); // close modal
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Discount" : "Add Discount"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-sm font-medium">Type</label>
            <Select
              value={form.type}
              onValueChange={(val) => {
                if (val === "percent" || val === "fixed") {
                  setForm((f) => ({ ...f, type: val }));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="percent">Percent</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Value */}
          <div>
            <label className="text-sm font-medium">
              Value {form.type === "percent" && "(%)"}
            </label>
            <Input
              type="number"
              value={form.value}
              onChange={(e) =>
                setForm((f) => ({ ...f, value: Number(e.target.value) }))
              }
            />
          </div>

          {/* Active */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active</span>
            <Switch
              checked={form.isActive}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, isActive: checked }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSave}>{isEdit ? "Update" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
