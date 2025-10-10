import Link from "next/link"
import Image from "next/image"

export default function Footer() {
    return (
        <footer className="border-t border-border-light dark:border-border-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                    <div className="flex items-center gap-3">
                        <Image src="/logo.svg" height={40} width={40} alt="logo" />
                        <h2 className="text-2xl font-bold text-content-light dark:text-content-dark">PayInvoice</h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <Link className="text-sm text-muted-light dark:text-muted-dark hover:text-primary" href="/auth/login">Login</Link>
                        <Link className="text-sm text-muted-light dark:text-muted-dark hover:text-primary" href="/auth/signup">Signup</Link>
                    </div>
                    <p className="text-sm text-muted-light dark:text-muted-dark">© {new Date().getFullYear()} PayInvoice. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}