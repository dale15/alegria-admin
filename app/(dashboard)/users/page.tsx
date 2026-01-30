"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Employee Management</h2>
          <p className="text-muted-foreground">Manage Employees</p>
        </div>

        <Button onClick={() => setOpen(true)}>Add Employee</Button>
      </div>
    </div>
  );
}
