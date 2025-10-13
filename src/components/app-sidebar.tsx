import {
    Sidebar,
    SidebarHeader
} from "@/components/ui/sidebar"
import { SidebarContentLayout } from "./dashboard/SidebarContentLayout"
import Link from "next/link"
import Image from "next/image"

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className="pt-4">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.svg" height={40} width={40} alt="logo" />
                    <h2 className="text-2xl font-bold text-content-light dark:text-content-dark">
                        BillQ
                    </h2>
                </Link>
            </SidebarHeader>
            <SidebarContentLayout />
        </Sidebar>
    )
}