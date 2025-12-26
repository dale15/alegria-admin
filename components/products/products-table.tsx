import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ProductModifierOption = {
  id: string;
  name: string;
  priceAdjustment: number; // + or -
};

type ProductModifierGroup = {
  id: string;
  name: string; // e.g. "Size", "Add-ons"
  required: boolean;
  multiple: boolean; // true = checkbox, false = radio
  options: ProductModifierOption[];
};

type Product = {
  id: string;
  name: string;
  category: string;
  sku: string;
  costPrice: number;
  sellingPrice: number;
  modifiers?: ProductModifierGroup[]; // 👈 drinks only
};

const products: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    category: "Electronics",
    sku: "IPH15-PRO-256",
    costPrice: 65000,
    sellingPrice: 79999,
  },
  {
    id: "2",
    name: "MacBook Air M2",
    category: "Computers",
    sku: "MBA-M2-512",
    costPrice: 60000,
    sellingPrice: 69999,
  },
];

function calculateFinalPrice(
  product: Product,
  selectedModifiers: ProductModifierOption[]
) {
  const modifiersTotal = selectedModifiers.reduce(
    (sum, mod) => sum + mod.priceAdjustment,
    0
  );

  return product.sellingPrice + modifiersTotal;
}

export default function ProductsTable() {
  const [open, setOpen] = useState(false);

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

                <TableCell>{product.category}</TableCell>

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

                    <DropdownMenuContent align="end" className="z-50">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
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
