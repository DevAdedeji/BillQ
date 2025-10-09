import Link from "next/link"

export default function Footer() {
    return (
        <footer className="border-t border-border-light dark:border-border-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                    <div className="flex items-center gap-3">
                        <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 2.5C4 2.22386 4.22386 2 4.5 2H19.5C19.7761 2 20 2.22386 20 2.5V3.5C20 3.77614 19.7761 4 19.5 4H4.5C4.22386 4 4 3.77614 4 3.5V2.5Z"></path>
                            <path d="M4 20.5C4 20.2239 4.22386 20 4.5 20H12.5C12.7761 20 13 20.2239 13 20.5V21.5C13 21.7761 12.7761 22 12.5 22H4.5C4.22386 22 4 21.7761 4 21.5V20.5Z"></path>
                            <path clipRule="evenodd" d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6V18C20 18.5523 19.5523 19 19 19H5C4.44772 19 4 18.5523 4 18V6ZM6 7V17H18V7H6Z" fillRule="evenodd"></path>
                            <path d="M8 9.5C8 9.22386 8.22386 9 8.5 9H15.5C15.7761 9 16 9.22386 16 9.5V10.5C16 10.7761 15.7761 11 15.5 11H8.5C8.22386 11 8 10.7761 8 10.5V9.5Z"></path>
                            <path d="M8 13.5C8 13.2239 8.22386 13 8.5 13H15.5C15.7761 13 16 13.2239 16 13.5V14.5C16 14.7761 15.7761 15 15.5 15H8.5C8.22386 15 8 14.7761 8 14.5V13.5Z"></path>
                        </svg>
                        <h2 className="satoshi-font text-2xl font-bold text-content-light dark:text-content-dark">PayInvoice</h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <Link className="text-sm text-muted-light dark:text-muted-dark hover:text-primary" href="#">Login</Link>
                        <Link className="text-sm text-muted-light dark:text-muted-dark hover:text-primary" href="#">Signup</Link>
                    </div>
                    <p className="text-sm text-muted-light dark:text-muted-dark">© {new Date().getFullYear()} PayInvoice. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}