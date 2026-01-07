"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Material } from "@/services/material_service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AdjustStockModal from "./adjust-stock-modal";
import StockHistoryModal from "./stock-history-modal";

interface Props {
  materials: Material[];
  loading: boolean;
  onRefresh: () => void;
}

export default function MaterialsTable({
  materials,
  loading,
  onRefresh,
}: Props) {
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selected, setSelected] = useState<Material | null>(null);

  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Reorder Level</TableHead>
            <TableHead>Cost per Unit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                Loading materials...
              </TableCell>
            </TableRow>
          )}

          {!loading && materials.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No material found.
              </TableCell>
            </TableRow>
          )}

          {materials.map((m) => {
            const isLow = m.currentStock <= m.lowStockThreshold;

            return (
              <TableRow key={m.id} className="border-b">
                <TableCell className="px-4 py-4 font-medium">
                  {m.name}
                </TableCell>
                <TableCell>{m.unit}</TableCell>
                <TableCell
                  className={isLow ? "text-red-600 font-semibold" : ""}
                >
                  {m.currentStock}
                </TableCell>
                <TableCell>{m.lowStockThreshold}</TableCell>
                <TableCell>₱{m.costPerUnit}</TableCell>
                <TableCell>
                  {isLow ? (
                    <Badge variant="destructive">Low</Badge>
                  ) : (
                    <Badge variant="secondary">OK</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    className="mr-5"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSelected(m);
                      setAdjustOpen(true);
                    }}
                  >
                    Adjust Stock
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSelected(m);
                      setHistoryOpen(true);
                    }}
                  >
                    View History
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <AdjustStockModal
        open={adjustOpen}
        material={selected}
        onClose={() => setAdjustOpen(false)}
        onSaved={() => {
          setAdjustOpen(false);
          onRefresh(); // reload materials
        }}
      />

      <StockHistoryModal
        open={historyOpen}
        material={selected}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}
