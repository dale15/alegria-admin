import { useEffect, useState } from "react";
import {
  SalesInvoice,
  SalesInvoiceService,
} from "@/services/sales_invoice_service";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

type Props = {
  id: number | null;
  onClose: () => void;
};

export default function SalesInvoiceModal({ id, onClose }: Props) {
  const [invoice, setInvoice] = useState<SalesInvoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    SalesInvoiceService.getById(id)
      .then(setInvoice)
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) return null;

  const paymentMethod = invoice?.payments?.[0]?.paymentType ?? "Unknown";

  const paymentColors: Record<string, string> = {
    Cash: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    GCash: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    Card: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        {loading || !invoice ? (
          <div className="p-8 text-center">Loading invoice…</div>
        ) : (
          <div className="p-6 space-y-6">
            {/* ===== Header ===== */}
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold">
                    {invoice.invoiceNumber}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(invoice.invoiceDate).toLocaleString()}
                  </p>
                </div>

                <Badge
                  className={`text-sm ${paymentColors[paymentMethod] ?? "bg-gray-100 text-gray-700"}`}
                >
                  PAID in {paymentMethod}
                </Badge>
              </div>
            </DialogHeader>

            <Separator />

            {/* ===== Items Table ===== */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Price</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{item.productName}</td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-right">
                        ₱{item.unitPrice.toFixed(2)}
                      </td>
                      <td className="p-2 text-right">
                        ₱{item.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ===== Totals ===== */}
            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₱{invoice.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₱{invoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-red-500">
                    -₱{invoice.discount.toFixed(2)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>₱{invoice.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* ===== Footer Actions ===== */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => window.print()}>Print Invoice</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
