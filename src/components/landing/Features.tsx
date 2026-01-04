import {
  Zap,
  Brain,
  LineChart,
  Shield,
  CreditCard,
  Clock
} from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Smart Payment Flow",
    description:
      "Clients can pay directly from the public invoice page using Stripe. Once payment succeeds, the invoice updates automatically.",
  },
  {
    icon: Brain,
    title: "AI Invoice Assistant",
    description:
      "Let our AI assistant create invoices for you based on your client's details and project scope. Save time and effort.",
  },
  {
    icon: LineChart,
    title: "Real-Time Tracking",
    description:
      "See when clients view or pay your invoices, with live status updates and comprehensive analytics.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Create and send professional invoices in seconds. Our streamlined interface keeps you focused on what matters.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Bank-level security with automated backups. Your data is encrypted and protected at all times.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-gray-50 py-24 dark:bg-gray-950"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to get paid
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Powerful features designed to streamline your invoicing workflow and
            help you focus on growing your business.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-primary/50 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
