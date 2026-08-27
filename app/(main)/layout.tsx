import SmoothScroll from "@/components/shared/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CallbackCTA from "@/components/layout/CallbackCTA";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import MobileBottomBar from "@/components/layout/MobileBottomBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <CallbackCTA />
        <Footer />
      </SmoothScroll>
      <div className="hidden lg:block">
        <FloatingWhatsApp />
      </div>
      <MobileBottomBar />
    </>
  );
}