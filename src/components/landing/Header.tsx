import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default async function Header() {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-lg dark:border-gray-800/50 dark:bg-gray-900/80">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <Image src="/logo.svg" height={40} width={40} alt="BillQ logo" priority />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              BillQ
            </h2>
          </Link>

          {isLoggedIn ? (
            <Link
              href="/dashboard/invoices"
              className={cn(
                "inline-flex h-10 items-center rounded-lg bg-primary px-6 text-sm font-medium text-white",
                "transition-all hover:bg-primary/90 hover:shadow-lg",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className={cn(
                  "hidden h-10 items-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-gray-700 sm:inline-flex",
                  "transition-all hover:bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className={cn(
                  "inline-flex h-10 items-center rounded-lg bg-primary px-6 text-sm font-medium text-white",
                  "transition-all hover:bg-primary/90 hover:shadow-lg",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}