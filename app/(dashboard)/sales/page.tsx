"use client";

import { useEffect, useState } from "react";
import {
  SalesInvoice,
  SalesInvoiceService,
} from "@/services/sales_invoice_service";
import SalesInvoiceTable from "@/components/sales/sales-invoice-table";
import SalesInvoiceModal from "@/components/sales/sales-invoice-modal";

export default function SalesInvoicePage() {
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null,
  );

  const loadSalesInvoices = async () => {
    try {
      setLoading(true);
      const data = await SalesInvoiceService.getAll();
      setInvoices(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalesInvoices();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sales Invoices</h2>
          <p className="text-muted-foreground">
            Manage sales invoices and related transactions
          </p>
        </div>
      </div>

      <SalesInvoiceTable
        salesInvoice={invoices}
        loading={loading}
        onRefresh={loadSalesInvoices}
        onView={(invoice) => {
          setSelectedInvoiceId(invoice.id);
        }}
      />

      <SalesInvoiceModal
        id={selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
      />
    </div>
  );
}
