import {
    Sidebar,
} from "@/components/ui/sidebar"
import { SidebarContentLayout } from "./dashboard/SidebarContentLayout"

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContentLayout />
        </Sidebar>
    )
}