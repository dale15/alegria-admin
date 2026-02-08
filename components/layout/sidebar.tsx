"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navGroups } from "@/lib/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  return (
    <aside className="w-64 border-r bg-background z-40">
      <div className="p-4 text-lg font-bold">Welcome to Alegria</div>

      <nav className="space-y-6 px-2 pt-6">
        {navGroups.map((group) => {
          const isGroupActive = group.items.some(
            (item) => pathname === item.href,
          );

          return (
            <div key={group.title}>
              <p
                className={cn(
                  "px-3 mb-2 text-xs font-semibold uppercase",
                  isGroupActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  const isActive = item.href
                    ? pathname === item.href
                    : item.children?.some((c) => pathname === c.href);

                  // SUBMENU ITEM
                  if (item.children) {
                    const routeMatch = item.children.some((c) =>
                      pathname.startsWith(c.href),
                    );

                    const isOpen = openSubmenus[item.label] ?? routeMatch;

                    return (
                      <div key={item.label}>
                        <div
                          onClick={() =>
                            setOpenSubmenus(
                              isOpen ? {} : { [item.label]: true },
                            )
                          }
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium cursor-pointer transition",
                            isOpen ? "bg-muted" : "hover:bg-muted",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}

                          <span
                            className={cn(
                              "ml-auto text-xs opacity-60 transition-transform",
                              isOpen && "rotate-180",
                            )}
                          >
                            ▾
                          </span>
                        </div>

                        <div
                          className={cn(
                            "ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-200",
                            isOpen
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0",
                          )}
                        >
                          {item.children.map((child) => {
                            const isChildActive = pathname === child.href;

                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "block rounded-md px-3 py-1.5 text-sm transition",
                                  isChildActive
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted",
                                )}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  // NORMAL ITEM
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpenSubmenus({})}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted",
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
