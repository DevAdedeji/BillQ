"use client";

import Link from "next/link";
import { dashboardLinks } from "@/constants/dashboard";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AppBottomBar() {
  const pathname = usePathname();
  return (
    <footer className="flex bg-white md:hidden fixed right-0 left-0 bottom-0 w-full min-h-16 py-3 items-center justify-between px-4 lg:px-8 border-t border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark">
      <div className="w-full flex items-center justify-between">
        {dashboardLinks.map((link) => {
          const isActive = pathname.startsWith(link.url);
          return (
            <Link
              key={link.title}
              href={link.url}
              className={`flex flex-col items-center justify-center text-center gap-1 text-xs ${isActive ? "opacity-100" : "opacity-50"}`}
            >
              <div
                className={`border border-gray-300 bg-blue-100 rounded-lg size-8 flex items-center justify-center`}
              >
                <link.icon size={16} />
              </div>
              <p>{link.title}</p>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
