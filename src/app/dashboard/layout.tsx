import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import AppTopbar from "@/components/app-topbar"
import AppBottomBar from "@/components/app-bottombar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full relative">
                <AppTopbar />
                {children}
                <AppBottomBar />
            </main>
        </SidebarProvider>
    )
}