import Image from "next/image"
import Link from "next/link"
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background-light to-blue-50 dark:from-background-dark dark:to-gray-900 p-4">
            <div className="w-full max-w-md space-y-8">
                <Link href="/" className="flex items-center gap-2 justify-center">
                    <Image src="/logo.svg" height={40} width={40} alt="logo" />
                    <h2 className="text-2xl font-bold text-content-light dark:text-content-dark">PayInvoice</h2>
                </Link>
                <div className="bg-card border border-border p-8 shadow-soft rounded-xl space-y-10">
                    <div className="flex flex-col items-center justify-center text-accent-foreground gap-2">
                        <h1 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark">Welcome Back</h1>
                        <p className="text-subtle-light dark:text-subtle-dark">Log in to manage your invoices.</p>
                    </div>
                    {children}
                </div>

            </div>
        </main>
    )
}