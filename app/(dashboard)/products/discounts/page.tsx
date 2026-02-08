"use client";

import DiscountModal from "@/components/products/discounts/discount-modal";
import DiscountTable from "@/components/products/discounts/discounts-table";
import { Button } from "@/components/ui/button";
import { Discount, DiscountService } from "@/services/discount_service";
import { useEffect, useState } from "react";

export default function DiscountsPage() {
  const [open, setOpen] = useState(false);
  const [discount, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null,
  );

  const loadDiscounts = async () => {
    try {
      setLoading(true);
      const data = await DiscountService.getAllDiscounts();
      setDiscounts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscounts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Discounts</h2>
          <p className="text-muted-foreground">Manage Discounts</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Add Discount</Button>
        </div>
      </div>

      <DiscountTable
        discount={discount}
        loading={loading}
        onRefresh={loadDiscounts}
        onEdit={(discount) => {
          setSelectedDiscount(discount);
          setOpen(true);
        }}
        // onDelete={handleDelete}
      />

      <DiscountModal
        open={open}
        discount={selectedDiscount}
        onClose={() => {
          setOpen(false);
          setSelectedDiscount(null);
        }}
        onSaved={() => {
          setOpen(false);
          setSelectedDiscount(null);
          loadDiscounts();
        }}
      />
    </div>
  );
}
