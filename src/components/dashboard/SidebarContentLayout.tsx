"use client"

import Image from "next/image"
import Link from "next/link"
import { dashboardLinks } from "@/constants/dashboard"
import {
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Skeleton } from "../ui/skeleton"
import { usePathname } from "next/navigation"
import { User2 } from "lucide-react"
import { useCurrentUser } from "@/lib/session"

interface ContentLayoutProps {
    onLinkSelect?: () => void
}

export function SidebarContentLayout({ onLinkSelect = () => { } }: ContentLayoutProps) {
    const pathname = usePathname()
    const { user, isLoading } = useCurrentUser()
    return (
        <>
            <SidebarContent className="pt-6">
                <SidebarMenu>
                    {dashboardLinks.map((link) => {
                        const isActive = pathname.startsWith(link.url)
                        return (
                            <SidebarMenuItem key={link.title}>
                                <SidebarMenuButton asChild onClick={onLinkSelect} className={`hover:bg-blue-100 hover:text-primary ${isActive ? 'bg-blue-100 text-primary font-bold' : ''}`}>
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
        </>
    )
}
