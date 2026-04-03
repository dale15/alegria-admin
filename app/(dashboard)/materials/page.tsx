"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Material, MaterialService } from "@/services/material_service";
import MaterialsTable from "@/components/materials/materials-table";
import MaterialModal from "@/components/materials/materials-modal";

export default function MaterialsPage() {
  const [open, setOpen] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExport = async () => {
    const blob = await MaterialService.exportMaterials();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "materials.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    try {
      const result = await MaterialService.importMaterial(file);

      if (result.failed > 0) {
        console.warn("Import errors:", result.errors);
        alert(
          `Imported ${result.success} materials\n` + `${result.failed} failed`,
        );
      } else {
        alert(`Successfully imported ${result.success} materials`);
      }

      await loadMaterials();
    } catch (e) {
      console.error(e);
      alert("Import failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Materials</h2>
          <p className="text-muted-foreground">
            Manage raw materials and inventory levels
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Add Material</Button>

          <Button onClick={handleExport}>Export</Button>

          <label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                handleImport(file);
                e.target.value = ""; // allow re-upload same file
              }}
            />

            <Button onClick={() => fileInputRef.current?.click()}>
              Import
            </Button>
          </label>
        </div>
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
