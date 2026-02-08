import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Discount } from "@/services/discount_service";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  discount: Discount[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (discount: Discount) => void;
  // onDelete: (discountId: number) => void;
}

const formatDiscountValue = (d: Discount) =>
  d.type === "percent" ? `${d.value}%` : `₱${d.value}`;

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export default function DiscountTable({
  discount,
  loading,
  onRefresh,
  onEdit,
  // onDelete,
}: Props) {
  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-100">Discount Name</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {discount.map((discount) => {
            return (
              <TableRow key={discount.id}>
                <TableCell className="max-w-100 truncate font-medium text-gray-900 dark:text-gray-100">
                  {discount.name}
                </TableCell>
                <TableCell>{formatDiscountValue(discount)}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      discount.isActive
                        ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                        : ""
                    }
                    variant={discount.isActive ? "default" : "destructive"}
                  >
                    {discount.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="z-50 bg-white">
                      <DropdownMenuItem
                        disabled={loading}
                        onClick={() => onEdit(discount)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
