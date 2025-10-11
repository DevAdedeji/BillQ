"use client"
import { dashboardLinks } from "@/constants/dashboard"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SidebarContentLayout } from "./dashboard/SidebarContentLayout"
import { AppSidebar } from "./app-sidebar"

export default function AppTopbar() {
    const pathname = usePathname()
    const currentPage = dashboardLinks.find(link =>
        pathname.startsWith(link.url)
    )
    return (
        <header className="w-full h-16 flex items-center justify-between px-8 border-b border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark">
            <h2 className="font-bold text-xl">
                {currentPage?.title}
            </h2>
            <Sheet>
                <SheetTrigger className="md:hidden p-2">
                    <button>
                        <Menu className="w-6 h-6" />
                    </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    <SidebarContentLayout />
                </SheetContent>
            </Sheet>
        </header>
    )
}