import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Schema from "@/components/seo/Schema";
import { Toaster } from "sonner";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://swatihometuition.in'),
  title: "Swati Home Tuition Bureau | Patna's Best Home Tutors",
  description: "Get 100% verified, expert home tutors for CBSE, ICSE, BSEB, JEE & NEET in Patna. We enforce a strict 4-step safety protocol for your peace of mind.",
  keywords: [
    "Home Tutors in Patna",
    "Home Tuition Patna",
    "Best Home Tutors in Patna",
    "Female Home Tutor in Patna",
    "Home Tutor Boring Road Patna",
    "Home Tutor Kankarbagh Patna",
    "Home Tutor Patliputra Patna",
    "CBSE Home Tutors Patna",
    "ICSE Home Tuition Patna",
    "NEET Home Tutor Patna",
    "JEE Main Home Tutor Patna",
    "Swati Home Tuition Bureau",
    "Private Tutor Patna"
  ],
  alternates: {
    canonical: 'https://swatihometuition.in',
  },
  authors: [{ name: "Swati Home Tuition Bureau", url: "https://swatihometuition.in" }],
  creator: "Swati Home Tuition Bureau",
  publisher: "Swati Home Tuition Bureau",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
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
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
