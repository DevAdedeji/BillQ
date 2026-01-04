import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import Image from "next/image";

export default async function Footer() {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
              <Image src="/logo.svg" height={40} width={40} alt="BillQ logo" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                BillQ
              </h2>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Simple, powerful invoicing for modern businesses.
            </p>
          </div>

          {!isLoggedIn && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Get Started
              </h3>
              <Link
                href="/auth/login"
                className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary"
              >
                Sign Up
              </Link>
              <Link
                href="#features"
                className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary"
              >
                Features
              </Link>
            </div>
          )}

          <div className="flex flex-col justify-end gap-3 md:items-end">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} BillQ. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}