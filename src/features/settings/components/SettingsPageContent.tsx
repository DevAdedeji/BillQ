"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Account from "./Account"
import Password from "./Password"
import Themes from "./Themes"
export default function SettingsPageContent() {
    return (
        <div className="flex flex-col gap-6 px-4 py-8 lg:p-8">
            <Tabs defaultValue="account">
                <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                    <TabsTrigger value="themes">Themes</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="py-5">
                    <Account />
                </TabsContent>
                <TabsContent value="password" className="py-5">
                    <Password />
                </TabsContent>
                <TabsContent value="themes" className="py-5">
                    <Themes />
                </TabsContent>
            </Tabs>
        </div>
    )
}