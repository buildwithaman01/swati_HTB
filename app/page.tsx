import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import BentoSafetyGrid from "@/components/home/BentoSafetyGrid";
import Testimonials from "@/components/home/Testimonials";
import AcademicsGrid from "@/components/home/AcademicsGrid";

import SwatiJourney from "@/components/home/SwatiJourney";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import TuitionCalculator from "@/components/home/TuitionCalculator";
import ServiceAreas from "@/components/home/ServiceAreas";
import BlogsSection from "@/components/home/BlogsSection";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <BentoSafetyGrid />
      <SwatiJourney />
      <AcademicsGrid />

      <ProcessTimeline />
      <Testimonials />
      <TuitionCalculator />
      <ServiceAreas />
      <BlogsSection />
    </>
  );
}
