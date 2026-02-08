import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
} from "lucide-react";

export const navGroups = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
      {
        label: "Sales",
        href: "/sales",
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: "Inventory Management",
    items: [
      {
        label: "Materials",
        href: "/materials",
        icon: Package,
      },
    ],
  },
  {
    title: "Product Management",
    items: [
      {
        label: "Products",
        icon: Package,
        children: [
          {
            label: "All Products",
            href: "/products",
          },
          {
            label: "Discounts",
            href: "/products/discounts",
          },
        ],
      },
      {
        label: "Categories",
        href: "/categories",
        icon: Tags,
      },
    ],
  },
  {
    title: "Employee Management",
    items: [
      {
        label: "Users",
        href: "/users",
        icon: Users,
      },
    ],
  },
];
