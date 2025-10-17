import { Settings, Users, ScrollText, CircleDollarSign } from "lucide-react"

export const dashboardLinks = [
    // {
    //     title: "Overview",
    //     url: "/dashboard/overview",
    //     icon: LayoutGrid,
    // },
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
        title: "Payments",
        url: "/dashboard/payments",
        icon: CircleDollarSign
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
]