import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/shared/AppSidebar"
import AppTopbar from "@/components/shared/AppTopbar"
import AppBottomBar from "@/components/shared/AppBottombar"

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