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
                                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899l4-4a4 4 0 000-5.656l-1.1-1.1a4 4 0 00-5.658 5.656l4 4" strokeLinecap="round" stroke-linejoin="round" stroke-width="2"></path>
                            </svg>
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-content-light dark:text-content-dark">Smart PayLink</h3>
                        <p className="mt-2 text-base text-muted-light dark:text-muted-dark">
                            Generate a unique payment link for each invoice and share it with your clients. Get paid directly through Paystack or Stripe.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" stroke-linejoin="round" stroke-width="2"></path>
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
                                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" stroke-linejoin="round" stroke-width="2"></path>
                            </svg>
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-content-light dark:text-content-dark">Smart Reminders</h3>
                        <p className="mt-2 text-base text-muted-light dark:text-muted-dark">Set up automated payment reminders to ensure you get paid on time. Never miss a payment again.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}