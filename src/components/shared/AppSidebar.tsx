"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useDashboardStore } from "@/store/dashboard-store";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, User2 } from "lucide-react";
import { dashboardLinks } from "@/constants/dashboard";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useDashboardStore();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <Sidebar className="!w-[240px]">
      <SidebarHeader className="border-b px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
          aria-label="BillQ Home"
        >
          <Image
            src="/logo.svg"
            height={40}
            width={40}
            alt="BillQ logo"
            priority
          />
          <h2 className="text-2xl font-bold text-content-light dark:text-content-dark">
            BillQ
          </h2>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6">
        <SidebarMenu className="space-y-1">
          {dashboardLinks.map((link) => {
            const isActive = pathname.startsWith(link.url);
            const Icon = link.icon;

            return (
              <SidebarMenuItem key={link.title}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "h-11 rounded-lg transition-all duration-200",
                    "hover:bg-blue-50 hover:text-primary dark:hover:bg-blue-950/50",
                    isActive && "bg-blue-100 text-primary font-semibold dark:bg-blue-900/50"
                  )}
                >
                  <Link
                    href={link.url}
                    className="flex items-center gap-3 px-3"
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="text-sm">{link.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.name}'s profile picture`}
                  fill
                  className="rounded-full object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-primary dark:bg-blue-900/50">
                  <User2 className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-content-light dark:text-content-dark">
                {user.name}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className={cn(
                "shrink-0 rounded-md p-2 transition-colors",
                "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              )}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}