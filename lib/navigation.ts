import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
} from "lucide-react"

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
        label: "Orders",
        href: "/orders",
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: "Product Management",
    items: [
      {
        label: "Products",
        href: "/products",
        icon: Package,
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
]