"use client"
import { dashboardLinks } from "@/constants/dashboard"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export default function AppTopbar() {
    const pathname = usePathname()
    const currentPage = dashboardLinks.find(link =>
        pathname.startsWith(link.url)
    )

    return (
        <header className="w-full h-16 flex items-center justify-between px-4 lg:px-8 border-b border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark">
            <Link href="/" className="md:hidden flex items-center gap-2">
                <Image src="/logo.svg" height={40} width={40} alt="logo" />
            </Link>
            <h2 className="font-bold text-xl">
                {currentPage?.title}
            </h2>
            <button className="md:hidden flex flex-col justify-center items-center text-red-500 text-xs" onClick={() => signOut({ callbackUrl: "/auth/login" })}>
                <LogOut size={16} />
            </button>
        </header>
    )
}