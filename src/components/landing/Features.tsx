export default function Features() {
    return (
        <section className="py-24 sm:py-32 bg-surface-light dark:bg-surface-dark" id="features">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="satoshi-font text-3xl font-bold tracking-tight text-content-light dark:text-content-dark sm:text-4xl">Everything you need to get paid</h2>
                    <p className="mt-4 text-lg text-muted-light dark:text-muted-dark">Powerful features to streamline your invoicing workflow.</p>
                </div>
                <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899l4-4a4 4 0 000-5.656l-1.1-1.1a4 4 0 00-5.658 5.656l4 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                            </svg>
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-content-light dark:text-content-dark">
                            Smart Payment Flow
                        </h3>
                        <p className="mt-2 text-base text-muted-light dark:text-muted-dark">
                            Clients can pay directly from the public invoice page using Stripe. Once payment succeeds, the invoice updates automatically.
                        </p>

                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                            </svg>
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-content-light dark:text-content-dark">AI Invoice Assistant</h3>
                        <p className="mt-2 text-base text-muted-light dark:text-muted-dark">
                            Let our AI assistant create invoices for you based on your client&apos;s details and project scope. Save time and effort.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m2 4v1m-6 4h12a2 2 0 002-2V7a2 2 0 00-2-2h-3.5l-1-1h-3l-1 1H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-content-light dark:text-content-dark">Real-Time Tracking</h3>
                        <p className="mt-2 text-base text-muted-light dark:text-muted-dark">
                            See when clients view or pay your invoices, with live status updates and analytics.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    )
}