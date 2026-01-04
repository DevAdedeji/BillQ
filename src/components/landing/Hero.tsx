import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Invoicing</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
            Invoicing Made{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Effortless
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            A clean, intelligent invoicing platform for freelancers and small
            businesses. Generate professional invoices, send payment links, and
            get paid faster—all in one place.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signup"
              className={cn(
                "group inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-semibold text-white sm:w-auto",
                "transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
            >
              <span>Start Free Today</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#features"
              className={cn(
                "inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-8 text-base font-semibold text-gray-700 sm:w-auto",
                "transition-all hover:bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
            >
              Learn More
            </Link>
          </div>

          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Trusted by freelancers and businesses worldwide
            </p>
            <div className="flex items-center gap-8 opacity-60 grayscale">
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}