"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { navGroups } from "@/lib/navigation";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  // Find current page title
  const currentItem = navGroups
    .flatMap((group) => group.items)
    .find((item) => item.href === pathname);

  const pageTitle = currentItem?.label ?? "Dashboard";

  // Mock user (replace later with auth store)
  const user = {
    name: "Alegria Admin",
    email: "admin@example.com",
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <header className="flex h-14 z-50 items-center justify-between border-b bg-background px-6">
      {/* Page Title */}
      <h1 className="text-lg font-semibold">{pageTitle}</h1>

      {/* Right Section */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <span className="hidden sm:block text-sm font-medium">
              {user.name}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-50 z-50 bg-white"
        >
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem>Profile</DropdownMenuItem>

          <DropdownMenuItem className="text-red-600" onClick={logout}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
