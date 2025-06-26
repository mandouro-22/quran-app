"use client";

const navLinks = [
  { name: "الصفحه الرئيسيه", href: "/dashboard/home" },
  { name: "الخطه", href: "/dashboard/dailylog" },
  { name: "اٍنشاء خطه", href: "/dashboard/generate-plan" },
];

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className="hidden sm:flex flex-1 w-full gap-6">
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
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
      <div className="sm:hidden cursor-pointer" onClick={() => setOpen(true)}>
        <Menu />
      </div>
      {open ? (
        <div
          className="fixed left-0 top-0 right-0 bottom-0 w-full h-full bg-black/40 z-30 backdrop-blur-sm overflow-hidden"
          onClick={() => setOpen(false)}
        >
          <div className="absolute right-0 top-0 h-full w-[40%] bg-gradient-to-b dark:from-purple-900/30 dark:to-purple-700/50 from-purple-900/10 to-purple-700/15 z-30" />
          <div
            className="absolute right-0 top-0 h-full w-[40%] backdrop-blur-md shadow-xl flex flex-col space-y-4 z-40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* from-purple-900 to-purple-500 */}
            <div className="border-b  py-4 px-2.5 flex items-center justify-between">
              <h1 className="text-2xl text-white font-extrabold">قرأنى</h1>
              <ThemeSwitcher />
            </div>

            <div className="flex flex-col space-y-3 px-2.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition font-medium text-gray-200 w-fit ${
                      isActive && "text-white underline"
                      // : "text-muted-foreground hover:text-primary"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
