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
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LogOut, User2 } from "lucide-react"
import { dashboardLinks } from "@/constants/dashboard"
import { useCurrentUser } from "@/lib/session"
import { signOut } from "next-auth/react"

export function AppSidebar() {
    const pathname = usePathname()
    const { user, isLoading } = useCurrentUser()
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
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild onClick={() => signOut({ callbackUrl: "/login" })}>
                            <div className="h-10 flex items-center gap-2 text-red-500">
                                <LogOut />
                                <span>Log out</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="pb-4">
                {
                    !user && isLoading &&
                    <Skeleton className="h-12 bg-slate-300" />
                }
                {
                    user && !isLoading &&
                    <div className="flex items-center gap-4">
                        {
                            user.image?.length ?
                                <Image src={user.image} alt={user.name + "profile picture"} height={40} width={40} className="rounded-full" />
                                :
                                <User2 />
                        }
                        <div className="w-[70%] text-sm flex flex-col gap-2">
                            <p className="w-full truncate">{user.name}</p>
                            <p className="w-full truncate">{user.email}</p>
                        </div>
                    </div>
                }
            </SidebarFooter>
        </Sidebar>
    )
}