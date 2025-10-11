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

export function SidebarContentLayout() {
    return (
        <>
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
                    {dashboardLinks.map((link) => (
                        <SidebarMenuItem key={link.title}>
                            <SidebarMenuButton asChild>
                                <Link href={link.url} className="flex items-center gap-2">
                                    <link.icon />
                                    <span>{link.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                {/* <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> Username
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu> */}
            </SidebarFooter>
        </>
    )
}
