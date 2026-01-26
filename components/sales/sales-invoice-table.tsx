import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SalesInvoice } from "@/services/sales_invoice_service";
import { useState } from "react";

interface Props {
  salesInvoice: SalesInvoice[];
  loading: boolean;
  onRefresh: () => void;
  onView: (invoice: SalesInvoice) => void;
}

export default function SalesInvoiceTable({
  salesInvoice,
  loading,
  onView,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead className="text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                Loading Sales Invoices...
              </TableCell>
            </TableRow>
          )}

          {!loading && salesInvoice.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No material found.
              </TableCell>
            </TableRow>
          )}

          {salesInvoice.map((invoice) => {
            return (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>
                  {new Date(invoice.invoiceDate).toLocaleDateString()}
                </TableCell>
                <TableCell>₱ {invoice.totalAmount.toFixed(2)}</TableCell>
                <TableCell className="text-left">
                  {" "}
                  <Button
                    className="mr-5"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      onView(invoice);
                      setOpen(true);
                    }}
                  >
                    View Invoice
                  </Button>{" "}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
