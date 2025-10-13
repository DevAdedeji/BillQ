"use client"
import { dashboardLinks } from "@/constants/dashboard"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function AppTopbar() {
    const pathname = usePathname()
    const currentPage = dashboardLinks.find(link =>
        pathname.startsWith(link.url)
    )

    return (
        <header className="w-full h-16 flex items-center justify-between px-4 lg:px-8 border-b border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark">
            <Link href="/" className="md:hidden flex items-center gap-2">
                <Image src="/logo.svg" height={40} width={40} alt="logo" />
                <h2 className="text-2xl font-bold text-content-light dark:text-content-dark">
                    BillQ
                </h2>
            </Link>
            <h2 className="font-bold text-xl">
                {currentPage?.title}
            </h2>
        </header>
    )
}