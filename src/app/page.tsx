import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="font-sans relative">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
