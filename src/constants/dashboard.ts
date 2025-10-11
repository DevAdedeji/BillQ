import { LayoutGrid, Settings, Users, ScrollText } from "lucide-react"

export const dashboardLinks = [
    {
        title: "Overview",
        url: "/dashboard/overview",
        icon: LayoutGrid,
    },
    {
        title: "Invoices",
        url: "/dashboard/invoices",
        icon: ScrollText,
    },
    {
        title: "Clients",
        url: "/dashboard/clients",
        icon: Users,
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
]