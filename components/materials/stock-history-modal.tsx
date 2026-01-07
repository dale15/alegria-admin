"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MaterialStockLog,
  Material,
  MaterialService,
} from "@/services/material_service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  open: boolean;
  material: Material | null;
  onClose: () => void;
}

export default function StockHistoryModal({ open, material, onClose }: Props) {
  const [logs, setLogs] = useState<MaterialStockLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !material) return;

    const loadHistory = async () => {
      setLoading(true);
      const data = await MaterialService.getStockLogs(material.id);
      setLogs(data);
      setLoading(false);
    };

    loadHistory();
  }, [open, material]);

  if (!material) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Stock History – {material.name}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No stock history available
          </p>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, idx) => {
                const isAdd = log.quantityChange > 0;

                return (
                  <TableRow key={idx}>
                    <TableCell>
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>

                    <TableCell
                      className={
                        isAdd
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {isAdd ? "+" : ""}
                      {log.quantityChange}
                    </TableCell>

                    <TableCell>{log.reason}</TableCell>

                    <TableCell>{log.referenceType || "-"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
