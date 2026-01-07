"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MaterialService } from "@/services/material_service";

type LowStockMaterial = {
  id: number;
  name: string;
  currentStock: number;
  lowStockThreshold: number;
};

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export default function LowStockCard() {
  const [materials, setMaterials] = useState<LowStockMaterial[]>([]);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      const data = await MaterialService.getLowStockMaterials();
      if (!ignore) setMaterials(data);
    };

    fetchData();

    const interval = setInterval(fetchData, REFRESH_INTERVAL_MS);

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  // 🔥 Severity calculation
  const hasCritical = materials.some((m) => m.currentStock === 0);
  const hasWarning = materials.some(
    (m) => m.currentStock > 0 && m.currentStock <= m.lowStockThreshold
  );

  const severityColor = hasCritical
    ? "border-red-500"
    : hasWarning
    ? "border-yellow-400"
    : "border-green-500";

  const badgeColor = hasCritical
    ? "text-red-600"
    : hasWarning
    ? "text-yellow-600"
    : "text-green-600";

  return (
    <Card className={`h-fit border-l-4 ${severityColor}`}>
      <CardContent className="p-4 space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">📦 Low Stock</h3>
          <span className={`text-xs font-semibold ${badgeColor}`}>
            {materials.length}
          </span>
        </div>

        {/* Body */}
        {materials.length === 0 ? (
          <p className="text-xs text-green-600">All stocked</p>
        ) : (
          <>
            <ul className="text-xs space-y-1">
              {materials.slice(0, 2).map((m) => {
                const isCritical = m.currentStock === 0;

                return (
                  <li key={m.id} className="flex justify-between">
                    <span className="truncate">{m.name}</span>
                    <span
                      className={
                        isCritical
                          ? "text-red-600 font-semibold"
                          : "text-yellow-600 font-semibold"
                      }
                    >
                      {m.currentStock}
                    </span>
                  </li>
                );
              })}
            </ul>

            {materials.length > 2 && (
              <p className="text-[11px] text-muted-foreground">
                +{materials.length - 2} more
              </p>
            )}

            <Link
              href="/materials"
              className="text-xs text-primary hover:underline"
            >
              View materials →
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
