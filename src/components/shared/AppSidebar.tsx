"use client"

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter
} from "@/components/ui/sidebar"
import { useDashboardStore } from "@/store/dashboard-store"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LogOut, User2 } from "lucide-react"
import { dashboardLinks } from "@/constants/dashboard"
import { signOut } from "next-auth/react"

export function AppSidebar() {
    const pathname = usePathname()
    const { user } = useDashboardStore()
    return (
        <Sidebar className="!w-[240px]">
            <SidebarHeader className="pt-4 border-b">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.svg" height={40} width={40} alt="logo" />
                    <h2 className="text-2xl font-bold text-content-light dark:text-content-dark">
                        BillQ
                    </h2>
                </Link>
            </SidebarHeader>
            <SidebarContent className="pt-6">
                <SidebarMenu>
                    {dashboardLinks.map((link) => {
                        const isActive = pathname.startsWith(link.url)
                        return (
                            <SidebarMenuItem key={link.title}>
                                <SidebarMenuButton asChild className={`hover:bg-blue-100 h-10 hover:text-primary ${isActive ? 'bg-blue-100 text-primary font-bold' : ''}`}>
                                    <Link href={link.url} className="flex items-center gap-2">
                                        <link.icon />
                                        <span>{link.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="pb-4 border-t">
                {
                    user &&
                    <div className="flex items-center justify-between gap-1">
                        {
                            user.image?.length ?
                                <Image src={user.image} alt={user.name + "profile picture"} height={40} width={40} className="rounded-full" />
                                :
                                <User2 />
                        }
                        <div className="w-[60%] text-sm flex flex-col gap-1">
                            <p className="w-full truncate">{user.name}</p>
                            <p className="w-full truncate text-xs">{user.email}</p>
                        </div>
                        <button className="text-red-500" onClick={() => signOut({ callbackUrl: "/auth/login" })}>
                            <LogOut />
                        </button>
                    </div>
                }
            </SidebarFooter>
        </Sidebar>
    )
}
