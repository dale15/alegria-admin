"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navGroups } from "@/lib/navigation";


export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-background z-40">
      <div className="p-4 text-lg font-bold">Welcome to Alegria</div>

      <nav className="space-y-6 px-2 pt-6">
        {navGroups.map((group) => {
          const isGroupActive = group.items.some(
            (item) => pathname === item.href
          );

          return (
            <div key={group.title}>
              <p
                className={cn(
                  "px-3 mb-2 text-xs font-semibold uppercase",
                  isGroupActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
