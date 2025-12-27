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
            <TableHead>Cost</TableHead>
            <TableHead>Selling</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Modifiers</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => {
            const profit = product.sellingPrice - product.costPrice;

            return (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>

                <TableCell className="font-mono text-sm">
                  {product.sku}
                </TableCell>

                <TableCell>{product.categoryName}</TableCell>

                <TableCell>₱{product.costPrice.toLocaleString()}</TableCell>

                <TableCell className="font-semibold">
                  ₱{product.sellingPrice.toLocaleString()}
                </TableCell>

                <TableCell
                  className={profit >= 0 ? "text-green-600" : "text-red-600"}
                >
                  ₱{profit.toLocaleString()}
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
