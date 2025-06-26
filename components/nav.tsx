"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Plan", href: "/plan" },
  { name: "Generate Plan", href: "/generate-plan" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 w-full gap-6">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`transition font-medium ${
              isActive
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-primary"
            }`}>
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
