import Link from "next/link"
import Image from "next/image"

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image src="/logo.svg" height={40} width={40} alt="logo" />
                        <h2 className="text-2xl font-bold text-content-light dark:text-content-dark">BillQ</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link className="hidden sm:inline-block text-sm font-medium text-muted-light dark:text-muted-dark transition-transform hover:scale-105 px-5 py-2.5 border border-light rounded-full" href="/auth/login">Log in</Link>
                        <Link className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-transform hover:scale-105" href="/auth/signup">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    )
}