import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/homepage/Hero";
import { Features } from "@/components/homepage/Features";
import { HowItWorks } from "@/components/homepage/HowItWorks";
import { Testimonial } from "@/components/homepage/Testimonial";
import { BottomCta } from "@/components/homepage/BottomCta";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <div className="w-full bg-diagonal-stripes py-12 sm:py-16 flex flex-col gap-12 sm:gap-16">
          <Features className="!py-0 !bg-transparent" />
          <HowItWorks className="!py-0 !bg-transparent" />
          <Testimonial className="!py-0 !bg-transparent" />
        </div>
        <BottomCta />
        <div className="w-full h-12 bg-diagonal-stripes" aria-hidden="true" />
      </main>
      <Footer />
    </div>
  );
}
