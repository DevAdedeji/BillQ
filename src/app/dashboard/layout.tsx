"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/shared/AppSidebar"
import AppTopbar from "@/components/shared/AppTopbar"
import AppBottomBar from "@/components/shared/AppBottombar"
import { DashboardProvider } from "@/providers/dashboard-provider"
import { useCurrentUser } from "@/lib/session"
import { Loader } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useCurrentUser()
    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <Loader size={20} className="animate-spin" />
            </div>
        )
    }

    if (!user) {
        return <div>Unauthorized</div>
    }

    return (
        <DashboardProvider user={user}>
            <SidebarProvider>
                <AppSidebar />
                <main className="w-full relative">
                    <AppTopbar />
                    <div className="mb-20 mt-14 bg-[#F8FDFF]">
                        {children}
                    </div>
                    <AppBottomBar />
                </main>
            </SidebarProvider>
        </DashboardProvider>
    )
}
