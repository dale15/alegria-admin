"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Material, MaterialService } from "@/services/material_service";
import MaterialsTable from "@/components/materials/materials-table";
import MaterialModal from "@/components/materials/materials-modal";

export default function MaterialsPage() {
  const [open, setOpen] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const data = await MaterialService.getAll();
      setMaterials(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Materials</h2>
          <p className="text-muted-foreground">
            Manage raw materials and inventory levels
          </p>
        </div>

        <Button onClick={() => setOpen(true)}>Add Material</Button>
      </div>

      {/* Materials Table */}
      <MaterialsTable
        materials={materials}
        loading={loading}
        onRefresh={loadMaterials}
      />

      {/* Material Modal */}
      <MaterialModal
        open={open}
        material={null}
        onClose={() => setOpen(false)}
        onSaved={() => {
          setOpen(false);
          loadMaterials();
        }}
      />
    </div>
  );
}
