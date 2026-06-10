import { Header } from "@/app/components/layout/Header";
import { Footer } from "@/app/components/layout/Footer";
import { Hero } from "@/app/components/sections/Hero";
import { BrowserSequence } from "@/app/components/sections/BrowserSequence";
import { ScrollyTelling } from "@/app/components/sections/ScrollyTelling";
import { Features } from "@/app/components/sections/Features";
import { Testimonials } from "@/app/components/sections/Testimonials";
import { FAQ } from "@/app/components/sections/FAQ";
import { FinalCTA } from "@/app/components/sections/FinalCTA";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <BrowserSequence />
      <ScrollyTelling />
      <Features />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
