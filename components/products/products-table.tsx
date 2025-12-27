import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/services/product_service";

interface Props {
  products: Product[];
  loading: boolean;
  onRefresh: () => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

export const formatCurrency = (value: number) =>
  value.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const getProfitMargin = (selling: number, cost: number) => {
  if (selling === 0) return 0;
  return ((selling - cost) / selling) * 100;
};

export const getMarginColor = (margin: number) => {
  if (margin < 0) return "text-red-600";
  if (margin >= 50) return "text-green-600";
  return "text-yellow-600";
};

export const getMarginBadge = (margin: number) => {
  if (margin < 0)
    return { label: "Loss", className: "bg-red-100 text-red-700" };

  if (margin >= 50)
    return { label: "High", className: "bg-green-100 text-green-700" };

  if (margin >= 20)
    return { label: "Medium", className: "bg-yellow-100 text-yellow-700" };

  return { label: "Low", className: "bg-gray-100 text-gray-700" };
};

export default function ProductsTable({
  products,
  loading,
  onRefresh,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Cost Price</TableHead>
            <TableHead>Selling Price</TableHead>
            <TableHead>Profit Margin</TableHead>
            <TableHead>Modifiers</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => {
            const margin = getProfitMargin(
              product.sellingPrice,
              product.costPrice
            );
            const badge = getMarginBadge(margin);

            return (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>

                <TableCell className="font-mono text-sm">
                  {product.sku}
                </TableCell>

                <TableCell>{product.categoryName}</TableCell>

                <TableCell>₱{formatCurrency(product.costPrice)}</TableCell>

                <TableCell className="font-semibold">
                  ₱{formatCurrency(product.sellingPrice)}
                </TableCell>

                <TableCell className={getMarginColor(margin)}>
                  {getProfitMargin(
                    product.sellingPrice,
                    product.costPrice
                  ).toFixed(2)}
                  %
                  <span
                    className={`px-2 py-1 ml-5 rounded text-xs font-medium ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </TableCell>

                <TableCell>
                  {product.modifiers?.length ? (
                    <Badge variant="secondary">
                      {product.modifiers.length} groups
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="z-50 bg-white">
                      <DropdownMenuItem onClick={() => onView(product)}>
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={loading}
                        onClick={() => onEdit(product)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete(product.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}

          {products.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground"
              >
                No products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
