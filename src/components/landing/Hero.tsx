import Link
    from "next/link"
export default function Hero() {
    return (
        <section className="relative py-24 sm:py-32 lg:py-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="satoshi-font text-4xl font-bold tracking-tighter text-content-light dark:text-content-dark sm:text-6xl lg:text-7xl">
                    Invoicing Made <span className="text-primary">Effortless</span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-light dark:text-muted-dark">
                    A clean, intelligent invoicing web app for freelancers and small businesses. Generate invoices, send payment links, and get paid faster.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link className="w-full sm:w-auto rounded-full bg-primary px-8 py-3 text-base font-semibold text-white shadow-soft transition-transform hover:scale-105" href="/auth/login">
                        Start Invoicing in Seconds
                    </Link>
                </div>
            </div>
        </section>
    )
}