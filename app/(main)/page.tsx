import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import AcademicsGrid from "@/components/home/AcademicsGrid";
import BentoSafetyGrid from "@/components/home/BentoSafetyGrid";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import TuitionCalculator from "@/components/home/TuitionCalculator";
import Testimonials from "@/components/home/Testimonials";
import ServiceAreas from "@/components/home/ServiceAreas";
import FAQSection from "@/components/home/FAQSection";
import BlogsSection from "@/components/home/BlogsSection";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <AcademicsGrid />
      <BentoSafetyGrid />
      <ProcessTimeline />
      <TuitionCalculator />
      <Testimonials />
      <ServiceAreas />
      <FAQSection />
      <BlogsSection />
    </>
  );
}
