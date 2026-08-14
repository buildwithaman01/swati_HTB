import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/shared/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Schema from "@/components/seo/Schema";
import { Toaster } from "sonner";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://swatihometuition.in'),
  title: "Swati Home Tuition Bureau | Patna's Best Home Tutors",
  description: "Get 100% verified, expert home tutors for CBSE, ICSE, BSEB, JEE & NEET in Patna. We enforce a strict 4-step safety protocol for your peace of mind.",
  openGraph: {
    title: "Swati Home Tuition Bureau | Top Home Tutors in Patna",
    description: "Book a free demo class today with Patna's most trusted home tuition bureau. Serving Boring Road, Kankarbagh, Patliputra, and 86+ localities.",
    url: 'https://swatihometuition.in',
    siteName: 'Swati Home Tuition Bureau',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Swati Home Tuition Bureau - Patna',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swati Home Tuition Bureau | Patna',
    description: '100% Verified Home Tutors in Patna. Book a free demo class today.',
    images: ['/opengraph-image.png'],
  },
  verification: {
    google: 'ul-LQEK-lIiBVKErNdtu1ZBTfTMHS4ec4VaHYbkCU_o',
  },
};

import Footer from "@/components/layout/Footer";
import CallbackCTA from "@/components/layout/CallbackCTA";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <Schema />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-39XVSJXHET"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-39XVSJXHET');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-[#FAFAF8]">
        <SmoothScroll>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <CallbackCTA />
          <Footer />
        </SmoothScroll>
        <FloatingWhatsApp />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
